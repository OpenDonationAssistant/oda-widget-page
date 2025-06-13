import { useContext, useRef, useState } from "react";
import { WidgetConfiguration } from "./WidgetConfiguration";
import { useLoaderData } from "react-router";
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

const Widgets = observer(({ widgetStore }: { widgetStore: WidgetStore }) => {
  const selection = useContext(SelectedIndexContext);
  const [asCards, setAsCards] = useState<boolean>(false);

      //<Flex className="full-width" justify="flex-end" style={{ marginBottom: "9px" }}>
      //  <NotBorderedIconButton onClick={() => setAsCards(false)}>
      //    <LinesIcon />
      //  </NotBorderedIconButton>
      //  <NotBorderedIconButton onClick={() => setAsCards(true)}>
      //    <CardsIcon />
      //  </NotBorderedIconButton>
      //</Flex>

  return (
    <>
      <Flex vertical={!asCards} wrap gap={asCards ? 12 : 6}>
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
      </Flex>
    </>
  );
});

const WidgetList = observer(({}) => {
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
              <Widgets widgetStore={widgetStore} />
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
        align="center"
        gap={12}
      >
        <div className={`${classes.widgetpreviewimage}`}>
          {widget.preview && <img src={widget.preview} />}
        </div>
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
  ({ widgetStore }: { widgetStore: WidgetStore }) => {
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
            justify="center"
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
        {!showAddWidgetPopup && (
          <button
            className={`${classes.addwidgetbutton}`}
            onClick={() => setShowAddWidgetPopup(true)}
          >
            <AddIcon color="var(--oda-primary-color)" />
            <div>{t("button-addwidget")}</div>
          </button>
        )}
      </>
    );
  },
);

export default function ConfigurationPage({}: {}) {
  const { recipientId } = useLoaderData() as WidgetData;
  const selection = useRef(new SelectedIndexStore());
  const widgetStore = new DefaultWidgetStore();

  return (
    <WidgetStoreContext.Provider value={widgetStore}>
      <SelectedIndexContext.Provider value={selection.current}>
        <Flex justify="space-between" align="center">
          <h1 className={`${classes.header}`}>Виджеты</h1>
        </Flex>
        {widgetStore?.list && (
          <div className="widget-list">
            <PaymentPageConfigContext.Provider
              value={new PaymentPageConfig(recipientId)}
            >
              <WidgetList />
            </PaymentPageConfigContext.Provider>
            <AddWidgetComponent widgetStore={widgetStore} />
          </div>
        )}
      </SelectedIndexContext.Provider>
    </WidgetStoreContext.Provider>
  );
}
