import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { log } from "../../logging";
import { Song } from "./types";
import { IPlaylist } from "./IPlaylist";
import { IPlayer } from "./IPlayer";
import { markListened } from "./api";
import { PLAYLIST_TYPE, Playlist } from "../../logic/playlist/Playlist";

export class PlaylistController {
  requested: Playlist = new Playlist(PLAYLIST_TYPE.REQUESTED);
  fallback: Playlist = new Playlist(PLAYLIST_TYPE.PERSONAL);
  current: Playlist = this.requested;
  playlistRenderers: IPlaylist[] = [];
  playerRenderers: IPlayer[] = [];

  recipientId;

  constructor(recipientId: string) {
    this.recipientId = recipientId;

    log.info(`Loading playlist for ${recipientId}`);
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
            listened: false,
          };
        });
        return fillSongData(recipientId, songs);
      })
      .then((playlist) => {
        playlist.forEach(song => this.requested.addSong(song));
      });
  }

  clearPlayers() {
    this.playerRenderers = [];
  }

  addPlayer(player: IPlayer): PlaylistController {
    this.playerRenderers.push(player);
    return this;
  }

  clearPlaylists() {
    this.playlistRenderers = [];
  }

  addPlaylist(playlist: IPlaylist): PlaylistController {
    this.playlistRenderers.push(playlist);
    return this;
  }

  previous() {
    if (this.currentIndex() > 0) {
      this.updateIndex(this.currentIndex() - 1);
    }
  }

  next() {
    log.debug("requesting next song");
    if (this.currentSong() && !this.currentSong()?.listened) {
      log.debug(`playing current song: ${JSON.stringify(this.currentSong())}`);
      this.playCurrentSong();
      return;
    }
    const newIndex = this.currentIndex() + 1;
    log.debug(`updating index to ${newIndex}`);
    if (newIndex == this.currentPlaylist().length) {
      return;
    }
    this.updateIndex(newIndex);
  }

  currentIndex(): number {
    return this.currentPlaylistType === PLAYLIST_TYPE.PERSONAL
      ? this.fallbackIndex
      : this.requestedIndex;
  }

  currentPlaylist(): Song[] {
    return this.current.songs();
  }

  async addSong(song: Song) {
    const updated = await fillSongData(this.recipientId, [song]);
    this.current.addSong(updated[0]);
    this.updatePlaylist(this.current.songs());
  }

  addSongs = (event) => {
    this.updatePlaylist(this.currentPlaylist().concat(event.detail));
  };

  markListened(id: string) {
    this.currentPlaylist().map((song) => {
      if (song.id === id) {
        song.listened = true;
        if (song.originId) {
          markListened(song.originId);
        }
      }
      return song;
    });
  }

  handleNewRequestedSongEvent(song: Song) {
    log.debug(`adding song ${JSON.stringify(song)}`);
    if (this.currentPlaylistType === PLAYLIST_TYPE.PERSONAL) {
      log.debug("switch to requested playlist for new song");
      this.switchToRequested();
    }
    this.addSong(song).then(() => {
      this.next();
      log.debug(
        `song ${song.id} added, requested current index: ${this.requestedIndex}`,
      );
    });
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
    this.playlists.forEach((playlist) => playlist.setCurrent(newIndex));
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
    this.playCurrentSong();
  }

  playCurrentSong() {
    const song = this.currentSong();
    if (song) {
      this.players.forEach((player) => player.play(song));
    }
  }

  switchToFallback() {
    log.debug("switching to personal");
    this.currentPlaylistType = PLAYLIST_TYPE.PERSONAL;
    this.playlistChangedFn(PLAYLIST_TYPE.PERSONAL);
    this.playlists.forEach((playlist) => playlist.setPlaylist(this.fallback));
    this.playlists.forEach((playlist) =>
      playlist.setCurrent(this.fallbackIndex),
    );
  }

  switchToRequested() {
    log.debug("switching to requested");
    this.currentPlaylistType = PLAYLIST_TYPE.REQUESTED;
    this.playlistChangedFn(PLAYLIST_TYPE.REQUESTED);
    this.playlists.forEach((playlist) => playlist.setPlaylist(this.requested));
    this.playlists.forEach((playlist) =>
      playlist.setCurrent(this.requestedIndex),
    );
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
