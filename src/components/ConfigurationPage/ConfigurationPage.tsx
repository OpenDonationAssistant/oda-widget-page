import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import WidgetConfiguration from "./WidgetConfiguration";
import { WidgetsContext } from "./WidgetsContext";
import axios from "axios";
import { useLoaderData } from "react-router";
import { log } from "../../logging";
import { WidgetData } from "../../types/WidgetData";
import { PlayerPopupWidgetSettings } from "./widgetsettings/PlayerPopupWidgetSettings";
import { AbstractWidgetSettings } from "./widgetsettings/AbstractWidgetSettings";
import { DonatersTopListWidgetSettings } from "./widgetsettings/DonatersTopListWidgetSettings";
import { DonationTimerWidgetSettings } from "./widgetsettings/DonationTimerWidgetSettings";
import { MediaWidgetSettings } from "./widgetsettings/MediaWidgetSettings";
import { PaymentsWidgetSettings } from "./widgetsettings/PaymentsWidgetSettings";
import { PaymentAlertsWidgetSettings } from "./widgetsettings/alerts/PaymentAlertsWidgetSettings";
import { PlayerInfoWidgetSettings } from "./widgetsettings/PlayerInfoWidgetSettings";
import { ReelWidgetSettings } from "./widgetsettings/ReelWidgetSettings";
import { DonationGoalWidgetSettings } from "./widgetsettings/DonationGoalWidgetSettings";
import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { DefaultApiFactory } from "@opendonationassistant/oda-widget-service-client";
import { WIDGET_TYPES, Widget } from "../../types/Widget";
import { makeAutoObservable } from "mobx";
import { WidgetStore } from "./WidgetStore";
import { observer } from "mobx-react-lite";

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
            {t("button-addwidget")}
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
