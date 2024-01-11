import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { log } from "../../logging";
import { Song } from "./types";
import { IPlaylist } from "./IPlaylist";
import { IPlayer } from "./IPlayer";

export enum PLAYLIST_TYPE {
  REQUESTED,
  PERSONAL,
}

export class PlaylistController {
  requested: Song[] = [];
  fallback: Song[] = [];
  requestedIndex = -1;
  fallbackIndex = -1;

  recipientId;
  currentPlaylistType = PLAYLIST_TYPE.REQUESTED;
  playlistChangedFn: Function;
  playlists: IPlaylist[] = [];
  players: IPlayer[] = [];

  constructor(recipientId: string, playlistChangedFn: Function) {
    this.recipientId = recipientId;
    this.playlistChangedFn = playlistChangedFn;

    log.info(`Loading playlist for ${JSON.stringify(recipientId)}`);
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

  clearPlayers(){
    this.players = [];
  }

  addPlayer(player: IPlayer): PlaylistController {
    this.players.push(player);
    return this;
  }

  clearPlaylists(){
    this.playlists = [];
  }

  addPlaylist(playlist: IPlaylist): PlaylistController {
    this.playlists.push(playlist);
    return this;
  }

  previous() {
    if (this.currentIndex() > 0) {
      this.updateIndex(this.currentIndex() - 1);
    }
  }

  next() {
    log.debug(`updating index to ${this.currentIndex() + 1}`);
    if (this.currentIndex() == this.currentPlaylist().length) {
      return;
    }
    this.updateIndex(this.currentIndex() + 1);
  }

  currentIndex(): number {
    return this.currentPlaylistType === PLAYLIST_TYPE.PERSONAL
      ? this.fallbackIndex
      : this.requestedIndex;
  }

  currentPlaylist(): Song[] {
    return this.currentPlaylistType === PLAYLIST_TYPE.PERSONAL
      ? this.fallback
      : this.requested;
  }

  currentSong(): Song | null {
    return this.currentPlaylist()[this.currentIndex()];
  }

  addSong(song: Song) {
    fillSongData(this.recipientId, [song]).then((updated) => {
      const oldPlaylist = this.currentPlaylist();
      if (oldPlaylist.some((existing) => existing.originId === song.originId)) {
        log.debug("skipping updating playlist because of same song");
        return;
      }
      this.updatePlaylist([...oldPlaylist, updated[0]]);
    });
  }

  addSongs = (event) => {
    this.updatePlaylist(this.currentPlaylist().concat(event.detail));
  };

  handleNewRequestedSongEvent(song: Song) {
    log.debug(
      `adding song ${JSON.stringify(song)}, requested current index: ${
        this.requestedIndex
      }`,
    );
    if (this.currentPlaylistType === PLAYLIST_TYPE.PERSONAL) {
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

  updatePlaylist(newPlaylist: Song[]) {
    log.debug(
      `updating playlist, current: ${
        this.currentPlaylistType === PLAYLIST_TYPE.REQUESTED
          ? "requested"
          : "personal"
      }`,
    );
    // const oldIndex = this.currentIndex(); //-1
    // let song = this.currentSong(); //undefined

    // todo возможно стоит это выпилить
    // log.debug(`SEARCHING FOR SONG(${oldIndex}) : ${JSON.stringify(song)}`);
    // if (song) {
    //   let index = newPlaylist.findIndex((it) => it.id === song.id);
    //   log.debug(`FOUND INDEX: ${index}`);
    //   this.updateIndex(index > -1 ? index : oldIndex);
    // }

    if (this.currentPlaylistType === PLAYLIST_TYPE.REQUESTED) {
      this.requested = newPlaylist;
    }
    if (this.currentPlaylistType === PLAYLIST_TYPE.PERSONAL) {
      this.fallback = newPlaylist;
    }
    this.playlists.forEach((playlist) => playlist.setPlaylist(newPlaylist));
  }

  updateIndex(newIndex: number) {
    log.debug(
      `updating index for ${newIndex} in playlist ${
        this.currentPlaylistType === PLAYLIST_TYPE.REQUESTED
          ? "requested"
          : "personal"
      }, current personal: ${this.fallbackIndex}, current requested: ${
        this.requestedIndex
      }`,
    );
    this.playlists.forEach(playlist => playlist.setCurrent(newIndex));
    if (this.currentPlaylistType === PLAYLIST_TYPE.PERSONAL) {
      this.fallbackIndex = newIndex;
    }
    if (this.currentPlaylistType === PLAYLIST_TYPE.REQUESTED) {
      this.requestedIndex = newIndex;
      // todo порефачить вложенные if
      if (this.requestedIndex >= this.requested.length) {
        this.handleRequestedPlaylistEnd();
      }
    }
    log.debug(
      `updated indexes, requested: ${this.requestedIndex}, personal: ${this.fallbackIndex}`,
    );
    const song = this.currentSong();
    if (song) {
      this.players.forEach(player => player.play(song));
    }
  }

  switchToFallback() {
    log.debug("switching to personal");
    this.currentPlaylistType = PLAYLIST_TYPE.PERSONAL;
    this.playlistChangedFn(PLAYLIST_TYPE.PERSONAL);
    this.playlists.forEach(playlist => playlist.setPlaylist(this.fallback));
    this.playlists.forEach(playlist => playlist.setCurrent(this.fallbackIndex));
  }

  switchToRequested() {
    log.debug("switching to requested");
    this.currentPlaylistType = PLAYLIST_TYPE.REQUESTED;
    this.playlistChangedFn(PLAYLIST_TYPE.REQUESTED);
    this.playlists.forEach(playlist => playlist.setPlaylist(this.requested));
    this.playlists.forEach(playlist => playlist.setCurrent(this.requestedIndex));
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
