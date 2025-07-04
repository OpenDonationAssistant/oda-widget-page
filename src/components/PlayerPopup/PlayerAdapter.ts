import "https://widgets.staging.oda.digital/videoplayer.js";
import { log } from "../../logging";
import { Provider, Song } from "../MediaWidget/types";
import videojs from "video.js";

export enum PlayerAdapterEvent {
  PLAY,
  PAUSED,
  ENDED,
  ERROR,
}

export interface PlayerAdapter {
  play(): void;
  pause(): void;
  paused(): boolean;
  show(show: boolean): void;
  volume(value: number): void;
  duration(): number | undefined;
  currentTime(): number | undefined;
  on(event: PlayerAdapterEvent, callback: () => void): void;
  dispose(): void;
}

const vkplayer = (
  parent: HTMLElement,
  song: Song,
  muted: boolean,
): PlayerAdapter => {
  log.debug({ song: song }, "creating vk  player for song");
  const videoElement = document.createElement("iframe");
  videoElement.id = "vkplayer";
  videoElement.setAttribute(
    "src",
    `https://vk.com/video_ext.php?oid=${song.originId?.replace(
      "_",
      "&id=",
    )}&hd=2&autoplay=1&js_api=1`,
  );
  videoElement.setAttribute(
    "allow",
    "autoplay; encrypted-media; picture-in-picture",
  );
  parent.appendChild(videoElement);
  const player = VK.VideoPlayer(videoElement);
  log.debug({ vkPlayer: player });
  const playerAdapter = {
    play: () => player.play(),
    pause: () => player.pause(),
    paused: () => player.getState() !== "playing",
    show: (show: boolean) => {
      videoElement.hidden = show;
    },
    volume: (value: number) => {
      player.setVolume(value);
    },
    currentTime: (time?: number | undefined): number => {
      if (!time) {
        return player.getCurrentTime();
      }
      player.seek(time);
      return time;
    },
    duration: () => player.getDuration(),
    on: (event: PlayerAdapterEvent, callback: () => void) => {
      switch (event) {
        case PlayerAdapterEvent.PLAY:
          player.on("started", callback);
          player.on("resumed", callback);
          break;
        case PlayerAdapterEvent.PAUSED:
          player.on("paused", callback);
          break;
        case PlayerAdapterEvent.ENDED:
          player.on("ended", callback);
          break;
        case PlayerAdapterEvent.ERROR:
          player.on("error", callback);
          break;
      }
    },
    dispose: () => {
      parent.removeChild(videoElement);
    }
  };
  return playerAdapter;
};

const youtube = (
  parent: HTMLElement,
  song: Song,
  muted: boolean,
): PlayerAdapter => {
  const options = {
    autoplay: true,
    muted: muted,
    controls: false,
    responsive: false,
    fluid: false,
    preload: "none",
    techOrder: ["youtube"],
    youtube: { ytControls: 0, rel: 0 },
    sources: [song],
  };
  const holder = document.createElement("div");
  parent.appendChild(holder);
  const player = videojs(holder, options);
  return {
    play: () => player.play(),
    pause: () => player.pause(),
    paused: () => player.paused(),
    show: (show: boolean) => {
      holder.hidden = show;
    },
    volume: (value: number) => player.volume(value),
    currentTime: () => player.currentTime(),
    duration: () => player.duration(),
    on: (event: PlayerAdapterEvent, callback: () => void) => {
      switch (event) {
        case PlayerAdapterEvent.PLAY:
          player.on("play", callback);
          break;
        case PlayerAdapterEvent.PAUSED:
          player.on("pause", callback);
          break;
        case PlayerAdapterEvent.ENDED:
          player.on("ended", callback);
          break;
        case PlayerAdapterEvent.ERROR:
          player.on("error", callback);
          break;
      }
    },
    dispose: () => player.dispose()
  };
};

export function createPlayerAdapter(
  song: Song,
  muted = false,
): PlayerAdapter | null {
  const playerHolder = document.getElementById("mediaplayer");
  if (!playerHolder) {
    log.debug("can't find #mediaplayer");
    return null;
  }
  switch (song.provider) {
    case Provider.VK:
      return vkplayer(playerHolder, song, muted);
    case Provider.YOUTUBE:
    default:
      return youtube(playerHolder, song, muted);
  }
}
