import { uuidv7 } from "uuidv7";
import { Alert } from "../../components/ConfigurationPage/widgetsettings/alerts/Alerts";
import { PaymentAlertsWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";
import { AlertController } from "./AlertController";
import { log } from "../../logging";
import { fullUri, sleep } from "../../utils";
import { produce } from "immer";
import { toJS } from "mobx";

export class DemoAlertController extends AlertController {
  private _alert: Alert;

  constructor(alert: Alert, recipientId: string) {
    const config = new PaymentAlertsWidgetSettings();
    config.set("alerts", [alert]);
    super(config, recipientId);
    this._alert = alert;
    this.listen("", "");
  }

  private testData() {
    return {
      id: uuidv7(), // TODO: сделать опциональным
      alertId: this._alert.id,
      nickname: "Тестовый алерт",
      message: "Тестовое сообщение",
      amount: {
        major: 100,
        minor: 0,
        currency: "RUB",
      },
    };
  }

  public listen(widgetId: string, conf: any) {
    return super.handleSettings().then(async () => {
      log.debug("demo alert iteration");
      while (true) {
        await fullUri(this._alert.image).then(async (url) => {
          const freshAlert = new Alert({
            id: undefined,
            audio:
              produce(toJS(this._alert.audio), (draft) => draft) || undefined,
            image: url,
            video:
              produce(toJS(this._alert.video), (draft) => draft) || undefined,
            triggers: produce(toJS(this._alert.triggers), (draft) => draft),
            properties: this._alert.properties.map((prop) => prop.copy()),
            removeFn: () => {},
            addFn: () => {},
          });
          await this.renderAlert(freshAlert, this.testData(), () => {}).then(
            () => {
              return sleep(2000);
            },
          );
        });
      }
    });
  }

  protected pausePlayer() {}
  protected resumePlayer() {}

  playAudio(alert: Alert, data: any): Promise<void | AudioBuffer> {
    return Promise.resolve();
  }

  protected sendStartNotification(id: string) {}
  protected sendEndNotification() {}
}
