import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { log } from "../../logging";
import { Song } from "./types";
import { IPlaylistRenderer } from "./IPlaylist";
import { IPlayer } from "./IPlayer";
import { PLAYLIST_TYPE, Playlist } from "../../logic/playlist/Playlist";
import { subscribe } from "../../socket";

export class PlaylistController {
  playlists = new Map<PLAYLIST_TYPE, Playlist>();
  current: Playlist;

  playlistRenderers: IPlaylistRenderer[] = [];
  players: IPlayer[] = [];

  recipientId;

  constructor(recipientId: string, widgetId: string, conf: any) {
    this.recipientId = recipientId;
    const requested = new Playlist(PLAYLIST_TYPE.REQUESTED);
    this.current = requested;
    this.playlists.set(PLAYLIST_TYPE.REQUESTED, requested);
    this.playlists.set(
      PLAYLIST_TYPE.PERSONAL,
      new Playlist(PLAYLIST_TYPE.PERSONAL),
    );

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
        playlist.forEach((song) => this.current.addSong(song));
      });

    subscribe(widgetId, conf.topic.media, (message) => {
      let json = JSON.parse(message.body);
      let song = {
        src: json.url,
        type: "video/youtube",
        id: uuidv4(),
        originId: json.id,
        owner: "Аноним",
        title: json.title,
        listened: false,
      };
      this.handleNewRequestedSongEvent(song);
      message.ack();
    });
  }

  handleNewRequestedSongEvent(song:Song){
    this.playlists.get(PLAYLIST_TYPE.REQUESTED)?.addSong(song);
    if (this.current.getType() == PLAYLIST_TYPE.PERSONAL) {
      this.switchTo(PLAYLIST_TYPE.REQUESTED);
    }
  }

  addPlayer(player: IPlayer): PlaylistController {
    this.players.push(player);
    return this;
  }

  addPlaylistRenderer(playlist: IPlaylistRenderer): PlaylistController {
    this.playlistRenderers.push(playlist);
    playlist.bindPlaylist(this.current);
    return this;
  }

  switchTo(type: PLAYLIST_TYPE) {
    log.debug(`switching to ${type}`);
    const playlist = this.playlists.get(type);
    if (playlist) {
      this.playlistRenderers.forEach((renderer) => {
        renderer.unbind();
        renderer.bindPlaylist(playlist);
      });
    }
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
