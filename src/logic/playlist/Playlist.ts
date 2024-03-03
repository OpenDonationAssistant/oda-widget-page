import { markListened } from "../../components/MediaWidget/api";
import { Song } from "../../components/MediaWidget/types";
import { log } from "../../logging";
import { publish } from "../../socket";
import { IPlaylistChangesListener } from "./PlaylistChangesListener";

enum PLAYLIST_TYPE {
  REQUESTED,
  PERSONAL,
}

function nameOf(type: PLAYLIST_TYPE) {
  return type === PLAYLIST_TYPE.PERSONAL ? "personal" : "requested";
}

class Playlist {
  _songs: Song[] = [];
  _index: number | null = null;
  _type: PLAYLIST_TYPE;
  _listeners: IPlaylistChangesListener[] = [];
  topic: string;

  constructor(type: PLAYLIST_TYPE, topic: string) {
    this._type = type;
    this.topic = topic;
  }

  addSong(song: Song) {
    log.debug(`adding song ${song.title}`);
    if (
      this._songs.some(
        (existing) => existing.originId && existing.originId === song.originId,
      )
    ) {
      log.debug("skipping playlist update because of same song");
      return;
    }
    this._songs.push(song);
    if (this._index == null) {
      this._index = this._songs.length - 1;
    }
    this.triggerListeners();
  }

  removeSong(index: number) {
    if (index < 0 || index > this._songs.length) {
      return;
    }
    const originId = this._songs[index].originId;
    if (originId) {
      markListened(originId);
    }
    this._songs.splice(index, 1);
    if (this._songs.length == 0) {
      this._index = null;
    }
    this.triggerListeners();
  }

  moveSong(from: number, to: number) {
    if (from < 0 || from > this._songs.length) {
      return;
    }
    if (to < 0 || to > this._songs.length) {
      return;
    }
    let currentSongId: string | null = null;
    if (this._index != null) {
      currentSongId = this._songs[this._index].id;
    }
    const song = this._songs[from];
    this._songs.splice(from, 1);
    this._songs.splice(to, 0, song);
    if (currentSongId) {
      const newIndex = this._songs.findIndex(
        (song) => song.id === currentSongId,
      );
      this._index = newIndex;
    }
    this.triggerListeners();
  }

  songs(): Song[] {
    return this._songs;
  }

  song(): Song | null {
    if (this._index != null) {
      return this._songs[this._index];
    }
    return null;
  }

  setIndex(current: number): void {
    log.debug(`set playlist index to ${current}`);
    this._index = current;
    this.triggerListeners();
  }

  index(): number | null {
    return this._index;
  }

  markListened(id: string): void {
    this._songs.map((song) => {
      if (song.id === id) {
        if (song.originId) {
          markListened(song.originId);
        }
      }
      return song;
    });
    if (this.song()?.id === id) {
      this.nextSong();
    }
  }

  nextSong() {
    if (this._index != null) {
      this._index = this._index + 1;
      if (this._index >= this._songs.length) {
        this._index = null;
      }
    }
    this.triggerListeners();
  }

  type(): PLAYLIST_TYPE {
    return this._type;
  }

  addListener(listener: IPlaylistChangesListener) {
    this._listeners.push(listener);
    log.debug(
      `adding listener ${listener.id} to playlist ${nameOf(
        this.type(),
      )}, current songs amount: ${this._songs.length}, index: ${
        this.index()
      }, total listeners count: ${this._listeners.length}`,
    );
    listener.trigger(this);
  }

  removeListener(id: string) {
    log.debug(`listeners before removing ${id}: ${JSON.stringify(this._listeners)}`);
    const index = this._listeners.findIndex((listener) => (listener.id === id));
    this._listeners.splice(index, 1);
    log.debug(`listeners after removing ${id}: ${JSON.stringify(this._listeners)}`);
  }

  triggerListeners() {
    publish(this.topic, {
      count: this._index === null ? 0 : this._songs.length,
      number: this._index === null ? 0 : this._index,
    });
    this._listeners.forEach((listener) => {
      listener.trigger(this);
      log.debug(`playlist ${nameOf(this.type())} notifing listener ${listener.id}`);
    });
  }
}

export { PLAYLIST_TYPE, Playlist };
