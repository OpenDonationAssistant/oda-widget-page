import { Alert } from "../../components/ConfigurationPage/widgetsettings/alerts/Alerts";
import { log } from "../../logging";
import { getRndInteger, sleep } from "../../utils";

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export class VoiceController {
  audioCtx = new AudioContext();
  playingSource: AudioBufferSourceNode | null = null;
  onEndHandler: any | null = null;
  private _streamerName: string;

  constructor(streamerName: string) {
    this._streamerName = streamerName;
  }

  // TODO: использовать axios
  private loadAudio(url: string): Promise<ArrayBuffer> {
    log.debug(`load ${url}`);
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
    }).then((response) => response.arrayBuffer());
  }

  playAudio(alert: any): Promise<void | AudioBuffer> {
    const volume = alert.property("audio-volume") ?? 100;
    return sleep(alert.property("audioDelay")).then(() => {
      log.debug({ buffer: alert.buffer }, "audio file buffer");
      if (alert.buffer) {
        return this.pronounce(structuredClone(alert.buffer), volume);
      }
    });
  }

  playSource(src: string): Promise<void | AudioBuffer> {
    const volume = 100;
    return fetch(src, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
    })
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        this.pronounce(structuredClone(buffer), volume);
      });
  }

  pronounceTitle(alert: Alert, data: any): Promise<void | AudioBuffer> {
    log.debug("start to pronounce title");

    const playTitle = alert.property("enableVoiceForHeader") ?? true;
    const playTitleIfMessageIsEmpty =
      alert.property("enableVoiceWhenMessageIsEmpty") ?? false;
    const volume = alert.property("voiceVolume") ?? 100;

    if (!playTitle) {
      log.debug({ playTitle: playTitle }, "skipping title playing");
      return Promise.resolve();
    }
    if (
      (data.message === undefined ||
        data.message === null ||
        data.message === "") &&
      !playTitleIfMessageIsEmpty
    ) {
      return Promise.resolve();
    }

    const message = data?.message?.trim();
    const headerForVoice = message
      ? alert.property("voiceTextTemplate")
      : alert.property("voiceEmptyTextTemplate");
    const text = headerForVoice ?? "";
    const templates = text.split("\n");
    const choosenTemplate =
      templates.length > 1
        ? templates[getRndInteger(0, templates.length)]
        : text;
    const resultText = choosenTemplate
      .trim()
      .replace("<username>", data.nickname ? data.nickname : "Аноним")
      .replace("<amount>", data.amount.major)
      .replace("<minoramount>", data.amount.major * 100)
      .replace("<streamer>", this._streamerName);
    try {
      if (resultText.length > 0) {
        return sleep(alert.property("headerVoiceDelay") as number)
          .then(() => {
            if (data.nickname === "Тестовый алерт") {
              return this.loadAudio("https://api.oda.digital/public/title.mp3");
            }
            return this.voiceByGoogle(resultText);
          })
          .then((audio) => {
            return this.pronounce(audio, volume);
          });
      } else {
        return Promise.resolve();
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  }

  pronounceMessage(alert: Alert, data: any): Promise<void | AudioBuffer> {
    log.debug("start to pronounce message");
    if (!data || !data.message || data.message.length === 0) {
      return Promise.resolve();
    }

    return sleep(alert.property("messageVoiceDelay") as number)
      .then(() => {
        if (data.message === "Тестовое сообщение") {
          return this.loadAudio("https://api.oda.digital/public/message.mp3");
        }
        if (data.media?.url){
          return this.loadAudio(data.media.url);
        }
        return this.voiceByGoogle(data.message);
      })
      .then((audio) => {
        return this.pronounce(audio, alert.property("voiceVolume") ?? 100);
      });
  }

  private pronounce(
    buffer: ArrayBuffer,
    volume: number,
  ): Promise<void | AudioBuffer> {
    log.debug("trying to pronounce something");
    return new Promise((resolve) => {
      this.onEndHandler = () => {
        log.debug("calling resolve");
        resolve();
      };
      this.audioCtx.decodeAudioData(
        buffer,
        (buf) => {
          const gainNode = this.audioCtx.createGain();
          gainNode.gain.value = volume / 100; // setting it to 10%
          gainNode.connect(this.audioCtx.destination);

          let source = this.audioCtx.createBufferSource();
          this.playingSource = source;
          source.connect(gainNode);
          source.buffer = buf;
          source.loop = false;
          source.start(0);
          source.addEventListener("ended", this.onEndHandler);
        },
        (err) => {
          console.log(err);
          this.onEndHandler();
        },
      );
    });
  }

  private async voiceByMCS(message: string): Promise<ArrayBuffer> {
    return await fetch("https://api.oda.digital/tts?encoder=mp3", {
      method: "POST",
      body: message,
    }).then((response) => response.arrayBuffer());
  }

  private async voiceByGoogle(message: string): Promise<ArrayBuffer> {
    let body = {
      input: {
        ssml: "<speak>" + message + ".</speak>",
      },
      voice: {
        languageCode: "ru-RU",
        name: "ru-RU-Wavenet-D",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };

    const response = await fetch("https://api.oda.digital/texttospeech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return base64ToArrayBuffer(json.audioContent);
  }

  public interrupt() {
    log.debug("interrupting audio");
    if (this.playingSource) {
      this.playingSource.removeEventListener("ended", this.onEndHandler);
      this.playingSource.stop();
    }
  }
}
