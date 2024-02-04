import { publish, subscribe } from "../../socket";
import { IPlayer } from "./IPlayer";
import { Song } from "./types";

export class PopupPlayerImpl implements IPlayer {
  id =  "popup";

  play(song: Song): void {
    publish("/topic/media", { url: song.src });
  }

  onEnded(callback: Function): void {
    subscribe("test2", "/topic/finishedmedia", (message) => {
      callback.call({});
      message.ack();
    });
  }
}
