import { Playlist } from "../../logic/playlist/Playlist";
import { PlaylistController } from "./PlaylistController";

export interface IPlaylistRenderer {
  id: string;
	playlistController: PlaylistController;

	bind(playlist: Playlist): void;
  unbind(playlist: Playlist): void;
}
