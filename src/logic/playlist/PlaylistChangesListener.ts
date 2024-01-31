import { Playlist } from "./Playlist";

interface IPlaylistChangesListener {
  id: string;
  trigger(updated: Playlist): void;
}

export { IPlaylistChangesListener }
