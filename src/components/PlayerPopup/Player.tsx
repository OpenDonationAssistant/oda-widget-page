import { Song } from "../MediaWidget/types";
import { publish, subscribe } from "../../socket";
import { log } from "../../logging";
import {
  PlayerAdapter,
  PlayerAdapterEvent,
  createPlayerAdapter,
} from "./PlayerAdapter";

export interface AbstractPlayerStore {
  play(song?: Song): void;
  volume: number;
}

export interface PlayerConfiguration {
  remoteplayerfeedback: string;
  remoteplayer: string;
}

export class PlayerStore implements AbstractPlayerStore {
  player: PlayerAdapter | null = null;
  song: Song | null = null;
  widgetId: string;
  conf: PlayerConfiguration;
  private _volume: number = 0.5;

  constructor({
    widgetId,
    conf,
    song,
  }: {
    widgetId: string;
    conf: PlayerConfiguration;
    song?: Song;
  }) {
    log.debug("Creating player controller");
    this.widgetId = widgetId;
    this.conf = conf;
    this.song = song ?? null;
    this.listen();
  }

  public set volume(value: number) {
    log.debug({ volume: value }, "set volume");
    this._volume = value;
    this.player?.volume(value);
  }

  play(song?: Song) {
    this.song = song ?? this.song;
    if (!this.song) {
      return;
    }

    if (this.player) {
      log.debug("Disposing of old player");
      this.player.dispose();
      this.player = null;
    }

    log.debug("Creating player");
    this.player = createPlayerAdapter(this.song);
    log.debug(
      { player: this.player, volume: this._volume },
      "create with volume",
    );
    this.player?.volume(this._volume);
    this.player?.on(PlayerAdapterEvent.ENDED, () => {
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
      log.debug({ json: json }, "Received command");
      if (json.command === "play") {
        log.debug({ song: json.song }, `playing song`);
        this.play(json.song);
        message.ack();
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
        this.player?.volume(json.volume);
      }
      message.ack();
    });
  }
}
