import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { APPEARANCE_ANIMATIONS } from "../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettingsComponent";
import { AlertState } from "./AlertState";
import { log } from "../../logging";
import { publish, subscribe } from "../../socket";
import { delay, getRndInteger } from "../../utils";
import { VoiceController } from "../../logic/voice/VoiceController";
import { PaymentAlertsWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";
import { PaymentAlertsProperty } from "../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsProperty";
import { Alert } from "../../components/ConfigurationPage/widgetsettings/alerts/Alerts";
import { BorderProperty } from "../../components/ConfigurationPage/widgetproperties/BorderProperty";
import { RoundingProperty } from "../../components/ConfigurationPage/widgetproperties/RoundingProperty";
import { PaddingProperty } from "../../components/ConfigurationPage/widgetproperties/PaddingProperty";
import { BoxShadowProperty } from "../../components/ConfigurationPage/widgetproperties/BoxShadowProperty";
import { ColorProperty } from "../../components/ConfigurationPage/widgetproperties/ColorProperty";
import { BackgroundImageProperty } from "../../components/ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { WidthProperty } from "../../components/ConfigurationPage/widgetproperties/WidthProperty";
import { CSSProperties } from "react";
import { SingleChoiceProperty } from "../../components/ConfigurationPage/widgetproperties/SingleChoiceProperty";

export class AlertController {
  private settings: PaymentAlertsWidgetSettings;
  private conf: any;

  private showing: boolean = false;
  private ackFunction: Function | null = null;
  private sortedAlerts: Alert[] = [];
  private wait = 0;

  private voiceController: VoiceController | null = null;
  private _recipientId: string;
  private _state: AlertState = new AlertState();

  constructor(settings: PaymentAlertsWidgetSettings, recipientId: string) {
    this.settings = settings;
    this._recipientId = recipientId;
  }

  public listen(widgetId: string, conf: any) {
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

  protected pausePlayer() {
    publish(this.conf.topic.playerCommands, {
      command: "pause",
    });
  }

  protected resumePlayer() {
    publish(this.conf.topic.playerCommands, {
      command: "resume",
    });
  }

  protected sendStartNotification(id: string) {
    publish(this.conf.topic.alertStatus, {
      id: id,
      status: "started",
    });
  }

  protected sendEndNotification() {
    publish(this.conf.topic.alertStatus, {
      status: "finished",
    });
  }

  private async loadImage(image: string): Promise<string> {
    return fetch(`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${image}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));
  }

  private preloadImages() {
    log.debug(`preload images`);
    this.sortedAlerts.forEach((alert) => {
      if (alert.image) {
        this.loadImage(alert.image).then((image) => {
          log.debug({ origin: alert.image, current: image }, "image preloaded");
          alert.image = image;
        });
      }
    });
  }

  protected async handleSettings() {
    const alerts = this.settings.get("alerts") as PaymentAlertsProperty;
    if (!alerts) {
      return;
    }
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
  private loadAudio(alert: any): Promise<any> {
    log.debug(`load ${alert.audio}`);
    return fetch(
      `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.audio}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      },
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        alert.buffer = buffer;
      });
  }

  private findAlert(json) {
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

  renderAlert(alert: Alert, data: any, ackFunction: Function) {
    log.debug(
      `try to render alert ${JSON.stringify(alert)}, audio: ${
        alert.audio
      }, image: ${alert.image}`,
    );
    if (data.media?.url) {
      this.wait = 10000;
    }
    log.debug({duration: alert.property("duration")}, "alert duration");
    const duration = alert.property("duration")?.time;
    if (alert.property("duration")?.limited ?? false) {
      setTimeout(() => this.interrupt(), duration * 1000);
    }
    // TODO: send after checking for showing?
    this.sendStartNotification(data.id);
    this.pausePlayer();
    if (this.showing == true) {
      setTimeout(() => this.renderAlert(alert, data, ackFunction), 1000);
      log.debug("another alert in play");
      return;
    }
    this.showing = true;
    this.ackFunction = ackFunction;

    log.debug({ alert: alert }, "render image for alert");
    this.state.layout = alert.property("layout");

    this.renderWidget(alert);
    this.renderImage(alert, data);
    this.renderTitle(alert, data);
    this.renderMessage(alert, data);
    if (alert.video) {
      setTimeout(() => this.playAudio(alert, data), 5000);
    } else {
      this.playAudio(alert, data);
    }
  }

  private renderWidget(alert: Alert) {
    const shadowProperty = alert.get("totalShadow") as BoxShadowProperty;
    this.state.totalHeightStyle = {
      height: `calc(100% - ${2 * shadowProperty.requiredHeight}px)`,
      marginTop: shadowProperty.requiredHeight + "px",
    };
    this.state.totalWidthStyle = {
      width: `calc(100% - ${2 * shadowProperty.requiredWidth}px)`,
      marginLeft: shadowProperty.requiredWidth + "px",
    };
    this.state.totalWidth = (
      alert.get("totalWidth") as WidthProperty
    ).calcCss();
    this.state.totalHeight = (
      alert.get("totalHeight") as WidthProperty
    ).calcCss();
    this.state.totalBorder = (
      alert.get("totalBorder") as BorderProperty
    ).calcCss();
    this.state.totalBackgroundColor = (
      alert.get("totalBackgroundColor") as ColorProperty
    ).calcCss();
    (alert.get("totalBackgroundImage") as BackgroundImageProperty)
      .calcCss()
      .then((css) => {
        this.state.totalBackgroundImage = css;
      });
    this.state.totalRounding = (
      alert.get("totalRounding") as RoundingProperty
    ).calcCss();
    this.state.totalPadding = (
      alert.get("totalPadding") as PaddingProperty
    ).calcCss();
    this.state.totalShadow = (
      alert.get("totalShadow") as BoxShadowProperty
    ).calcCss();
  }

  playAudio(alert: Alert, data: any) {
    this.voiceController?.playAudio(alert, () => {
      this.voiceController?.pronounceTitle(alert, data, () => {
        const voiceForMessage = alert.property("enableVoiceForMessage");
        if (!voiceForMessage) {
          // TODO: make common function
          this.clear();
          this.resumePlayer();
          if (this.ackFunction) {
            this.ackFunction();
          }
          this.sendEndNotification();
          log.debug("skipping message playing");
          return;
        }
        this.voiceController?.pronounceMessage(alert, data, () => {
          log.debug("clearing alert");
          const showTime = alert.property("imageShowTime");
          if (showTime) {
            setTimeout(() => {
              this.interrupt();
            }, showTime * 1000);
          } else {
            this.interrupt();
          }
        });
      });
    });
  }

  public interrupt() {
    this.voiceController?.interrupt();
    this.clear();
    this.resumePlayer();
    if (this.ackFunction) {
      this.ackFunction();
    }
    this.sendEndNotification();
  }

  protected clear() {
    if (this.wait > 0) {
      delay(this.wait);
      this.wait = 0;
    }
    // this.state.clear();
    this.showing = false;
  }

  private renderImage(alert: Alert, data: any) {
    const showTime = alert.property("imageShowTime");
    const appearance = alert.property("appearance");

    if (alert.property("imageDuration")?.limited ?? false) {
      setTimeout(
        () => this.state.image = null,
        alert.property("imageDuration")?.time * 1000
      );
    }

    if (data.media?.url) {
      log.debug({ image: data.media.url }, "rendering generated image");
      this.state.image = `${process.env.REACT_APP_FILE_API_ENDPOINT}${data.media.url}`;
    } else if (alert.image) {
      log.debug({ image: alert.image }, "rendering image");
      this.state.image = `${alert.image}`;
    } else if (alert.video) {
      log.debug({ video: alert.video }, "rendering video");
      this.state.video = `${alert.video}`;
    }

    if (appearance && appearance !== "none" && appearance !== "random") {
      this.state.imageClassName = `animate__animated animate__slow animate__${appearance}`;
    }

    if (appearance === "random") {
      const choice =
        APPEARANCE_ANIMATIONS[
          getRndInteger(0, APPEARANCE_ANIMATIONS.length - 1)
        ];
      this.state.imageClassName = `animate__animated animate__slow animate__${choice}`;
    }

    if (showTime) {
      setTimeout(() => {
        this.state.image = null;
        this.state.video = null;
      }, showTime * 1000);
    }

    const shadowProperty = alert.get("imageShadow") as BoxShadowProperty;

    let width: CSSProperties = {
      width: `calc(100% - ${2 * shadowProperty.requiredWidth}px)`,
      marginLeft: shadowProperty.requiredWidth + "px",
      marginRight: shadowProperty.requiredWidth + "px",
    };
    const widthProperty = alert.get("imageWidth") as WidthProperty;
    if (widthProperty.value > 0) {
      width = widthProperty.calcCss();
    }

    let height: CSSProperties = {
      height: `calc(100% - ${2 * shadowProperty.requiredWidth}px)`,
      marginTop: shadowProperty.requiredHeight + "px",
      marginBottom: shadowProperty.requiredHeight + "px",
    };
    const heightProperty = alert.get("imageWidth") as WidthProperty;
    if (heightProperty.value > 0) {
      height = heightProperty.calcCss();
    }

    log.debug({ width: width, height: height }, "rendering image");

    this.state.imageStyle = {
      ...width,
      ...height,
      ...(alert.get("imagePadding") as PaddingProperty).calcCss(),
      ...(alert.get("imageBorder") as BorderProperty).calcCss(),
      ...(alert.get("imageRounding") as RoundingProperty).calcCss(),
      ...(alert.get("imageShadow") as BoxShadowProperty).calcCss(),
    };
  }

  private renderTitle(alert: Alert, data: any) {
    if (alert.property("headerDuration")?.limited ?? false) {
      setTimeout(
        () => this.state.title = null,
        alert.property("headerDuration")?.time * 1000
      );
    }

    const nicknameTextTemplate = alert.property("nicknameTextTemplate");

    const title = nicknameTextTemplate
      .replace("<username>", data.nickname ? data.nickname : "Аноним")
      .replace("<amount>", `${data.amount.major} ${data.amount.currency}`);
    this.state.title = title;

    const headerFont = alert.get("headerFont") as AnimatedFontProperty;
    this.state.fonts.push(headerFont.value.family);
    this.state.titleClassName = headerFont.calcClassName() ?? "";

    const shadowProperty = alert.get("headerBoxShadow") as BoxShadowProperty;

    let width: CSSProperties = {
      width: `calc(100% - ${2 * shadowProperty.requiredWidth}px)`,
      marginLeft: shadowProperty.requiredWidth + "px",
      marginRight: shadowProperty.requiredWidth + "px",
    };
    const widthProperty = alert.get("headerWidth") as WidthProperty;
    if (widthProperty.value > 0) {
      width = widthProperty.calcCss();
    }

    let height: CSSProperties = {
      marginTop: shadowProperty.requiredHeight + "px",
      marginBottom: shadowProperty.requiredHeight + "px",
    };
    const heightProperty = alert.get("headerWidth") as WidthProperty;
    if (heightProperty.value > 0) {
      height = heightProperty.calcCss();
    }
    const headerAlignment = alert.get("headerAlignment") as SingleChoiceProperty;


    this.state.titleStyle = {
      ...headerFont.calcStyle(),
      ...(alert.get("headerBorder") as BorderProperty).calcCss(),
      ...(alert.get("headerRounding") as RoundingProperty).calcCss(),
      ...(alert.get("headerPadding") as PaddingProperty).calcCss(),
      ...{ textAlign: headerAlignment.value } as CSSProperties,
      ...width,
      ...height,
    };

    (alert.get("headerBackgroundImage") as BackgroundImageProperty)
      .calcCss()
      .then((css) => {
        log.debug({ css: css }, "settings image style");
        this.state.titleImageStyle = {
          ...(alert.get("titleBackgroundColor") as ColorProperty).calcCss(),
          ...(alert.get("headerRounding") as RoundingProperty).calcCss(),
          ...(alert.get("headerPadding") as PaddingProperty).calcCss(),
          ...(alert.get("headerBoxShadow") as BoxShadowProperty).calcCss(),
          ...css,
        };
      });
  }

  private renderMessage(alert: Alert, data: any) {
    if (alert.property("messageDuration")?.limited ?? false) {
      setTimeout(
        () => this.state.message = null,
        alert.property("messageDuration")?.time * 1000
      );
    }

    const showTime = alert.property("imageShowTime");

    const messageFont = alert.get("font") as AnimatedFontProperty;
    if (messageFont.value.family) {
      this.state.fonts.push(messageFont.value.family);
    }

    const shadowProperty = alert.get("messageBoxShadow") as BoxShadowProperty;

    let width: CSSProperties = {
      width: `calc(100% - ${2 * shadowProperty.requiredWidth}px)`,
      marginLeft: shadowProperty.requiredWidth + "px",
      marginRight: shadowProperty.requiredWidth + "px",
    };
    const widthProperty = alert.get("messageWidth") as WidthProperty;
    if (widthProperty.value > 0) {
      width = widthProperty.calcCss();
    }

    let height: CSSProperties = {
      marginTop: shadowProperty.requiredHeight + "px",
      marginBottom: shadowProperty.requiredHeight + "px",
    };
    const heightProperty = alert.get("messageHeight") as WidthProperty;
    if (heightProperty.value > 0) {
      height = heightProperty.calcCss();
    }
    const messageAlignment = alert.get("messageAlignment") as SingleChoiceProperty;

    this.state.messageStyle = {
      ...messageFont.calcStyle(),
      ...(alert.get("messageBorder") as BorderProperty).calcCss(),
      ...(alert.get("messageRounding") as RoundingProperty).calcCss(),
      ...(alert.get("messagePadding") as PaddingProperty).calcCss(),
      ...{ textAlign: messageAlignment.value } as CSSProperties,
      ...width,
      ...height
    };

    (alert.get("messageBackgroundImage") as BackgroundImageProperty)
      .calcCss()
      .then((css) => {
        log.debug({ css: css }, "settings image style");
        this.state.messageImageStyle = {
          ...(alert.get("messageBackgroundColor") as ColorProperty).calcCss(),
          ...(alert.get("messageRounding") as RoundingProperty).calcCss(),
          ...(alert.get("messageBoxShadow") as BoxShadowProperty).calcCss(),
          ...css,
        };
      });
    this.state.messageClassName = messageFont.calcClassName() ?? "";
    if (showTime) {
      setTimeout(() => (this.state.message = data.message), showTime * 1000);
    } else {
      this.state.message = data.message;
    }
  }

  public get state(): AlertState {
    return this._state;
  }
}
