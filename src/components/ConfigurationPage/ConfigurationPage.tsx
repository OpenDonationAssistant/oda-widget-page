import { useContext, useEffect, useState } from "react";
import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { WidgetConfiguration } from "./WidgetConfiguration";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { WIDGET_TYPES, Widget } from "../../types/Widget";
import { WidgetStore, WidgetStoreContext } from "../../stores/WidgetStore";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import classes from "./ConfigurationPage.module.css";
import { SelectedIndexContext } from "../../stores/SelectedIndexStore";
import AddIcon from "../../icons/AddIcon";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import LinesIcon from "../../icons/LinesIcon";
import CardsIcon from "../../icons/CardsIcon";
import { CardButton, CardList } from "../Cards/CardsComponent";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  FullscreenPanel,
  ModalState,
  ModalStateContext,
  Overlay,
  Title,
} from "../Overlay/Overlay";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { List } from "../List/List";
import { PresetWindow } from "./PresetsComponent";
import {
  DefaultPresetStore,
  PresetStore,
  PresetStoreContext,
} from "../../stores/PresetStore";
import { log } from "../../logging";

const Widgets = observer(({ asCards }: { asCards: boolean }) => {
  const widgetStore = useContext(WidgetStoreContext);
  const selection = useContext(SelectedIndexContext);
  const parentModalState = useContext(ModalStateContext);
  const [presetDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );

  log.debug({ selection: selection.id }, "rendering selection");

  return (
    <SelectedIndexContext.Provider value={selection}>
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
                  key={data.id}
                >
                  <WidgetConfiguration
                    widget={data}
                    asCards={asCards}
                    open={data.id === selection.id && presetDialogState.show === false}
                  />
                </div>
              )}
            </Draggable>
          ))}
          <AddWidgetComponent asCards={asCards} widgetStore={widgetStore} />
        </List>
      )}
      {asCards && (
        <CardList>
          {widgetStore.list.map((data) => (
            <WidgetConfiguration
              widget={data}
              asCards={asCards}
              open={data.id === selection.id}
            />
          ))}
          <AddWidgetComponent asCards={asCards} widgetStore={widgetStore} />
        </CardList>
      )}
    </SelectedIndexContext.Provider>
  );
});

const WidgetList = observer(({ asCards }: { asCards: boolean }) => {
  const widgetStore = useContext(WidgetStoreContext);

  function onDragEnd(result: any) {
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

const WidgetPreviewComponent = observer(
  ({
    widget,
  }: {
    widget: { title: string; description: string; preview: string };
  }) => {
    const { t } = useTranslation();

    return (
      <Flex
        className={`${classes.widgetpreviewcontainer}`}
        align="flex-start"
        gap={12}
      >
        {false && (
          <div className={`${classes.widgetpreviewimage}`}>
            {widget.preview && <img src={widget.preview} />}
          </div>
        )}
        <Flex vertical gap={9}>
          <div className={`${classes.widgetpreviewtitle}`}>
            {t(widget.title)}
          </div>
          <div className={`${classes.widgetpreviewdescription}`}>
            {t(widget.description)}
          </div>
        </Flex>
      </Flex>
    );
  },
);

const AddWidgetComponent = observer(
  ({
    widgetStore,
    asCards,
  }: {
    widgetStore: WidgetStore;
    asCards: boolean;
  }) => {
    const { t } = useTranslation();

    const presetDialogState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      () => new ModalState(presetDialogState),
    );
    const presetStore = useContext(PresetStoreContext);
    const [widget, setWidget] = useState<Widget | null>(null);
    const selection = useContext(SelectedIndexContext);

    log.debug({ widget: widget }, "created widget");

    const NewWidgetSection = observer(({ category }: { category: string }) => {
      return (
        <div className={`${classes.widgetpreviews}`}>
          {WIDGET_TYPES.filter((type) => type.category === category).map(
            (type) => (
              <div
                onClick={() => {
                  widgetStore.addWidget(type.name).then((widget) => {
                    log.debug({ widget: widget }, "created widget");
                    dialogState.show = false;
                    if (!widget) {
                      return;
                    }
                    presetStore.for(widget.type).then((presets) => {
                      setWidget(widget);
                      selection.id = widget.id;
                      if (presets.length > 0) {
                        presetDialogState.show = true;
                      }
                    })
                  });
                }}
              >
                <WidgetPreviewComponent widget={type} />
              </div>
            ),
          )}
        </div>
      );
    });

    return (
      <ModalStateContext.Provider value={dialogState}>
        <ModalStateContext.Provider value={presetDialogState}>
          {widget && <PresetWindow presetStore={presetStore} widget={widget} />}
        </ModalStateContext.Provider>
        <Overlay>
          <FullscreenPanel>
            <Title>Добавить виджет</Title>
            <Flex vertical gap={12} className={`${classes.sectioncontainer}`}>
              <div className={`${classes.section}`}>Для стрима</div>
              <NewWidgetSection category="onscreen" />
              <div className={`${classes.section}`}>Медиа</div>
              <NewWidgetSection category="media" />
              <div className={`${classes.section}`}>Инструменты стримера</div>
              <NewWidgetSection category="internal" />
            </Flex>
          </FullscreenPanel>
        </Overlay>
        {!dialogState.show && !asCards && (
          <button
            className={`${classes.addwidgetbutton}`}
            onClick={() => (dialogState.show = true)}
          >
            <AddIcon color="var(--oda-primary-color)" />
            <div>{t("button-addwidget")}</div>
          </button>
        )}
        {!dialogState.show && asCards && (
          <CardButton onClick={() => (dialogState.show = true)} />
        )}
      </ModalStateContext.Provider>
    );
  },
);

export default function ConfigurationPage({}: {}) {
  const [asCards, setAsCards] = useState<boolean>(() => {
    const value = localStorage.getItem("asCards");
    if (value === null || value === undefined) {
      return false;
    }
    return JSON.parse(value);
  });
  const [params] = useSearchParams();
  const parentModalState = useContext(ModalStateContext);
  const [state] = useState<ModalState>(() => new ModalState(parentModalState));
  const navigate = useNavigate();
  const [presetStore] = useState<PresetStore>(() => new DefaultPresetStore());

  useEffect(() => {
    const code = localStorage.getItem("code");
    if (code) {
      localStorage.removeItem("code");
      RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
        .getDonationAlertsToken({
          authorizationCode: code,
        })
        .then((response) => {
          state.show = true;
        });
    }
  }, [params]);

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
