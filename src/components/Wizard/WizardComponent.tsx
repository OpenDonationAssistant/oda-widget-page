import { observer } from "mobx-react-lite";
import { ReactNode, useContext, useEffect, useState } from "react";
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
import { NotBorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { log } from "../../logging";

export interface WizardConfigurationStep {
  title: ReactNode;
  subtitle: string;
  content: ReactNode;
  handler?: () => void;
}

export interface WizardConfiguration {
  steps: WizardConfigurationStep[];
}

export class WizardConfigurationStore {
  private _configuration: WizardConfiguration;
  private _index: number;

  constructor(configuration: WizardConfiguration) {
    this._configuration = configuration;
    this._index = -1;
    makeAutoObservable(this);
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
    return this._configuration.steps.length;
  }

  public next() {
    if (this.index > -1 && this.step.handler) {
      this.step.handler();
    }
    this._index = this._index + 1;
    if (this._index >= this._configuration.steps.length) {
      this.reset();
    }
  }

  public reset() {
    this._index = -1;
  }
}

const Wizard = observer(
  ({
    configurationStore,
  }: {
    configurationStore: WizardConfigurationStore;
  }) => {
    const parentModalState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      new ModalState(parentModalState),
    );

    useEffect(() => {
      reaction(
        () => configurationStore.index,
        () => {
          dialogState.show = configurationStore.index > -1;
          log.debug(
            { state: dialogState.show, index: configurationStore.index },
            "reaction to wizard index",
          );
        },
      );
    }, [configurationStore]);

    return (
      <>
        {configurationStore.index > -1 && (
          <ModalStateContext.Provider value={dialogState}>
            <Overlay>
              <Panel>
                <Title>
                  <Flex className="full-width" justify="space-between">
                    <Flex>{configurationStore.step.title}</Flex>
                    <NotBorderedIconButton
                      onClick={() => configurationStore.reset()}
                    >
                      <CloseIcon color="var(--oda-color-1000)" />
                    </NotBorderedIconButton>
                  </Flex>
                </Title>
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
                  <PrimaryButton onClick={() => configurationStore.next()}>
                    Далее
                  </PrimaryButton>
                </Flex>
              </Panel>
            </Overlay>
          </ModalStateContext.Provider>
        )}
      </>
    );
  },
);

export { Wizard };
