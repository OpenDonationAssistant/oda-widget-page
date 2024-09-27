import { log } from "../../../logging";
import { NumberProperty } from "../widgetproperties/NumberProperty";
import { AbstractWidgetSettings } from "./AbstractWidgetSettings";

export class PaymentsWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({
      sections: [
        {
          key: "general",
          title: "Общие",
          properties: [
            new NumberProperty({
              name: "nicknameFontSize",
              value: 28,
              displayName: "widget-payments-customer-font-size",
              notifier: { notify: () => {
                log.debug("notified");
                this.unsaved = true;
              } },
            }),
            new NumberProperty({
              name: "messageFontSize",
              value: 19,
              displayName: "widget-payments-message-font-size",
              notifier: { notify: () => {
                log.debug("notified");
                this.unsaved = true;
              } },
            }),
          ],
        },
      ],
    });
  }
}
