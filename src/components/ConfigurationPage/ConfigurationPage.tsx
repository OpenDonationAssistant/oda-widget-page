import { useContext, useEffect, useRef, useState } from "react";
import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { WidgetConfiguration } from "./WidgetConfiguration";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";
import { WIDGET_TYPES } from "../../types/Widget";
import {
  DefaultWidgetStore,
  WidgetStore,
  WidgetStoreContext,
} from "../../stores/WidgetStore";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  PaymentPageConfig,
  PaymentPageConfigContext,
} from "../MediaWidget/PaymentPageConfig";
import classes from "./ConfigurationPage.module.css";
import {
  SelectedIndexContext,
  SelectedIndexStore,
} from "../../stores/SelectedIndexStore";
import Modal from "../Modal/Modal";
import AddIcon from "../../icons/AddIcon";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import LinesIcon from "../../icons/LinesIcon";
import CardsIcon from "../../icons/CardsIcon";
import { CardButton, CardList } from "../Cards/CardsComponent";
import { useSearchParams } from "react-router-dom";
import { Dialog, ModalState, ModalStateContext, Overlay, Title } from "../Overlay/Overlay";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

const Widgets = observer(
  ({
    widgetStore,
    asCards,
  }: {
    widgetStore: WidgetStore;
    asCards: boolean;
  }) => {
    const selection = useContext(SelectedIndexContext);

    return (
      <>
        {!asCards && (
          <Flex vertical wrap gap={asCards ? 12 : 6}>
            {widgetStore.list.map((data, index) => (
              <Draggable
                key={data.id}
                draggableId={data.id}
                isDragDisabled={selection.id === data.id}
                index={index}
              >
                {(draggable) => (
                  <div
                    className={`${classes.widgetdraggablecontainer}`}
                    ref={draggable.innerRef}
                    {...draggable.draggableProps}
                    {...draggable.dragHandleProps}
                    key={data.id}
                  >
                    <WidgetConfiguration widget={data} asCards={asCards} />
                  </div>
                )}
              </Draggable>
            ))}
            <AddWidgetComponent asCards={asCards} widgetStore={widgetStore} />
          </Flex>
        )}
        {asCards && (
          <CardList>
            {widgetStore.list.map((data, index) => (
              <WidgetConfiguration widget={data} asCards={asCards} />
            ))}
            <AddWidgetComponent asCards={asCards} widgetStore={widgetStore} />
          </CardList>
        )}
      </>
    );
  },
);

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="widgetlist">
        {(provided) => (
          <div id="widgetlistholder" ref={provided.innerRef}>
            <div {...provided.droppableProps}>
              <Widgets asCards={asCards} widgetStore={widgetStore} />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
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
    const selection = useContext(SelectedIndexContext);
    const [showAddWidgetPopup, setShowAddWidgetPopup] = useState(false);

    const NewWidgetSection = observer(({ category }: { category: string }) => {
      return (
        <>
          {WIDGET_TYPES.filter((type) => type.category === category).map(
            (type) => (
              <div
                onClick={() => {
                  widgetStore.addWidget(type.name).then(() => {
                    setShowAddWidgetPopup(false);
                    selection.index = widgetStore.list.length - 1;
                    selection.id =
                      widgetStore.list.at(selection.index)?.id || null;
                  });
                }}
              >
                <WidgetPreviewComponent widget={type} />
              </div>
            ),
          )}
        </>
      );
    });

    return (
      <>
        <Modal
          size="big"
          title="Добавление виджета"
          show={showAddWidgetPopup}
          showSubmitButton={false}
          onSubmit={() => {
            setShowAddWidgetPopup(false);
          }}
          onDecline={() => {
            setShowAddWidgetPopup(false);
          }}
        >
          <Flex
            gap={12}
            wrap={true}
            align="center"
            className={`${classes.addwidgetcontainer} full-width`}
          >
            <div className={`${classes.section}`}>Для стрима</div>
            <NewWidgetSection category="onscreen" />
            <div className={`${classes.section}`}>Медиа</div>
            <NewWidgetSection category="media" />
            <div className={`${classes.section}`}>Инструменты стримера</div>
            <NewWidgetSection category="internal" />
          </Flex>
        </Modal>
        {!showAddWidgetPopup && !asCards && (
          <button
            className={`${classes.addwidgetbutton}`}
            onClick={() => setShowAddWidgetPopup(true)}
          >
            <AddIcon color="var(--oda-primary-color)" />
            <div>{t("button-addwidget")}</div>
          </button>
        )}
        {!showAddWidgetPopup && asCards && (
          <CardButton onClick={() => setShowAddWidgetPopup(true)} />
        )}
      </>
    );
  },
);

export default function ConfigurationPage({}: {}) {
  const { recipientId } = useLoaderData() as WidgetData;
  const selection = useRef(new SelectedIndexStore());
  const widgetStore = new DefaultWidgetStore();
  const [asCards, setAsCards] = useState<boolean>(() => {
    const value = localStorage.getItem("asCards");
    if (value === null || value === undefined){
      return false;
    }
    return JSON.parse(value);
  });
  const [params] = useSearchParams();
  const parentModalState = useContext(ModalStateContext);
  const [state] = useState<ModalState>(new ModalState(parentModalState));
  const navigate = useNavigate();

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
    <WidgetStoreContext.Provider value={widgetStore}>
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
      <SelectedIndexContext.Provider value={selection.current}>
        <Flex justify="space-between" align="center">
          <h1 className={`${classes.header}`}>Виджеты</h1>
          <Flex
            className="full-width"
            justify="flex-end"
            style={{ marginBottom: "9px" }}
          >
            <NotBorderedIconButton onClick={() => {
              setAsCards(false);
              localStorage.setItem("asCards", JSON.stringify(false));
            }}>
              <LinesIcon />
            </NotBorderedIconButton>
            <NotBorderedIconButton onClick={() => {
              setAsCards(true);
              localStorage.setItem("asCards", JSON.stringify(true));
            }}>
              <CardsIcon />
            </NotBorderedIconButton>
          </Flex>
        </Flex>
        {widgetStore?.list && (
          <div className="widget-list">
            <PaymentPageConfigContext.Provider
              value={new PaymentPageConfig(recipientId)}
            >
              <WidgetList asCards={asCards} />
            </PaymentPageConfigContext.Provider>
          </div>
        )}
      </SelectedIndexContext.Provider>
    </WidgetStoreContext.Provider>
  );
}
