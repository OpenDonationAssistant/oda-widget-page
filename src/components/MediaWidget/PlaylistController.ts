import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { log } from "../../logging";
import { Song } from "./types";
import { IPlaylistRenderer } from "./IPlaylist";
import { IPlayer } from "./IPlayer";
import { markListened } from "./api";
import { PLAYLIST_TYPE, Playlist } from "../../logic/playlist/Playlist";

export class PlaylistController {
  requested: Playlist = new Playlist(PLAYLIST_TYPE.REQUESTED);
  personal: Playlist = new Playlist(PLAYLIST_TYPE.PERSONAL);
  current: Playlist = this.requested;

  playlistRenderers: IPlaylistRenderer[] = [];
  players: IPlayer[] = [];

  recipientId;

  constructor(recipientId: string) {
    this.recipientId = recipientId;

    log.info(`Loading playlist for ${recipientId}`);

    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/media?recipientId=${recipientId}`,
      )
      .then((response) => {
        let songs = response.data;
        songs = songs.map(
          (element: { url: string; id: string; title: string }) => {
            return {
              src: element.url,
              type: "video/youtube",
              id: uuidv4(),
              originId: element.id,
              owner: "Аноним",
              title: element.title,
              listened: false,
            };
          },
        );
        return fillSongData(recipientId, songs);
      })
      .then((playlist) => {
        playlist.forEach((song) => this.requested.addSong(song));
      });
  }

  clearPlayers() {
    this.players = [];
  }

  addPlayer(player: IPlayer): PlaylistController {
    this.players.push(player);
    return this;
  }

  clearPlaylists() {
    this.playlistRenderers = [];
  }

  addPlaylist(playlist: IPlaylistRenderer): PlaylistController {
    this.playlistRenderers.push(playlist);
    return this;
  }

  switchToPersonal() {
    log.debug("switching to personal");
    this.playlistRenderers.forEach((renderer) =>
      renderer.setPlaylist(this.personal),
    );
  }

  switchToRequested() {
    log.debug("switching to requested");
    this.playlistRenderers.forEach((renderer) =>
      renderer.setPlaylist(this.requested),
    );
  }
}

async function fillSongData(recipientId: string, playlist: Song[]) {
  log.info(`Trying to find songs for ${recipientId}`);
  let response = await axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/payment?recipientId=${recipientId}`,
  );
  let updatedPlaylist = playlist;
  response.data.forEach(
    (item: { attachments: (string | null)[]; senderName: string | null }) =>
      item.attachments.forEach((attach: string | null) => {
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
