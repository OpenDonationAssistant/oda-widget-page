import { IFontLoader } from "../../components/FontLoader/IFontLoader";
import { log } from "../../logging";
import { publish, subscribe } from "../../socket";
import { VoiceController } from "../voice/VoiceController";

export class AlertController {
  private settings: any;
  private conf: any;

  private showing: boolean = false;
  private ackFunction: Function | null = null;
  private sortedAlerts: any = [];

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
          log.info({message}, `Received alert`);
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
    const sorted = this.settings.config.alerts.sort(
      (a, b) => a.trigger.amount - b.trigger.amount,
    );
    this.sortedAlerts = sorted;
    log.debug(`loading audio`);
    await Promise.all(this.sortedAlerts.map((alert) => this.loadAudio(alert)));
    log.debug(`alerts: ${JSON.stringify(this.sortedAlerts)}`);
    this.preloadImages();
  }

  loadAudio(alert: any): Promise<any> {
    log.debug(`load ${alert.audio}`);
    return fetch(
      `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.audio}`,
      {
        method: "GET",
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
    const index = this.sortedAlerts.findLastIndex(
      (alert) => alert.trigger.amount <= json.amount.major,
    );

    log.debug(`choosen alert index: ${index}`);
    if (index === -1) {
      return null;
    }
    return this.sortedAlerts[index];
  }

  renderAlert(alert: any, data: any, ackFunction: Function) {
    log.debug(
      `try to render alert ${JSON.stringify(alert)}, audio: ${
        alert.audio
      }, image: ${alert.image}`,
    );
    this.sendStartNotification(data.id);
    this.pausePlayer();
    if (this.showing == true) {
      setTimeout(() => this.renderAlert(alert, data, ackFunction), 1000);
      log.debug("another alert in play");
      return;
    }
    this.showing = true;
    this.ackFunction = ackFunction;

    this.renderImage(alert);
    this.renderTitle(alert, data);
    this.renderMessage(alert, data);
    if (alert.video) {
      setTimeout(() => this.playAudio(alert, data, ackFunction), 5000);
    } else {
      this.playAudio(alert, data, ackFunction);
    }
  }

  playAudio(alert: any, data: any, ackFunction: Function){
    this.voiceController?.playAudio(alert, () => {
      this.voiceController?.pronounceTitle(
        alert,
        data,
        () =>
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
          }),
      );
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
    this.messageRenderers.forEach((renderer) => renderer.setMessage(""));
    this.titleRenderers.forEach((renderer) => renderer.setTitle(""));
    this.alertImageRenderers.forEach((renderer) => renderer.setImage(null));
    this.alertImageRenderers.forEach((renderer) => renderer.setVideo(null));
    this.showing = false;
  }

  private renderImage(alert: any) {
    log.debug(
      `Amount of alert image renderers: ${this.alertImageRenderers.length}`,
    );
    const showTime = this.findSetting(alert.properties, "imageShowTime", null);
    this.alertImageRenderers.forEach((renderer) => {
      console.log(alert.properties);
      if (alert.image){
        log.debug({image: alert.image}, "rendering image");
        renderer.setImage(
          `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`,
        );
      }
      if (alert.video){
        log.debug({video: alert.video}, "rendering video");
        renderer.setVideo(
          `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.video}`,
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
          this.findSetting(alert.properties, "imageWidth", 100),
          this.findSetting(alert.properties, "imageHeight", 100),
        ),
      );
    });
  }

  private renderTitle(alert: any, data: any) {
    const headerFont = this.findSetting(
      alert.properties,
      "nicknameFont",
      "Roboto",
    );
    this.fontLoaders.forEach((loader) => loader.addFont(headerFont));

    const nicknameTextTemplate = this.findSetting(
      alert.properties,
      "nicknameTextTemplate",
      "<username> - <amount>",
    );
    const title = nicknameTextTemplate
      .replace("<username>", data.nickname ? data.nickname : "Аноним")
      .replace("<amount>", `${data.amount.major} ${data.amount.currency}`);

    const headerFontSize = this.findSetting(
      alert.properties,
      "nicknameFontSize",
      "24px",
    );
    const headerColor = this.findSetting(
      alert.properties,
      "headerColor",
      "#fb8c2b",
    );
    this.titleRenderers.forEach((renderer) => {
      renderer.setStyle({
        fontSize: headerFontSize ? headerFontSize + "px" : "unset",
        fontFamily: headerFont ? headerFont : "unset",
        color: headerColor,
      });
      renderer.setTitle(title);
    });
  }

  private renderMessage(alert: any, data: any) {
    const messageFont = this.findSetting(
      alert.properties,
      "messageFont",
      "Roboto",
    );
    this.fontLoaders.forEach((loader) => loader.addFont(messageFont));

    const messageFontSize = this.findSetting(
      alert.properties,
      "messageFontSize",
      "24px",
    );
    const messageColor = this.findSetting(
      alert.properties,
      "messageColor",
      "#fb8c2b",
    );
    const showTime = this.findSetting(alert.properties, "imageShowTime", null);
    this.messageRenderers.forEach((renderer) => {
      renderer.setStyle({
        fontSize: messageFontSize ? messageFontSize + "px" : "unset",
        fontFamily: messageFont ? messageFont : "unset",
        color: messageColor,
      });
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
      : {
          objectFit: "fill",
          maxWidth: "100%",
        };
  }
}
