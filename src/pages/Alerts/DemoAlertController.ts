import { Alert } from "../../components/ConfigurationPage/widgetsettings/alerts/Alerts";
import { PaymentAlertsWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";
import { AlertController } from "./AlertController";

export class DemoAlertController extends AlertController {
  constructor(alert: Alert, recipientId: string) {
    const config = new PaymentAlertsWidgetSettings();
    config.set("alerts", [alert]);
    super(config, recipientId);
  }

  public listen(widgetId: string, conf: any) {
    super.handleSettings().then(() => {
      this.renderAlert(alert, {}, () => {});
    });
  }

  protected pausePlayer() {}
  protected resumePlayer() {}

  playAudio(alert: any, data: any, ackFunction: Function) {}

  protected sendStartNotification(id: string) {}
  protected sendEndNotification() {}
}
