import { useContext, useEffect, useState } from "react";
import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { WidgetConfiguration } from "./WidgetConfiguration";
import { useNavigate } from "react-router";
import { WidgetStoreContext } from "../../stores/WidgetStore";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import classes from "./ConfigurationPage.module.css";
import AddIcon from "../../icons/AddIcon";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import LinesIcon from "../../icons/LinesIcon";
import CardsIcon from "../../icons/CardsIcon";
import { CardButton, CardList } from "../Cards/CardsComponent";
import {
  Dialog,
  ModalState,
  ModalStateContext,
  Overlay,
  Title,
} from "../Overlay/Overlay";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { List } from "../List/List";
import {
  DefaultPresetStore,
  PresetStore,
  PresetStoreContext,
} from "../../stores/PresetStore";
import { Wizard, WizardConfigurationStore } from "../Wizard/WizardComponent";
import {
  AddWidgetWizardStoreContext,
  SelectPresetComponent,
  SelectWidgetComponent,
} from "./AddWidgetWizard";
import CollapseLikeButton from "../Button/Button";
import { reaction } from "mobx";
import { log } from "../../logging";

const Widgets = observer(({ asCards }: { asCards: boolean }) => {
  const widgetStore = useContext(WidgetStoreContext);
  const presetStore = useContext(PresetStoreContext);
  const [selection, setSelection] = useState<string>("");
  const wizardStore = useContext(AddWidgetWizardStoreContext);
  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    () =>
      new WizardConfigurationStore({
        steps: [
          {
            title: "Добавить виджет",
            subtitle: "",
            content: <SelectWidgetComponent />,
            handler: () => {
              return Promise.resolve(true);
            },
          },
          {
            title: "Выберите шаблон",
            subtitle: "",
            content: <SelectPresetComponent />,
            condition: () => {
              return presetStore.for(wizardStore.type).then((presets) => {
                return presets.length > 0;
              });
            },
            handler: () => {
              if (!wizardStore.preset || !wizardStore.type) {
                log.debug(
                  { preset: wizardStore.preset, type: wizardStore.type },
                  "no preset selected",
                );
                return Promise.resolve(false);
              }
              return Promise.resolve(true);
            },
          },
        ],
        dynamicStepAmount: true,
        reset: () => {
          wizardStore.reset();
        },
        finish: () => {
          if (!wizardStore.type) {
            return Promise.resolve();
          }
          return widgetStore.addWidget(wizardStore.type).then((widget) => {
            if (!widget) {
              return;
            }
            log.debug(
              { preset: wizardStore.preset, type: widget.type },
              "applying preset to created widget",
            );
            wizardStore.preset?.applyTo(widget.config, widget.type);
            return widget.save().then(() => {
              setSelection(widget.id);
            });
          });
        },
      }),
  );

  useEffect(() => {
    reaction(
      () => wizardStore.type,
      () => {
        wizardConfiguration.canContinue = !!wizardStore.type;
      },
    );
  }, [wizardStore, wizardConfiguration]);

  useEffect(() => {
    reaction(
      () => wizardStore.preset,
      () => {
        wizardConfiguration.canContinue = !!wizardStore.preset;
      },
    );
  }, [wizardStore, wizardConfiguration]);

  useEffect(() => {
    reaction(
      () => wizardConfiguration.index,
      () => {
        wizardConfiguration.canContinue = false;
      },
    );
  }, [wizardStore, wizardConfiguration]);

  return (
    <>
      <Wizard configurationStore={wizardConfiguration} />
      {!asCards && (
        <List>
          {widgetStore.list.map((data, index) => (
            <Draggable key={data.id} draggableId={data.id} index={index}>
              {(draggable) => (
                <div
                  className={`${classes.widgetdraggablecontainer}`}
                  ref={draggable.innerRef}
                  {...draggable.draggableProps}
                  {...draggable.dragHandleProps}
                >
                  <WidgetConfiguration
                    widget={data}
                    asCards={asCards}
                    open={data.id === selection}
                  />
                </div>
              )}
            </Draggable>
          ))}
          <CollapseLikeButton
            onClick={() => {
              wizardConfiguration.next();
            }}
          >
            <AddIcon color="var(--oda-primary-color)" />
            <div>Добавить виджет</div>
          </CollapseLikeButton>
        </List>
      )}
      {asCards && (
        <CardList>
          {widgetStore.list.map((data) => (
            <WidgetConfiguration
              widget={data}
              asCards={asCards}
              open={data.id === selection}
            />
          ))}
          <CardButton onClick={() => wizardConfiguration.next()}>
            <AddIcon color="var(--oda-primary-color)" />
            <div>Добавить виджет</div>
          </CardButton>
        </CardList>
      )}
    </>
  );
});

const WidgetList = observer(({ asCards }: { asCards: boolean }) => {
  const widgetStore = useContext(WidgetStoreContext);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const { destination, source } = result;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    widgetStore.moveWidget(source.index, destination.index);
  }

  return widgetStore?.list ? (
    <div className={`${classes.widgetlist}`}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgetlist">
          {(provided) => (
            <div id="widgetlistholder" ref={provided.innerRef}>
              <div {...provided.droppableProps}>
                <Widgets asCards={asCards} />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  ) : (
    <></>
  );
});

export default function ConfigurationPage({}: {}) {
  const [asCards, setAsCards] = useState<boolean>(() => {
    const value = localStorage.getItem("asCards");
    if (value === null || value === undefined) {
      return false;
    }
    return JSON.parse(value);
  });
  const parentModalState = useContext(ModalStateContext);
  const [state] = useState<ModalState>(() => new ModalState(parentModalState));
  const navigate = useNavigate();
  const [presetStore] = useState<PresetStore>(() => new DefaultPresetStore());

  const code = localStorage.getItem("code");
  const authState = localStorage.getItem("state");
  if (code) {
    localStorage.removeItem("code");
    if (authState) {
      localStorage.removeItem("state");
      const platform = localStorage.getItem(authState);
      localStorage.removeItem(authState);
      if (platform === "twitch" && code) {
        RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
          .getTwitchToken({
            authorizationCode: code,
          })
          .then(() => {
            state.show = true;
          });
      }
      if (platform === "vklive" && code) {
        RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
          .getVKLiveToken({
            authorizationCode: code,
          })
          .then(() => {
            state.show = true;
          });
      }
    }
    RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
      .getDonationAlertsToken({
        authorizationCode: code,
      })
      .then((response) => {
        state.show = true;
      });
  }

  return (
    <PresetStoreContext.Provider value={presetStore}>
      <ModalStateContext.Provider value={state}>
        <Overlay>
          <Dialog>
            <Title>Подключение успешно</Title>
            <div style={{ height: "200px" }}></div>
            <Flex className="full-width" justify="flex-end">
              <PrimaryButton
                onClick={() => {
                  navigate(0);
                }}
              >
                Ok
              </PrimaryButton>
            </Flex>
          </Dialog>
        </Overlay>
      </ModalStateContext.Provider>
      <Flex justify="space-between" align="center">
        <h1 className={`${classes.header}`}>Виджеты</h1>
        <Flex
          className="full-width"
          justify="flex-end"
          style={{ marginBottom: "9px" }}
        >
          <NotBorderedIconButton
            onClick={() => {
              setAsCards(false);
              localStorage.setItem("asCards", JSON.stringify(false));
            }}
          >
            <LinesIcon />
          </NotBorderedIconButton>
          <NotBorderedIconButton
            onClick={() => {
              setAsCards(true);
              localStorage.setItem("asCards", JSON.stringify(true));
            }}
          >
            <CardsIcon />
          </NotBorderedIconButton>
        </Flex>
      </Flex>
      <WidgetList asCards={asCards} />
    </PresetStoreContext.Provider>
  );
}
