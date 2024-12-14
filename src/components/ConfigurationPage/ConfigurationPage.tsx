import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import WidgetConfiguration from "./WidgetConfiguration";
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

const WidgetList = observer(({ widgetStore }: { widgetStore: WidgetStore }) => {
  const selection = useContext(SelectionContext);
  log.debug({ widgets: widgetStore.list }, "calling widget list");
  return (
    <>
      {widgetStore.list.map((data) => (
        <WidgetConfiguration
          key={data.id}
          widget={data}
          open={selection.id === data.id}
        />
      ))}
    </>
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
    <Content style={{ overflow: "initial" }}>
      <div className="widget-list">
        <SelectionContext.Provider value={selection.current}>
          <WidgetList widgetStore={widgetStore.current} />
        </SelectionContext.Provider>
        <AddWidgetComponent widgetStore={widgetStore.current} />
      </div>
    </Content>
  );
}
