import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { log } from "../../logging";
import { Song } from "./types";

export enum PLAYLIST_TYPE {
  REQUESTED,
  PERSONAL,
}

export class PlaylistController {
  requested: Song[] = [];
  fallback: Song[] = [];
  requestedIndex = -1;
  fallbackIndex = -1;
  updatePlaylistFn;
  updateIndexFn;
  recipientId;
  currentPlaylist;
  playlistChangedFn: Function;

  constructor(
    recipientId: string,
    updatePlaylistFn: Function,
    updateIndexFn: Function,
    playlistChangedFn: Function,
  ) {
    this.updatePlaylistFn = updatePlaylistFn;
    this.updateIndexFn = updateIndexFn;
    this.recipientId = recipientId;
    this.currentPlaylist = PLAYLIST_TYPE.REQUESTED;
    this.playlistChangedFn = playlistChangedFn;
    log.info("Loading playlist for " + JSON.stringify(recipientId));
    document.removeEventListener("addSongs", this.addSongs);
    document.addEventListener("addSongs", this.addSongs);

    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/media?recipientId=${recipientId}`,
      )
      .then((response) => {
        let songs = response.data;
        songs = songs.map((element) => {
          return {
            src: element.url,
            type: "video/youtube",
            id: uuidv4(),
            originId: element.id,
            owner: "Аноним",
            title: element.title,
          };
        });
        return fillSongData(recipientId, songs);
      })
      .then((playlist) => {
        this.requestedIndex = 0;
        this.updatePlaylist(playlist);
      });
  }

  addSong(song: Song) {
    fillSongData(this.recipientId, [song]).then((updated) => {
      const oldPlaylist =
        this.currentPlaylist === PLAYLIST_TYPE.PERSONAL
          ? this.fallback
          : this.requested;
      if (oldPlaylist.some((existing) => existing.originId === song.originId)) {
        log.debug("skipping updating playlist because of same song");
        return;
      }
      this.updatePlaylist([...oldPlaylist, updated[0]]);
    });
  }

  handleNewRequestedSongEvent(song: Song) {
    log.debug(
      `adding song ${JSON.stringify(song)}, requested current index: ${
        this.requestedIndex
      }`,
    );
    if (this.currentPlaylist === PLAYLIST_TYPE.PERSONAL) {
      log.debug("switch to requested playlist for new song");
      this.switchToRequested();
    }
    this.addSong(song);
    log.debug(
      `song ${song.id} added, requested current index: ${this.requestedIndex}`,
    );
  }

  handleRequestedPlaylistEnd() {
    if (this.fallbackIndex + 1 < this.fallback.length) {
      log.debug("switch to personal because of requested end");
      this.switchToFallback();
      this.updateIndex(this.fallbackIndex + 1);
    }
  }

  addSongs = (event) => {
    const songs: Song[] = event.detail;
    const oldPlaylist =
      this.currentPlaylist === PLAYLIST_TYPE.PERSONAL
        ? this.fallback
        : this.requested;
    this.updatePlaylist(oldPlaylist.concat(songs));
  };

  updatePlaylist(newPlaylist: Song[]) {
    log.debug(`updating playlist, current: ${this.currentPlaylist}`);
    const oldPlaylist =
      this.currentPlaylist === PLAYLIST_TYPE.PERSONAL
        ? this.fallback
        : this.requested;
    const oldIndex =
      this.currentPlaylist === PLAYLIST_TYPE.PERSONAL
        ? this.fallbackIndex
        : this.requestedIndex;
    let song = oldPlaylist[oldIndex];
    log.debug("SEARCHING FOR SONG(" + oldIndex + ") : " + JSON.stringify(song));
    if (song) {
      let index = newPlaylist.findIndex((it) => it.id === song.id);
      log.debug("FOUND INDEX: " + index);
      this.updateIndex(index > -1 ? index : oldIndex);
    }
    if (this.currentPlaylist === PLAYLIST_TYPE.REQUESTED) {
      this.requested = newPlaylist;
    }
    if (this.currentPlaylist === PLAYLIST_TYPE.PERSONAL) {
      this.fallback = newPlaylist;
    }
    this.updatePlaylistFn(newPlaylist);
  }

  updateIndex(newIndex: number) {
    log.debug(
      `updating index for ${newIndex} in playlist ${this.currentPlaylist}, current personal: ${this.fallbackIndex}, current requested: ${this.requestedIndex}`,
    );
    this.updateIndexFn(newIndex);
    if (this.currentPlaylist === PLAYLIST_TYPE.PERSONAL) {
      this.fallbackIndex = newIndex;
    }
    if (this.currentPlaylist === PLAYLIST_TYPE.REQUESTED) {
      this.requestedIndex = newIndex;
      if (this.requestedIndex >= this.requested.length) {
        this.handleRequestedPlaylistEnd();
      }
    }
    log.debug(
      `updated indexes, requested: ${this.requestedIndex}, personal: ${this.fallbackIndex}`,
    );
  }

  switchToFallback() {
    log.debug("switching to personal");
    this.currentPlaylist = PLAYLIST_TYPE.PERSONAL;
    this.playlistChangedFn(PLAYLIST_TYPE.PERSONAL);
    this.updatePlaylistFn(this.fallback);
    this.updateIndexFn(this.fallbackIndex);
  }

  switchToRequested() {
    log.debug("switching to requested");
    this.currentPlaylist = PLAYLIST_TYPE.REQUESTED;
    this.playlistChangedFn(PLAYLIST_TYPE.REQUESTED);
    this.updatePlaylistFn(this.requested);
    this.updateIndexFn(this.requestedIndex);
  }
}

async function fillSongData(recipientId: string, playlist: Song[]) {
  log.info(`Trying to find songs for ${recipientId}`);
  let response = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/payment?recipientId=${recipientId}`,
  );
  let updatedPlaylist = playlist;
  response.data.forEach((item) =>
    item.attachments.forEach((attach) => {
      updatedPlaylist = updatedPlaylist.map((song) => {
        if (song.originId === attach) {
          song.owner = item.senderName ? item.senderName : "Аноним";
          return song;
        } else {
          return song;
        }
      });
    }),
  );
  return updatedPlaylist;
}
