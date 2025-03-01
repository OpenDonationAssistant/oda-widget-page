import { Alert } from "../../components/ConfigurationPage/widgetsettings/alerts/Alerts";
import { log } from "../../logging";
import { getRndInteger } from "../../utils";

function base64ToArrayBuffer(base64) {
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
  recipientId: string;

  constructor(recipientId: string) {
    this.recipientId = recipientId;
  }

  playAudio(alert: any, onEndHandler: any) {
    const volume =
      alert.properties.find((prop) => prop.name === "audio-volume")?.value ??
      100;
    try {
      this.pronounce(structuredClone(alert.buffer), volume, onEndHandler);
    } catch (error) {
      console.log(error);
      if (onEndHandler) {
        onEndHandler();
      }
    }
  }

  pronounceTitle(
    alert: Alert,
    data: any,
    onEndHandler: any,
  ): Promise<void | AudioBuffer> {
    log.debug("start to pronounce title");

    const playTitle = alert.property("enableVoiceForHeader") ?? true;
    const playTitleIfMessageIsEmpty =
      alert.property("enableVoiceWhenMessageIsEmpty") ?? false;
    const volume = alert.property("voiceVolume") ?? 100;

    if (!playTitle) {
      if (onEndHandler) {
        onEndHandler();
      }
      log.debug({ playTitle: playTitle }, "skipping title playing");
      return Promise.resolve();
    }
    if (
      (data.message === undefined ||
        data.message === null ||
        data.message === "") &&
      !playTitleIfMessageIsEmpty
    ) {
      if (onEndHandler) {
        onEndHandler();
      }
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
      .replace("<streamer>", this.recipientId);
    try {
      if (resultText.length > 0) {
        return this.voiceByGoogle(resultText).then((audio) => {
          return this.pronounce(audio, volume, onEndHandler);
        });
      } else {
        onEndHandler();
        return Promise.resolve();
      }
    } catch (error) {
      console.log(error);
      if (onEndHandler) {
        onEndHandler();
      }
      return Promise.resolve();
    }
  }

  pronounceMessage(
    alert: Alert,
    data: any,
    onEndHandler: any,
  ): Promise<void | AudioBuffer> {
    log.debug("start to pronounce message");
    if (!data || !data.message || data.message.length === 0) {
      if (onEndHandler) {
        onEndHandler();
      }
      return Promise.resolve();
    }

    return this.voiceByGoogle(data.message)
      .then((audio) => {
        return this.pronounce(
          audio,
          alert.property("voiceVolume") ?? 100,
          onEndHandler,
        );
      })
      .catch((error) => {
        log.error({ error: error }, "error while pronouncing message");
        if (onEndHandler) {
          onEndHandler();
        }
      });
  }

  private pronounce(
    buffer: ArrayBuffer,
    volume: number,
    onEndHandler: any,
  ): Promise<void | AudioBuffer> {
    return this.audioCtx
      .decodeAudioData(
        buffer,
        (buf) => {
          const gainNode = this.audioCtx.createGain();
          gainNode.gain.value = volume / 100; // setting it to 10%
          gainNode.connect(this.audioCtx.destination);

          let source = this.audioCtx.createBufferSource();
          if (onEndHandler) {
            this.onEndHandler = onEndHandler;
            source.addEventListener("ended", onEndHandler);
          }
          this.playingSource = source;
          source.connect(gainNode);
          source.buffer = buf;
          source.loop = false;
          source.start(0);
        },
        (err) => {
          console.log(err);
        },
      )
      .catch((error) => {
        console.log(error);
        if (onEndHandler) {
          console.log("calling onEndHandler");
          onEndHandler();
        }
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

  interrupt() {
    log.debug("interrupting audio");
    if (this.playingSource) {
      this.playingSource.removeEventListener("ended", this.onEndHandler);
      this.playingSource.stop();
    }
  }
}
