import { observer } from "mobx-react-lite";
import { Element, ElementContainer, ElementData } from "./Element";
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
import { DEFAULT_LABEL_ELEMENT_SETTINGS } from "./LabelElement/LabelElement";
import { DEFAULT_MEDIA_ELEMENT_SETTINGS } from "./MediaElement/MediaElement";
import { DEFAULT_CONTAINER_ELEMENT_SETTINGS } from "./ContainerElement/ContainerElement";
import { SmallEditableString } from "../RenamableLabel/EditableString";
import { BorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { DEFAULT_MARQUEE_ELEMENT_SETTINGS } from "./MarqueeElement/MarqueeElement";
import { DEFAULT_SLIDESHOW_ELEMENT_SETTINGS } from "./SlideShowElement/SlideShowElement";
import { DEFAULT_QR_ELEMENT_SETTINGS } from "./QRElement/QRElement";
import { DEFAULT_TIMED_ELEMENT_SETTINGS } from "./TimedElement/TimedElement";

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
        first={
          <Flex align="center" gap={6}>
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
        second={
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
                <BorderedIconButton
                  onClick={() => (deleteDialogState.show = true)}
                >
                  <CloseIcon color="#FF8888" />
                </BorderedIconButton>
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
  }: {
    alert: ElementContainer;
    elements: Element<any>[];
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
            {elements.map((element, index) => (
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
                    <Card
                      onClick={() => {
                        alert.addElement({
                          data: {
                            id: uuidv7(),
                            containerId: null,
                            type: "label",
                            name: "Надпись",
                            enabled: true,
                            settings: DEFAULT_LABEL_ELEMENT_SETTINGS,
                          },
                          parentId: dialogState.parentId,
                        });
                        addElementDialogState.show = false;
                      }}
                    >
                      <CardTitle>Надпись</CardTitle>
                    </Card>
                    <Card
                      onClick={() => {
                        alert.addElement({
                          data: {
                            id: uuidv7(),
                            containerId: null,
                            type: "media",
                            name: "Изображение/Видео",
                            enabled: true,
                            settings: DEFAULT_MEDIA_ELEMENT_SETTINGS,
                          },
                          parentId: dialogState.parentId,
                        });
                        addElementDialogState.show = false;
                      }}
                    >
                      <CardTitle>Изображение/Видео</CardTitle>
                    </Card>
                    <Card
                      onClick={() => {
                        alert.addElement({
                          data: {
                            id: uuidv7(),
                            containerId: null,
                            type: "container",
                            name: "Контейнер",
                            enabled: true,
                            settings: DEFAULT_CONTAINER_ELEMENT_SETTINGS,
                          },
                          parentId: dialogState.parentId,
                        });
                        addElementDialogState.show = false;
                      }}
                    >
                      <CardTitle>Контейнер</CardTitle>
                    </Card>
                    <Card
                      onClick={() => {
                        alert.addElement({
                          data: {
                            id: uuidv7(),
                            containerId: null,
                            type: "marquee",
                            name: "Бегущая строка",
                            enabled: true,
                            settings: DEFAULT_MARQUEE_ELEMENT_SETTINGS,
                          },
                          parentId: dialogState.parentId,
                        });
                        addElementDialogState.show = false;
                      }}
                    >
                      <CardTitle>Бегущая строка</CardTitle>
                    </Card>
                    <Card
                      onClick={() => {
                        alert.addElement({
                          data: {
                            id: uuidv7(),
                            containerId: null,
                            type: "slideshow",
                            name: "Слайдшоу",
                            enabled: true,
                            settings: DEFAULT_SLIDESHOW_ELEMENT_SETTINGS,
                          },
                          parentId: dialogState.parentId,
                        });
                        addElementDialogState.show = false;
                      }}
                    >
                      <CardTitle>Слайдшоу</CardTitle>
                    </Card>
                    <Card
                      onClick={() => {
                        alert.addElement({
                          data: {
                            id: uuidv7(),
                            containerId: null,
                            type: "qrcode",
                            name: "QR код",
                            enabled: true,
                            settings: DEFAULT_QR_ELEMENT_SETTINGS,
                          },
                          parentId: dialogState.parentId,
                        });
                        addElementDialogState.show = false;
                      }}
                    >
                      <CardTitle>QR код</CardTitle>
                    </Card>
                    <Card
                      onClick={() => {
                        alert.addElement({
                          data: {
                            id: uuidv7(),
                            containerId: null,
                            type: "timed",
                            name: "Всплывающее окно",
                            enabled: true,
                            settings: DEFAULT_TIMED_ELEMENT_SETTINGS,
                          },
                          parentId: dialogState.parentId,
                        });
                        addElementDialogState.show = false;
                      }}
                    >
                      <CardTitle>Всплывающее окно</CardTitle>
                    </Card>
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
