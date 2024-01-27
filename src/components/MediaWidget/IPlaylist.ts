import { Playlist } from "../../logic/playlist/Playlist";
import { PlaylistController } from "./PlaylistController";

export interface IPlaylist {
	setPlaylist(playlist: Playlist): void;
	setCurrent(current: number): void;

	playlistController: PlaylistController;
}
