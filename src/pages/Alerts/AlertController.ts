import { AnimatedFontProperty } from "../../components/ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { AlertState } from "./AlertState";
import { log } from "../../logging";
import { publish, subscribe } from "../../socket";
import { delay, getRndInteger, sleep } from "../../utils";
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
import { AnimationProperty } from "../../components/ConfigurationPage/widgetproperties/AnimationProperty";
import { toJS } from "mobx";
import { HeightProperty } from "../../components/ConfigurationPage/widgetproperties/HeightProperty";
import { BooleanProperty } from "../../components/ConfigurationPage/widgetproperties/BooleanProperty";
import { PremoderationProperty } from "../../components/ConfigurationPage/widgetsettings/alerts/PremoderationProperty";

export class AlertController {
  private settings: PaymentAlertsWidgetSettings;
  private conf: any;

  private showing: boolean = false;
  private ackFunction: Function | null = null;
  private sortedAlerts: Alert[] = [];
  private wait = 0;
  private _pauseRequests = true;
  private _premoderation = false;

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
          let json = JSON.parse(message.body);
          log.info({ json }, `Received alert`);
          const alert = this.findAlert(json);
          if (alert) {
            // TODO: обрабатывать несколько в премодерации
            this.renderAlert(alert, json, () => message.ack());
          }
          log.info("Alert is handled");
        });
      });
  }

  protected pausePlayer() {
    if (this._pauseRequests === false) {
      return;
    }
    publish(this.conf.topic.playerCommands, {
      command: "pause",
    });
  }

  protected resumePlayer() {
    if (this._pauseRequests === false) {
      return;
    }
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
    let url = image;
    if (!image.startsWith("http")) {
      url = `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${image}`;
    }
    return fetch(url, {
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
      if (alert.video) {
        this.loadImage(alert.video).then((video) => {
          log.debug({ origin: alert.video, current: video }, "image preloaded");
          alert.video = video;
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
    this._premoderation = (
      this.settings.get("premoderation") as PremoderationProperty
    ).value.enabled;
    this._pauseRequests = (
      this.settings.get("pause-media") as BooleanProperty
    ).value;
    this.sortedAlerts = alerts.sortedAlerts;
    await Promise.all(this.sortedAlerts.map((alert) => this.loadAudio(alert)));
    log.debug({ alert: this.sortedAlerts }, "sorted alerts");
    this.preloadImages();
  }

  private loadAudio(alert: any): Promise<any> {
    if (!alert.audio) {
      return Promise.resolve();
    }
    log.debug(`load ${alert.audio}`);
    let url = alert.audio;
    if (!url.startsWith("http")) {
      url = `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.audio}`;
    }
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
    })
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        alert.buffer = buffer;
      });
  }

  private findAlert(json: any) {
    let index = -1;
    if (json.alertId) {
      index = this.sortedAlerts.findIndex((alert) => alert.id === json.alertId);
    } else {
      index = this.sortedAlerts.findIndex((alert) => alert.firedBy(json));
      log.debug(`choosen alert index: ${index}`);
    }
    if (index === -1) {
      return null;
    }
    const choosenAlert = this.sortedAlerts[index];
    const choosenAlertPool = this.sortedAlerts.filter((alert) => {
      if (alert.triggers.length !== choosenAlert.triggers.length) {
        return false;
      }
      return (
        choosenAlert.triggers
          .map(
            (trigger, index) =>
              alert.triggers[index].type === trigger.type &&
              alert.triggers[index].compare(trigger) === 0,
          )
          .findIndex((trigger) => !trigger) === -1
      );
    });
    if (choosenAlertPool.length > 0) {
      const selected = getRndInteger(0, choosenAlertPool.length);
      log.debug(
        { index: selected, pool: choosenAlertPool },
        "choosen alert pool",
      );
      return choosenAlertPool[selected];
    }
    return choosenAlert;
  }

  protected async renderAlert(
    alert: Alert,
    data: any,
    ackFunction: Function,
  ): Promise<void> {
    // TODO: send after checking for showing?
    if (this.showing === true) {
      setTimeout(() => this.renderAlert(alert, data, ackFunction), 1000);
      log.debug("another alert in play");
      return;
    }

    const duration = alert.property("duration")?.time;
    if (alert.property("duration")?.limited ?? false) {
      // setTimeout(() => {
      //   Promise.all([
      //     this.finishImage(alert),
      //     this.finishTitle(alert),
      //     this.finishMessage(alert),
      //     this.finishWidget(alert),
      //   ]).then(() => {
      //     log.debug("clearing alert");
      //     this.interrupt();
      //   });
      // }, duration);
    }
    this.showing = true;
    this.ackFunction = ackFunction;
    this.sendStartNotification(data.id);
    this.pausePlayer();

    log.debug({ data: data }, "alerting data");
    if (this._premoderation === true && data.force !== true) {
      return this.voiceController
        ?.playSource(
          //`${process.env.REACT_APP_FILE_API_ENDPOINT}/assets/premoderation-sound.wav`,
          this._recipientId === "tabularussia"
            ? "https://cdn.oda.digital/assets/100new.mp3"
            : "https://cdn.oda.digital/assets/bonk.mp3",
        )
        .then(() => {
          log.debug("clearing alert");
          this.interrupt();
        });
    }

    log.debug({ alert: alert }, "render image for alert");
    this.state.layout = alert.property("layout");

    return Promise.all([
      this.renderWidget(alert),
      this.renderImage(alert, data),
      this.renderTitle(alert, data),
      this.renderMessage(alert, data),
      this.playAudio(alert, data).then(() => {
        log.debug("handled audio");
      }),
      sleep(3000).then(() => {
        log.debug("minimal time passed");
      }),
      sleep(duration).then(() => {
        log.debug("handled widget sleep");
      }),
      sleep(alert.property("messageDuration")?.time).then(() => {
        log.debug("handled message sleep");
      }),
      sleep(alert.property("headerDuration")?.time).then(() => {
        log.debug("handled header sleep");
      }),
      sleep(alert.property("imageDuration")?.time).then(() => {
        log.debug("handled header sleep");
      }),
    ])
      .then(() => {
        log.debug("finish phase");
        return Promise.all([
          this.finishImage(alert),
          this.finishTitle(alert),
          this.finishMessage(alert),
          this.finishWidget(alert),
        ]).then(() => {
          log.debug("all promises finished");
        });
      })
      .then(() => {
        log.debug("clearing alert");
        this.interrupt();
      });
  }

  private async renderWidget(alert: Alert): Promise<void> {
    const shadowProperty = alert.get("totalShadow") as BoxShadowProperty;

    return (alert.get("totalBackgroundImage") as BackgroundImageProperty)
      .calcCss()
      .then((css) => {
        this.state.totalBackgroundImage = css;
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
        this.state.totalRounding = (
          alert.get("totalRounding") as RoundingProperty
        ).calcCss();
        this.state.totalPadding = (
          alert.get("totalPadding") as PaddingProperty
        ).calcCss();
        this.state.totalShadow = (
          alert.get("totalShadow") as BoxShadowProperty
        ).calcCss();
      })
      .then(() => {
        const animation = alert.get("totalAppearance") as AnimationProperty;
        this.state.totalClassName = animation.classname();
        this.state.totalAnimationDuration = animation.calcCss();
        log.debug(
          { classname: this.state.totalClassName },
          "changing total animation while appearing",
        );
        return sleep(animation.value.duration);
      })
      .then(() => {
        const animation = alert.get("totalAnimation") as AnimationProperty;
        this.state.totalClassName = animation.classname();
        log.debug(
          { classname: this.state.totalClassName },
          "changing total animation while idle",
        );
        return sleep(animation.value.duration);
      })
      .then(() => {
        log.debug("handled widget rendering");
      });
  }

  private async renderImage(alert: Alert, data: any): Promise<void> {
    const delay = alert.property("imageAppearanceDelay") as number;
    log.debug({ delay: delay }, "image delay");

    const shadowProperty = alert.get("imageShadow") as BoxShadowProperty;
    this.state.imageVolume = alert.property("imageVolume");

    let width: CSSProperties = {
      width: `calc(100% - ${2 * shadowProperty.requiredWidth}px)`,
      marginLeft: shadowProperty.requiredWidth + "px",
      marginRight: shadowProperty.requiredWidth + "px",
    };
    const widthProperty = alert.get("imageWidth") as WidthProperty;
    if (widthProperty.value > 1) {
      width = widthProperty.calcCss();
    }

    let height: CSSProperties = {
      height: `calc(100% - ${2 * shadowProperty.requiredWidth}px)`,
      marginTop: shadowProperty.requiredHeight + "px",
      marginBottom: shadowProperty.requiredHeight + "px",
    };

    const heightProperty = alert.get("imageHeight") as HeightProperty;
    if (heightProperty.value > 0) {
      height = { ...heightProperty.calcCss(), ...{ flexGrow: 0 } };
    }

    return sleep(delay)
      .then(() => {
        if (alert.property("imageDuration")?.limited ?? false) {
          const duration = alert.property("imageDuration")?.time;
          log.debug({ duration: duration }, "set image clearing");
          setTimeout(() => {
            this.finishImage(alert);
          }, duration);
        }

        if (alert.image) {
          log.debug({ image: alert.image }, "rendering image");
          this.state.image = `${alert.image}`;
        } else if (alert.video) {
          log.debug({ video: alert.video }, "rendering video");
          this.state.video = `${alert.video}`;
        }

        this.state.imageBackgroundBlur = alert.property("imageBackgroundBlur");
        this.state.imageStyle = {
          ...width,
          ...height,
          ...(alert.get("imagePadding") as PaddingProperty).calcCss(),
          ...(alert.get("imageBorder") as BorderProperty).calcCss(),
          ...(alert.get("imageRounding") as RoundingProperty).calcCss(),
          ...(alert.get("imageShadow") as BoxShadowProperty).calcCss(),
        };
      })
      .then(() => {
        const animation = alert.get("imageAppearance") as AnimationProperty;
        this.state.imageClassName = animation.classname();
        this.state.imageStyle = {
          ...toJS(this.state.imageStyle),
          ...animation.calcCss(),
        };
        return sleep(animation.value.duration);
      })
      .then(() => {
        const animation = alert.get("imageAnimation") as AnimationProperty;
        this.state.imageClassName = animation.classname();
      })
      .then(() => {
        log.debug("handled image rendering");
      });
  }

  private async renderTitle(alert: Alert, data: any): Promise<void> {
    const delay = alert.property("headerAppearanceDelay") as number;
    log.debug({ delay: delay }, "header delay");

    return sleep(delay)
      .then(() => {
        if (alert.property("headerDuration")?.limited ?? false) {
          setTimeout(
            () => this.finishTitle(alert),
            alert.property("headerDuration")?.time,
          );
        }

        const nicknameTextTemplate = alert.property("nicknameTextTemplate");

        const title = nicknameTextTemplate
          .replace("<username>", data.nickname ? data.nickname : "Аноним")
          .replace("<amount>", `${data.amount.major} ${data.amount.currency}`);
        log.debug("setting title");
        this.state.title = title;
        this.state.showTitle = (
          alert.get("showHeader") as BooleanProperty
        ).value;

        const headerFont = alert.get("headerFont") as AnimatedFontProperty;
        this.state.fonts.push(headerFont.value.family);
        this.state.titleClassName = `${headerFont.calcClassName()}`;

        const shadowProperty = alert.get(
          "headerBoxShadow",
        ) as BoxShadowProperty;

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
        const heightProperty = alert.get("headerHeight") as HeightProperty;
        if (heightProperty.value > 0) {
          height = heightProperty.calcCss();
        }
        const headerAlignment = alert.get(
          "headerAlignment",
        ) as SingleChoiceProperty;
        this.state.titleStyle = {
          ...headerFont.calcStyle(),
          ...(alert.get("headerBorder") as BorderProperty).calcCss(),
          ...(alert.get("headerRounding") as RoundingProperty).calcCss(),
          ...(alert.get("headerPadding") as PaddingProperty).calcCss(),
          ...({ textAlign: headerAlignment.value } as CSSProperties),
          ...width,
          ...height,
        };
      })
      .then(() => {
        return (
          alert.get("headerBackgroundImage") as BackgroundImageProperty
        ).calcCss();
      })
      .then((css) => {
        log.debug({ css: css }, "settings image style");
        this.state.titleImageStyle = {
          ...(alert.get("titleBackgroundColor") as ColorProperty).calcCss(),
          ...(alert.get("headerRounding") as RoundingProperty).calcCss(),
          ...(alert.get("headerPadding") as PaddingProperty).calcCss(),
          ...(alert.get("headerBoxShadow") as BoxShadowProperty).calcCss(),
          ...css,
        };
      })
      .then(() => {
        const animation = alert.get("headerAppearance") as AnimationProperty;
        this.state.headerClassName = animation.classname();
        this.state.headerStyle = animation.calcCss();
        log.debug(
          { duration: animation.value.duration },
          "rendering header appearance",
        );
        return sleep(animation.value.duration);
      })
      .then(() => {
        const animation = alert.get("headerAnimation") as AnimationProperty;
        this.state.headerClassName = animation.classname();
        this.state.headerStyle = animation.calcCss();
        log.debug(
          { duration: animation.value.duration },
          "rendering header animation",
        );
      })
      .then(() => {
        log.debug("handled title rendeing");
      });
  }

  private async renderMessage(alert: Alert, data: any): Promise<void> {
    const delay = alert.property("messageAppearanceDelay") as number;
    const messageFont = alert.get("font") as AnimatedFontProperty;

    return sleep(delay)
      .then(() => {
        if (alert.property("messageDuration")?.limited ?? false) {
          setTimeout(
            () => this.finishMessage(alert),
            alert.property("messageDuration")?.time,
          );
        }

        if (messageFont.value.family) {
          this.state.fonts.push(messageFont.value.family);
        }

        const shadowProperty = alert.get(
          "messageBoxShadow",
        ) as BoxShadowProperty;

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
        const messageAlignment = alert.get(
          "messageAlignment",
        ) as SingleChoiceProperty;

        this.state.messageStyle = {
          ...messageFont.calcStyle(),
          ...(alert.get("messageBorder") as BorderProperty).calcCss(),
          ...(alert.get("messageRounding") as RoundingProperty).calcCss(),
          ...(alert.get("messagePadding") as PaddingProperty).calcCss(),
          ...({ textAlign: messageAlignment.value } as CSSProperties),
          ...width,
          ...height,
        };
      })
      .then(() => {
        return (alert.get("messageBackgroundImage") as BackgroundImageProperty)
          .calcCss()
          .then((css) => {
            log.debug({ css: css }, "settings image style");
            this.state.messageImageStyle = {
              ...(
                alert.get("messageBackgroundColor") as ColorProperty
              ).calcCss(),
              ...(alert.get("messageRounding") as RoundingProperty).calcCss(),
              ...(alert.get("messageBoxShadow") as BoxShadowProperty).calcCss(),
              ...css,
            };
          });
      })
      .then(() => {
        log.debug("setting message");
        this.state.messageClassName = messageFont.calcClassName() ?? "";
        this.state.message = data.message;
        this.state.showMessage = (
          alert.get("showMessage") as BooleanProperty
        ).value;
      })
      .then(() => {
        const animation = alert.get("messageAppearance") as AnimationProperty;
        this.state.messageContainerClassName = animation.classname();
        this.state.messageContainerStyle = animation.calcCss();
        return sleep(animation.value.duration);
      })
      .then(() => {
        const animation = alert.get("messageAnimation") as AnimationProperty;
        this.state.messageContainerClassName = animation.classname();
      })
      .then(() => {
        log.debug("handled message rendeing");
      });
  }

  private async finishWidget(alert: Alert): Promise<void> {
    log.debug("starting finishing widget");
    const animation = alert.get("totalDisappearance") as AnimationProperty;
    this.state.totalClassName = animation.classname();
    this.state.totalAnimationDuration = animation.calcCss();
    log.debug(
      {
        classname: this.state.totalClassName,
        duration: animation.value.duration,
      },
      "changing total animation while finishing",
    );
    return sleep(animation.value.duration).then(() => this.state.clearTotal());
  }

  private async finishImage(alert: Alert): Promise<void> {
    log.debug("finishing image");
    const animation = alert.get("imageDisappearance") as AnimationProperty;
    const waiting = (alert.get("totalDisappearance") as AnimationProperty).value
      .duration;
    this.state.imageClassName = animation.classname();
    this.state.imageStyle = {
      ...this.state.imageStyle,
      ...animation.calcCss(),
    };
    return Promise.all([sleep(animation.value.duration), sleep(waiting)]).then(
      () => {
        this.state.clearImage();
      },
    );
  }

  private async finishTitle(alert: Alert): Promise<void> {
    const waiting = (alert.get("totalDisappearance") as AnimationProperty).value
      .duration;
    const animation = alert.get("headerDisappearance") as AnimationProperty;
    this.state.headerClassName = animation.classname();
    this.state.headerStyle = animation.calcCss();
    return Promise.all([sleep(animation.value.duration), sleep(waiting)]).then(
      () => this.state.clearTitle(),
    );
  }

  private async finishMessage(alert: Alert): Promise<void> {
    const waiting = (alert.get("totalDisappearance") as AnimationProperty).value
      .duration;
    const animation = alert.get("messageDisappearance") as AnimationProperty;
    this.state.messageContainerClassName = animation.classname();
    this.state.messageContainerStyle = animation.calcCss();
    return Promise.all([sleep(animation.value.duration), sleep(waiting)]).then(
      () => this.state.clearMessage(),
    );
  }

  async playAudio(alert: Alert, data: any): Promise<void | AudioBuffer> {
    if (!this.voiceController) {
      return Promise.resolve();
    }
    return this.voiceController?.playAudio(alert).then(() => {
      return this.voiceController?.pronounceTitle(alert, data).then(() => {
        const voiceForMessage = alert.property("enableVoiceForMessage");
        if (!voiceForMessage) {
          // TODO: make common function
          return Promise.resolve();
        }
        return this.voiceController?.pronounceMessage(alert, data);
      });
    });
  }

  public interrupt() {
    this.voiceController?.interrupt();
    this.clear();
    this.resumePlayer();
    this.ackFunction?.();
    this.sendEndNotification();
  }

  protected clear() {
    if (this.wait > 0) {
      delay(this.wait);
      this.wait = 0;
    }
    this.state.clear();
    this.showing = false;
  }

  public get state(): AlertState {
    return this._state;
  }
}
