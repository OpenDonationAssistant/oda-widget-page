import { observer } from "mobx-react-lite";
import { makeAutoObservable, reaction } from "mobx";
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../Overlay/Overlay";
import { Card, CardList, CardTitle } from "../Cards/CardsComponent";
import { Flex } from "antd";
import { Wizard, WizardConfigurationStore } from "./WizardComponent";
import classes from "./WizardCollection.module.css";

export class WizardCollectionStore {
  private _show: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public get show(): boolean {
    return this._show;
  }

  public set show(show: boolean) {
    this._show = show;
  }

  public open() {
    this.show = true;
  }

  public close() {
    this.show = false;
  }
}

export interface WizardCollectionItem {
  title: ReactNode;
  description: ReactNode;
  wizard: WizardConfigurationStore;
}

export const WizardCollection = observer(
  ({
    title,
    store,
    wizards,
  }: {
    title: ReactNode;
    store: WizardCollectionStore;
    wizards: WizardCollectionItem[];
  }) => {
    const parentModalState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    useEffect(() => {
      reaction(
        () => store.show,
        (show) => {
          dialogState.show = show;
        },
      );
    }, [store, dialogState]);

    return (
      <ModalStateContext.Provider value={dialogState}>
        <Overlay>
          <Panel>
            <Title>{title}</Title>
            <Flex
              vertical
              gap={12}
              className="withscroll"
              style={{ maxHeight: "75vh" }}
            >
              <CardList>
                {wizards.map((item, index) => (
                  <Card
                    key={index}
                    onClick={() => {
                      store.close();
                      item.wizard.next();
                    }}
                  >
                    <CardTitle>{item.title}</CardTitle>
                    <div className={`${classes.description}`}>
                      {item.description}
                    </div>
                  </Card>
                ))}
              </CardList>
            </Flex>
          </Panel>
        </Overlay>
        {wizards.map((item, index) => (
          <Wizard key={index} configurationStore={item.wizard} />
        ))}
      </ModalStateContext.Provider>
    );
  },
);
