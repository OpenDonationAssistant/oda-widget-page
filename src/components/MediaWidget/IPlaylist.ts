import { PlaylistController } from "./PlaylistController";
import { Song } from "./types";

export interface IPlaylist {
	setPlaylist(playlist: Song[]): void;
	setCurrent(current: number): void;

	playlistController: PlaylistController;
}
