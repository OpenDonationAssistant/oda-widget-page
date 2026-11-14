import { ReactNode } from "react";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { AbstractWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/AbstractWidgetSettings";
import { BooleanProperty } from "../../components/ConfigurationPage/widgetproperties/BooleanProperty";
import { NumberProperty } from "../../components/ConfigurationPage/widgetproperties/NumberProperty";
import { TextProperty } from "../../components/ConfigurationPage/widgetproperties/TextProperty";
import { AuctionWidget } from "./AuctionWidget";
import { AuctionWidgetDemoStore } from "./AuctionWidgetDemoStore";

export class AuctionWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ sections: [] });

    this.addSection({
      key: "auction",
      title: "auction-title",
      properties: [
        new TextProperty({
          name: "goalTitle",
          value: "Аукцион",
          displayName: "auction-goal-title",
          help: t("auction-goal-help"),
        }),
        new BooleanProperty({
          name: "todayOnly",
          value: true,
          displayName: "auction-today-only-property",
        }),
        new BooleanProperty({
          name: "autoRefresh",
          value: true,
          displayName: "auction-auto-refresh",
        }),
        new NumberProperty({
          name: "timerMinutes",
          value: 10,
          displayName: "auction-timer",
          addon: <Trans i18nKey="auction-minutes-unit" />,
        }),
        new NumberProperty({
          name: "rubPerMinute",
          value: 100,
          displayName: "auction-minute-price",
          addon: "₽",
        }),
      ],
    });
  }

  public get goalTitle(): string {
    return this.get("goalTitle")?.value ?? "";
  }

  public get todayOnly(): boolean {
    return (this.get("todayOnly") as BooleanProperty)?.value ?? true;
  }

  public get autoRefresh(): boolean {
    return (this.get("autoRefresh") as BooleanProperty)?.value ?? true;
  }

  public get timerMinutes(): number {
    return (this.get("timerMinutes") as NumberProperty)?.value ?? 10;
  }

  public get rubPerMinute(): number {
    return (this.get("rubPerMinute") as NumberProperty)?.value ?? 100;
  }

  public hasDemo(): boolean {
    return true;
  }

  public demo(): ReactNode {
    // Мок специально рядом, чтобы в настройках было видно живое колесо без настоящих донатов.
    return <AuctionWidget settings={this} store={new AuctionWidgetDemoStore()} />;
  }
}
