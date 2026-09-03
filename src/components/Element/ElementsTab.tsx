import { observer } from "mobx-react-lite";
import { Element, ElementContainer } from "./Element";
import { createContext, useContext, useState } from "react";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
  Warning,
} from "../Overlay/Overlay";
import { AdvancedSettingsStoreContext } from "../../stores/AdvancedSettingsStore";
import classes from "./ElementsTab.module.css";
import { LightLabeledSwitchComponent } from "../LabeledSwitch/LabeledSwitchComponent";
import { Flex, Switch } from "antd";
import { AddListItemButton, CollapsibleListItem, List } from "../List/List";
import { Card, CardList, CardTitle } from "../Cards/CardsComponent";
import { uuidv7 } from "uuidv7";
import { SmallEditableString } from "../RenamableLabel/EditableString";
import { BorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { ElementDescription } from "./ElementFactory";
import { log } from "../../logging";

class AddElementDialogState {
  constructor(
    public modalState: ModalState,
    public parentId: string | null,
  ) {}

  public addTo(elementId: string | null) {
    this.parentId = elementId;
    this.modalState.show = true;
  }
}

export const AddElementDialogStateContext = createContext(
  new AddElementDialogState(new ModalState(), null),
);

const ElementsItemComponent = observer(
  ({ element }: { element: Element<any>; advanced?: boolean }) => {
    const parentModalState = useContext(ModalStateContext);
    const [deleteDialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const advanced = useContext(AdvancedSettingsStoreContext).enabled;

    return (
      <CollapsibleListItem
        title={
          <Flex align="center" gap={6}>
            {advanced &&
              Array.from(Array(element.data.advancedLevel + 1).keys()).map(
                () => <div className={`${classes.indent}`} />,
              )}
            {advanced ? (
              <SmallEditableString
                label={element.data.name}
                onChange={(value) => (element.data.name = value)}
              />
            ) : (
              <span className={`${classes.elementtitle}`}>
                {element.data.name}
              </span>
            )}
            <Switch
              checked={element.data.enabled}
              onChange={(value) => (element.data.enabled = value)}
            />
          </Flex>
        }
        actions={
          <Flex align="center" justify="flex-end" gap={3}>
            <ModalStateContext.Provider value={deleteDialogState}>
              <Overlay>
                <Warning
                  action={() => {
                    deleteDialogState.show = false;
                    element.delete();
                  }}
                >
                  Вы точно хотите удалить оповещение?
                </Warning>
              </Overlay>
              {advanced && (
                <>
                  <BorderedIconButton
                    onClick={() => {
                      element.moveDown();
                    }}
                  >
                    <span
                      style={{ color: "var(--oda-color-950)" }}
                      className="material-symbols-sharp"
                    >
                      keyboard_double_arrow_down
                    </span>
                  </BorderedIconButton>
                  <BorderedIconButton
                    onClick={() => {
                      element.moveUp();
                    }}
                  >
                    <span
                      style={{ color: "var(--oda-color-950)" }}
                      className="material-symbols-sharp"
                    >
                      keyboard_double_arrow_up
                    </span>
                  </BorderedIconButton>
                  <BorderedIconButton
                    onClick={() => (deleteDialogState.show = true)}
                  >
                    <CloseIcon color="#FF8888" />
                  </BorderedIconButton>
                </>
              )}
            </ModalStateContext.Provider>
          </Flex>
        }
      >
        {element.markup()}
      </CollapsibleListItem>
    );
  },
);

export const ElementsTab = observer(
  ({
    alert,
    elements,
    available,
  }: {
    alert: ElementContainer;
    elements: Element<any>[];
    available: ElementDescription[];
  }) => {
    const parentModalState = useContext(ModalStateContext);
    const [addElementDialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const advanced = useContext(AdvancedSettingsStoreContext);
    const dialogState = new AddElementDialogState(addElementDialogState, null);

    return (
      <div className={`${classes.tabcontainer}`}>
        <div className={`${classes.mode}`}>
          <LightLabeledSwitchComponent
            label="Расширенный режим"
            value={advanced.enabled}
            onChange={() => {
              advanced.enabled = !advanced.enabled;
            }}
          />
        </div>
        <List>
          <AddElementDialogStateContext.Provider value={dialogState}>
            {elements
              .sort((a, b) => a.data.order - b.data.order)
              .map((element, index) => (
                <ElementsItemComponent key={index} element={element} />
              ))}
            <ModalStateContext.Provider value={addElementDialogState}>
              {advanced.enabled && (
                <AddListItemButton
                  label="Добавить элемент"
                  onClick={() => {
                    dialogState.addTo(null);
                  }}
                />
              )}
              <Overlay>
                <Panel>
                  <Title>Добавить элемент</Title>
                  <CardList>
                    {available.map((element) => (
                      <Card
                        key={element.type}
                        onClick={() => {
                          let level = 0;
                          let advancedLevel = 0;
                          let order = elements.length;
                          if (dialogState.parentId) {
                            const parent = elements.find(
                              (el) => el.data.id === dialogState.parentId,
                            );
                            level =
                              (parent?.data.level ?? -1) +
                              (element.advanced ? 0 : 1);
                            advancedLevel =
                              (parent?.data.advancedLevel ?? -1) + 1;

                            order =
                              (parent?.data.order ?? 0) +
                              elements.filter(
                                (el) =>
                                  el.data.containerId === dialogState.parentId,
                              ).length +
                              1;
                          }
                          log.debug(
                            {
                              element: element,
                              level: level,
                              advancedLevel: advancedLevel,
                            },
                            "adding element",
                          );
                          alert.addElement({
                            data: {
                              id: uuidv7(),
                              containerId: null,
                              level: level,
                              advanced: element.advanced,
                              advancedLevel: advancedLevel,
                              type: element.type,
                              name: element.name,
                              enabled: true,
                              settings: element.settings,
                              order: order,
                            },
                            parentId: dialogState.parentId,
                          });
                          addElementDialogState.show = false;
                        }}
                      >
                        <CardTitle>{element.name}</CardTitle>
                      </Card>
                    ))}
                  </CardList>
                </Panel>
              </Overlay>
            </ModalStateContext.Provider>
          </AddElementDialogStateContext.Provider>
        </List>
      </div>
    );
  },
);
