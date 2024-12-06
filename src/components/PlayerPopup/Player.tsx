import { MutableRefObject } from "react";
import { Song } from "../MediaWidget/types";
import { publish, subscribe } from "../../socket";
import { log } from "../../logging";
import videojs, { VideoJsPlayer } from "video.js";
import { uuidv4 } from "uuidv7";

export interface PlayerConfiguration {
  remoteplayerfeedback: string;
  remoteplayer: string;
}

export class Player {
  private _videoRef: MutableRefObject<HTMLDivElement | null> | null = null;
  player: VideoJsPlayer | null = null;
  song: Song | null = null;
  widgetId: string;
  conf: PlayerConfiguration;
  private _volume: number = 0.5;

  options = {
    autoplay: true,
    controls: false,
    responsive: false,
    fluid: false,
    preload: "none",
    techOrder: ["youtube"],
    youtube: { ytControls: 0, rel: 0 },
    sources: [] as Song[],
  };

  constructor({
    widgetId,
    conf,
    song,
    autoplay,
  }: {
    widgetId: string;
    conf: PlayerConfiguration;
    song?: Song;
    autoplay?: boolean;
  }) {
    log.debug("Creating player controller");
    this.widgetId = widgetId;
    this.conf = conf;
    this.song = song ?? null;
    this.options.autoplay = autoplay ?? true;
    this.listen();
  }

  public set videoRef(ref: MutableRefObject<HTMLDivElement | null>) {
    this._videoRef = ref;
  }

  public set volume(value: number) {
    log.debug({volume: value}, "set volume");
    this._volume = value;
    this.player?.volume(value);
  }

  play(song?: Song) {
    this.song = song ?? this.song;
    if (!this.song) {
      return;
    }
    if (!this._videoRef || !this._videoRef.current) {
      return;
    }
    if (this.player) {
      log.debug("Disposing of old player");
      this.player.dispose();
      this.player = null;
    }
    log.debug("Creating player");

    const videoElement = document.createElement("video-js");
    videoElement.setAttribute("id", "mediaplayer");

    videoElement.classList.add("vjs-big-play-centered");
    this._videoRef.current?.appendChild(videoElement);
    this.options.sources = [this.song];

    this.player = videojs(videoElement, this.options);
    this.player.uuid = uuidv4();
    log.debug({volume: this._volume}, "create with volume");
    this.player?.volume(this._volume);
    this.player.on("ended", () => {
      log.debug(`finished playing song`);
      publish(this.conf.remoteplayerfeedback, {
        state: "finished",
        song: song,
      });
      this.player?.dispose();
      this.player = null;
    });
    log.debug("Player has been created");
  }

  private listen() {
    log.debug({ conf: this.conf }, "Subscribing to remote player");
    subscribe(this.widgetId, this.conf.remoteplayer, (message) => {
      let json = JSON.parse(message.body);
      log.debug({ song: json.song }, `playing song`);
      if (json.command === "play") {
        this.play(json.song);
      }
      if (json.command === "stop") {
        log.debug(`disposing player by stop command`);
        this.player?.dispose();
        this.player = null;
      }
      if (json.command === "pause") {
        this.player?.pause();
      }
      if (json.command === "resume") {
        this.player?.play();
      }
      if (json.command === "volume") {
        this.volume = json.volume;
      }
      message.ack();
    });
  }
}
