import { Playlist } from "../../logic/playlist/Playlist";
import { PlaylistController } from "./PlaylistController";

export interface IPlaylistRenderer {
  id: string;
	bindPlaylist(playlist: Playlist): void;
  unbind(): void;

	playlistController: PlaylistController;
}
