import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { APPEARANCE_ANIMATIONS } from "../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettingsComponent";
import { IFontLoader } from "../../components/FontLoader/IFontLoader";
import { log } from "../../logging";
import { publish, subscribe } from "../../socket";
import { VoiceController } from "../voice/VoiceController";

function getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export class AlertController {
  private settings: any;
  private conf: any;

  private showing: boolean = false;
  private ackFunction: Function | null = null;
  private sortedAlerts: any = [];
  private wait = 0;

  private messageRenderers: IMessageRenderer[] = [];
  private titleRenderers: ITitleRenderer[] = [];
  private alertImageRenderers: IAlertImageRenderer[] = [];
  private fontLoaders: IFontLoader[] = [];
  private imageLoaders: IImageLoader[] = [];
  private voiceController: VoiceController | null = null;
  private _recipientId: string;

  constructor(settings: any, recipientId: string) {
    this.settings = settings;
    this._recipientId = recipientId;
  }

  listen(widgetId: string, conf: any) {
    this.conf = conf;
    this.handleSettings()
      .then(() => {
        this.voiceController = new VoiceController(this._recipientId);
      })
      .then(() => {
        subscribe(widgetId, this.conf.topic.alerts, (message) => {
          log.info({ message }, `Received alert`);
          let json = JSON.parse(message.body);
          const alert = this.findAlert(json);
          if (alert) {
            this.renderAlert(alert, json, () => message.ack());
          }
          log.info("Alert is handled");
        });
      });
  }

  private pausePlayer() {
    publish(this.conf.topic.playerCommands, {
      command: "pause",
    });
  }

  private resumePlayer() {
    publish(this.conf.topic.playerCommands, {
      command: "resume",
    });
  }

  private sendStartNotification(id: string) {
    publish(this.conf.topic.alertStatus, {
      id: id,
      status: "started",
    });
  }

  private sendEndNotification() {
    publish(this.conf.topic.alertStatus, {
      status: "finished",
    });
  }

  addMessageRenderer(renderer: IMessageRenderer) {
    this.messageRenderers.push(renderer);
  }

  addTitleRenderer(renderer: ITitleRenderer) {
    this.titleRenderers.push(renderer);
  }

  addAlertImageRenderer(renderer: IAlertImageRenderer) {
    this.alertImageRenderers.push(renderer);
  }

  addFontLoader(loader: IFontLoader) {
    this.fontLoaders.push(loader);
  }

  addImageLoader(loader: IImageLoader) {
    this.imageLoaders.push(loader);
    this.preloadImages();
  }

  private preloadImages() {
    log.debug(`preload images`);
    this.imageLoaders.forEach((loader) => {
      this.sortedAlerts
        .map((alert) => alert.image)
        .forEach((image) => loader.addImage(image));
    });
  }

  async handleSettings() {
    const alerts = this.settings.config.properties.find(
      (it) => it.name === "alerts",
    );
    log.debug({ alerts: alerts }, "alerts properties");
    const sorted = alerts.value.sort((a, b) => {
      const first = a.triggers.at(0);
      let firstAmount: number | null = null;
      if (first.type === "fixed-donation-amount") {
        firstAmount = first.amount;
      }
      if (first.type === "at-least-donation-amount") {
        firstAmount = first.min;
      }
      const second = b.triggers.at(0);
      let secondAmount: number | null = null;
      if (second.type === "fixed-donation-amount") {
        secondAmount = second.amount;
      }
      if (second.type === "at-least-donation-amount") {
        secondAmount = second.min;
      }
      if (firstAmount === null || secondAmount === null) {
        return 0;
      }
      return firstAmount - secondAmount;
    });
    this.sortedAlerts = sorted;
    log.debug(`loading audio`);
    await Promise.all(this.sortedAlerts.map((alert) => this.loadAudio(alert)));
    log.debug({ alert: this.sortedAlerts }, "sorted alerts");
    this.preloadImages();
  }

  // TODO: использовать axios
  loadAudio(alert: any): Promise<any> {
    log.debug(`load ${alert.audio}`);
    return fetch(
      `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.audio}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access-token")}`,
        }
      },
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        alert.buffer = buffer;
      });
  }

  private findSetting(properties, key: string, defaultValue: any | null) {
    const setting = properties.find((prop) => key === prop.name);
    if (setting) {
      return setting.value;
    }
    return defaultValue;
  }

  findAlert(json) {
    let index = -1;
    if (json.alertId) {
      index = this.sortedAlerts.findIndex((alert) => alert.id === json.alertId);
    } else {
      index = this.sortedAlerts.findLastIndex((alert) => {
        const trigger = alert.triggers.at(0);
        log.debug({ trigger: trigger }, "checking trigger");
        if (!trigger) {
          return false;
        }
        if (trigger.type === "fixed-donation-amount") {
          return trigger.amount === json.amount.major;
        }
        if (trigger.type === "at-least-donation-amount") {
          return trigger.min <= json.amount.major;
        }
      });

      log.debug(`choosen alert index: ${index}`);
    }
    if (index === -1) {
      return null;
    }
    const choosenAlert = this.sortedAlerts[index];
    if (choosenAlert.triggers.at(0).type === "fixed-donation-amount") {
      const choosenAlertPool = this.sortedAlerts
        .filter(
          (alert) => alert.triggers.at(0).type === "fixed-donation-amount",
        )
        .filter(
          (alert) =>
            alert.triggers.at(0).amount === choosenAlert.triggers.at(0).amount,
        );
      if (choosenAlertPool.length > 0) {
        const selected = getRndInteger(0, choosenAlertPool.length);
        log.debug(
          { index: selected, pool: choosenAlertPool },
          "choosen alert pool",
        );
        return choosenAlertPool[selected];
      }
    }
    if (choosenAlert.triggers.at(0).type === "at-least-donation-amount") {
      const choosenAlertPool = this.sortedAlerts
        .filter(
          (alert) => alert.triggers.at(0).type === "at-least-donation-amount",
        )
        .filter(
          (alert) =>
            alert.triggers.at(0).min === choosenAlert.triggers.at(0).min,
        );
      if (choosenAlertPool.length > 0) {
        const selected = getRndInteger(0, choosenAlertPool.length);
        log.debug(
          { index: selected, pool: choosenAlertPool },
          "choosen alert pool",
        );
        return choosenAlertPool[selected];
      }
    }
    return this.sortedAlerts[index];
  }

  renderAlert(alert: any, data: any, ackFunction: Function) {
    log.debug(
      `try to render alert ${JSON.stringify(alert)}, audio: ${
        alert.audio
      }, image: ${alert.image}`,
    );
    if (data.media?.url) {
      this.wait = 10000;
    }
    this.sendStartNotification(data.id);
    this.pausePlayer();
    if (this.showing == true) {
      setTimeout(() => this.renderAlert(alert, data, ackFunction), 1000);
      log.debug("another alert in play");
      return;
    }
    this.showing = true;
    this.ackFunction = ackFunction;

    this.renderImage(alert, data);
    this.renderTitle(alert, data);
    this.renderMessage(alert, data);
    if (alert.video) {
      setTimeout(() => this.playAudio(alert, data, ackFunction), 5000);
    } else {
      this.playAudio(alert, data, ackFunction);
    }
  }

  playAudio(alert: any, data: any, ackFunction: Function) {
    this.voiceController?.playAudio(alert, () => {
      this.voiceController?.pronounceTitle(alert, data, () => {
        const voiceForMessage = this.findSetting(
          alert.properties,
          "enableVoiceForMessage",
          true,
        );
        if (!voiceForMessage) {
          // TODO: make common function
          this.clear();
          this.resumePlayer();
          ackFunction();
          this.sendEndNotification();
          log.debug("skipping message playing");
          return;
        }
        this.voiceController?.pronounceMessage(alert, data, () => {
          const showTime = this.findSetting(
            alert.properties,
            "imageShowTime",
            null,
          );
          log.debug("clearing alert");
          if (showTime) {
            setTimeout(() => {
              this.clear();
              this.resumePlayer();
              ackFunction();
              this.sendEndNotification();
            }, showTime * 1000);
          } else {
            this.clear();
            this.resumePlayer();
            ackFunction();
            this.sendEndNotification();
          }
        });
      });
    });
  }

  interrupt() {
    this.voiceController?.interrupt();
    this.clear();
    this.resumePlayer();
    if (this.ackFunction) {
      this.ackFunction();
    }
    this.sendEndNotification();
  }

  private clear() {
    if (this.wait > 0) {
      this.delay(this.wait);
      this.wait = 0;
    }
    this.messageRenderers.forEach((renderer) => renderer.setMessage(""));
    this.titleRenderers.forEach((renderer) => renderer.setTitle(""));
    this.alertImageRenderers.forEach((renderer) => renderer.setImage(null));
    this.alertImageRenderers.forEach((renderer) => renderer.setVideo(null));
    this.showing = false;
  }

  private getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  delay = (ms: number) => {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  };

  private renderImage(alert: any, data: any) {
    log.debug(
      `Amount of alert image renderers: ${this.alertImageRenderers.length}`,
    );
    const showTime = this.findSetting(alert.properties, "imageShowTime", null);
    const appearance = this.findSetting(alert.properties, "appearance", "none");

    this.alertImageRenderers.forEach((renderer) => {
      console.log(alert.properties);
      if (data.media?.url) {
        log.debug({ image: data.media.url }, "rendering generated image");
        renderer.setImage(
          `${process.env.REACT_APP_FILE_API_ENDPOINT}${data.media.url}`,
        );
      } else if (alert.image) {
        log.debug({ image: alert.image }, "rendering image");
        renderer.setImage(
          `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`,
        );
      } else if (alert.video) {
        log.debug({ video: alert.video }, "rendering video");
        renderer.setVideo(
          `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.video}`,
        );
      }
      if (appearance && appearance !== "none" && appearance !== "random") {
        renderer.setClassName(
          `animate__animated animate__slow animate__${appearance}`,
        );
      }
      if (appearance === "random") {
        const choice =
          APPEARANCE_ANIMATIONS[
            this.getRndInteger(0, APPEARANCE_ANIMATIONS.length - 1)
          ];
        renderer.setClassName(
          `animate__animated animate__slow animate__${choice}`,
        );
      }
      if (showTime) {
        setTimeout(() => {
          renderer.setImage(null);
          renderer.setVideo(null);
        }, showTime * 1000);
      }
      renderer.setStyle(
        this.calculateImageStyle(
          this.findSetting(alert.properties, "imageWidth", null),
          this.findSetting(alert.properties, "imageHeight", null),
        ),
      );
    });
  }

  private renderTitle(alert: any, data: any) {
    const nicknameTextTemplate = this.findSetting(
      alert.properties,
      "nicknameTextTemplate",
      "<username> - <amount>",
    );
    const title = nicknameTextTemplate
      .replace("<username>", data.nickname ? data.nickname : "Аноним")
      .replace("<amount>", `${data.amount.major} ${data.amount.currency}`);

    const headerFont = new AnimatedFontProperty({
      widgetId: "widgetId",
      name: "headerFont",
      value: this.findSetting(alert.properties, "headerFont", null),
    });
    this.fontLoaders.forEach((loader) =>
      loader.addFont(headerFont.value.family),
    );
    this.titleRenderers.forEach((renderer) => {
      renderer.setClassName(headerFont.calcClassName() ?? "");
      renderer.setStyle(headerFont.calcStyle());
      renderer.setTitle(title);
    });
  }

  private renderMessage(alert: any, data: any) {
    const showTime = this.findSetting(alert.properties, "imageShowTime", null);
    const messageFont = new AnimatedFontProperty({
      widgetId: "widgetId",
      name: "font",
      value: this.findSetting(alert.properties, "font", null),
    });
    this.fontLoaders.forEach((loader) =>
      loader.addFont(messageFont.value.family),
    );
    this.messageRenderers.forEach((renderer) => {
      renderer.setStyle(messageFont.calcStyle());
      renderer.setClassName(messageFont.calcClassName() ?? "");
      if (showTime) {
        setTimeout(() => renderer.setMessage(data.message), showTime * 1000);
      } else {
        renderer.setMessage(data.message);
      }
    });
  }

  private calculateImageStyle(imageWidth: any, imageHeight: any) {
    return imageWidth && imageHeight
      ? {
          width: imageWidth + "px",
          height: imageHeight + "px",
        }
      : {};
  }
}
