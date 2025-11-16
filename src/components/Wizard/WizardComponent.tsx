import { observer } from "mobx-react-lite";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../Overlay/Overlay";
import { Flex } from "antd";
import classes from "./WizardComponent.module.css";
import { makeAutoObservable, reaction } from "mobx";
import PrimaryButton from "../Button/PrimaryButton";
import { log } from "../../logging";
import SecondaryButton from "../Button/SecondaryButton";

export class Continuation {
  private _canContinue: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public get canContinue(): boolean {
    return this._canContinue;
  }

  public set canContinue(canContinue: boolean) {
    this._canContinue = canContinue;
  }
}

export const ContinuationContext = createContext(new Continuation());

export interface WizardConfigurationStep {
  title: ReactNode;
  subtitle: string;
  content: ReactNode;
  condition?: () => Promise<boolean>;
  handler?: () => Promise<boolean>;
  isInformation?: boolean;
}

export interface WizardConfiguration {
  steps: WizardConfigurationStep[];
  dynamicStepAmount: boolean;
  reset: () => void;
  finish?: () => Promise<void>;
  continuationContext?: Continuation;
}

export class WizardConfigurationStore {
  private _configuration: WizardConfiguration;
  private _index: number;
  private _canContinue: boolean = false;

  constructor(configuration: WizardConfiguration) {
    this._configuration = configuration;
    this._index = -1;
    makeAutoObservable(this);
    if (configuration.continuationContext) {
      reaction(
        () => configuration.continuationContext?.canContinue,
        (canContinue) => {
          log.debug({ canContinue: canContinue }, "canContinue changed");
          this._canContinue = canContinue ?? false;
        },
      );
    }
  }

  public get configuration(): WizardConfiguration {
    return this._configuration;
  }

  public get step(): WizardConfigurationStep {
    return this._configuration.steps[this._index];
  }

  public get index(): number {
    return this._index;
  }

  public get stepAmount(): number | null {
    if (this._configuration.dynamicStepAmount) {
      return null;
    }
    return this._configuration.steps.length;
  }

  // TODO make separet index update
  private checkCondition(index: number): Promise<boolean> {
    if (index >= this._configuration.steps.length) {
      return Promise.resolve(false);
    }
    const condition = this._configuration.steps[index].condition;
    if (condition === undefined || condition === null) {
      this._index = index;
      return Promise.resolve(true);
    }
    return condition().then((result): Promise<boolean> => {
      if (result) {
        this._index = index;
        return Promise.resolve(true);
      } else {
        return this.checkCondition(index + 1);
      }
    });
  }

  private nextIteration() {
    // todo make separet index update
    this.checkCondition(this._index + 1).then((success) => {
      if (
        success &&
        this.configuration.steps.at(this._index)?.isInformation === true
      ) {
        this.canContinue = true;
        return;
      }
      this.canContinue = false;
      if (!success) {
        const finish = this.configuration.finish;
        log.debug({ finish: finish }, "Checking for finish function");
        if (finish) {
          finish().then(() => {
            this.reset();
          });
        } else {
          this.reset();
        }
      }
    });
  }

  public next() {
    log.debug(
      {
        index: this._index,
        len: this._configuration.steps.length,
        steps: this._configuration.steps,
      },
      "Calling next step",
    );
    if (this.step && this.step.handler) {
      return this.step.handler().then((result) => {
        if (result) {
          this.nextIteration();
        }
      });
    } else {
      this.nextIteration();
    }
  }

  public reset() {
    this._index = -1;
    this._configuration.reset();
  }

  // TODO remove public access
  public set canContinue(value: boolean) {
    this._canContinue = value;
  }

  public get canContinue() {
    return this._canContinue;
  }
}

export const WizardConfigurationStoreContext =
  createContext<WizardConfigurationStore | null>(null);

export const Wizard = observer(
  ({
    configurationStore,
  }: {
    configurationStore: WizardConfigurationStore;
  }) => {
    const parentModalState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      () =>
        new ModalState(parentModalState, () => {
          configurationStore.reset();
        }),
    );

    useEffect(() => {
      log.debug("registering reaction for dialog state");
      reaction(
        () => configurationStore.index,
        () => {
          dialogState.show = configurationStore.index > -1;
          log.debug(
            { show: dialogState.show, index: configurationStore.index },
            "reaction to wizard index",
          );
        },
      );
    }, [configurationStore, dialogState]);

    return (
      <>
        {configurationStore.index > -1 && (
          <ModalStateContext.Provider value={dialogState}>
            <Overlay>
              <Panel>
                <Title>{configurationStore.step.title}</Title>
                <div className={`${classes.subtitle}`}>
                  {configurationStore.step.subtitle}
                </div>
                <Flex>{configurationStore.step.content}</Flex>
                <Flex className={`${classes.buttons}`}>
                  {configurationStore.stepAmount && (
                    <div>
                      Шаг {configurationStore.index + 1} из{" "}
                      {configurationStore.stepAmount}
                    </div>
                  )}
                  {!configurationStore.stepAmount && (
                    <div>Шаг {configurationStore.index + 1}</div>
                  )}
                  <Flex gap={9} justify="flex-end">
                    <SecondaryButton onClick={() => configurationStore.reset()}>
                      Отменить
                    </SecondaryButton>
                    <PrimaryButton
                      disabled={!configurationStore.canContinue}
                      onClick={() => configurationStore.next()}
                    >
                      Далее
                    </PrimaryButton>
                  </Flex>
                </Flex>
              </Panel>
            </Overlay>
          </ModalStateContext.Provider>
        )}
      </>
    );
  },
);
