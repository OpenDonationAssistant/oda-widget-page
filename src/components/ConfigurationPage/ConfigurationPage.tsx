import { createContext, useContext, useEffect, useRef, useState } from "react";
import { WidgetConfiguration } from "./WidgetConfiguration";
import { useLoaderData } from "react-router";
import { log } from "../../logging";
import { WidgetData } from "../../types/WidgetData";
import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { WIDGET_TYPES } from "../../types/Widget";
import { makeAutoObservable } from "mobx";
import { WidgetStore } from "../../stores/WidgetStore";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  PaymentPageConfig,
  PaymentPageConfigContext,
} from "../MediaWidget/PaymentPageConfig";

export class Selection {
  private _id: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get id(): string | null {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }
}

export const SelectionContext = createContext<Selection>(new Selection());

const Widgets = observer(({ widgetStore }: { widgetStore: WidgetStore }) => {
  const selection = useContext(SelectionContext);
  return (
    <>
      {widgetStore.list.map((data, index) => (
        <Draggable
          key={data.id}
          draggableId={data.id}
          isDragDisabled={selection.id === data.id}
          index={index}
        >
          {(draggable) => (
            <div
              ref={draggable.innerRef}
              {...draggable.draggableProps}
              {...draggable.dragHandleProps}
              key={data.id}
            >
              <WidgetConfiguration widget={data} />
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
});

const WidgetList = observer(({ widgetStore }: { widgetStore: WidgetStore }) => {
  log.debug({ widgets: widgetStore.list }, "rendering widget list");

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

const AddWidgetComponent = observer(
  ({ widgetStore }: { widgetStore: WidgetStore }) => {
    const { t } = useTranslation();
    const [showAddWidgetPopup, setShowAddWidgetPopup] = useState(false);

    return (
      <>
        {!showAddWidgetPopup && (
          <div
            className="oda-btn-default"
            onClick={() => setShowAddWidgetPopup(!showAddWidgetPopup)}
            style={{
              marginTop: "20px",
              width: "fit-content",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">add</span>
              <div>{t("button-addwidget")}</div>
            </Flex>
          </div>
        )}
        {showAddWidgetPopup && (
          <div className="new-widget-popup">
            {WIDGET_TYPES.map((type) => (
              <div
                className="new-widget-type-button"
                onClick={() => {
                  widgetStore
                    .addWidget(type.name)
                    .then(() => setShowAddWidgetPopup(false));
                }}
              >
                <img className="widget-icon" src={`/icons/${type.name}.png`} />
                <div>{t(type.description)}</div>
              </div>
            ))}
            <div
              className="new-widget-type-button"
              onClick={() => setShowAddWidgetPopup(false)}
              style={{ border: "none", paddingTop: "33px" }}
            >
              <img className="widget-icon" src={`/icons/close.png`} />
            </div>
          </div>
        )}
      </>
    );
  },
);

export default function ConfigurationPage({}: {}) {
  const { recipientId } = useLoaderData() as WidgetData;
  const widgetStore = useRef(new WidgetStore());
  const selection = useRef(new Selection());

  useEffect(() => {
    widgetStore.current.load();
  }, [recipientId]);

  return (
    <Content style={{ overflow: "initial", paddingBottom: "80px" }}>
      <div className="widget-list">
        <SelectionContext.Provider value={selection.current}>
          <PaymentPageConfigContext.Provider
            value={new PaymentPageConfig(recipientId)}
          >
            <WidgetList widgetStore={widgetStore.current} />
          </PaymentPageConfigContext.Provider>
        </SelectionContext.Provider>
        <AddWidgetComponent widgetStore={widgetStore.current} />
      </div>
    </Content>
  );
}
