import videojs from "video.js";
import "videojs-youtube";
import { log } from "../../logging";
import { Song } from "../MediaWidget/types";
import { AbstractPlayerStore } from "./Player";

export class DemoPlayerStore implements AbstractPlayerStore {
  options = {
    autoplay: true,
    muted: true,
    controls: false,
    responsive: false,
    fluid: false,
    preload: "none",
    techOrder: ["youtube"],
    youtube: { ytControls: 0, rel: 0 },
    sources: [
      {
        src: "https://youtu.be/T2QZpy07j4s",
        type: "video/youtube",
      },
    ] as Song[],
  };

  constructor() {
    this.play();
  }

  play(): void {
    const videoElement = document.getElementById("mediaplayer");
    if (!videoElement) {
      return;
    }
    log.debug("Creating demo player");

    videojs(videoElement, this.options);
  }

  public set volume(volume: number) {}
}
