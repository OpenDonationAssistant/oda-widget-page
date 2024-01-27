import { markListened } from "../../components/MediaWidget/api";
import { Song } from "../../components/MediaWidget/types";
import { log } from "../../logging";

enum PLAYLIST_TYPE {
  REQUESTED,
  PERSONAL,
}

class Playlist {
  _songs: Song[] = [];
  _current: number | null = null;
  _type: PLAYLIST_TYPE;

  constructor(type: PLAYLIST_TYPE) {
    this._type = type;
  }

  addSong(song: Song) {
    if (
      this._songs.some(
        (existing) => existing.originId && existing.originId === song.originId,
      )
    ) {
      log.debug("skipping updating playlist because of same song");
      return;
    }
    this._songs.push(song);
  }

  songs(): Song[] {
    return this._songs;
  }

  getSong(): Song | null {
    if (this._current) {
      return this._songs[this._current];
    }
    return null;
  }

  setCurrent(current: number): void {
    this._current = current;
  }

  index(): number | null {
    return this._current;
  }

  markListened(id: string): void {
    this._songs.map((song) => {
      if (song.id === id) {
        song.listened = true;
        if (song.originId) {
          markListened(song.originId);
        }
      }
      return song;
    });
  }

  getType(): PLAYLIST_TYPE {
    return this._type;
  }
}

export { PLAYLIST_TYPE, Playlist }
