import { PlaylistController } from "./PlaylistController";
import { Song } from "./types";

interface IPlayer {
  id: string;
	play(song: Song): void;

  playlistController: PlaylistController;
}

export { IPlayer };
