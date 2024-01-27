import { Playlist } from "../../logic/playlist/Playlist";
import { PlaylistController } from "./PlaylistController";

export interface IPlaylistRenderer {
  id: string;
	setPlaylist(playlist: Playlist): void;

	playlistController: PlaylistController;
}
