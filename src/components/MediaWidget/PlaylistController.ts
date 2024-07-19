import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { log } from "../../logging";
import { Song } from "./types";
import { IPlaylistRenderer } from "./IPlaylist";
import { PLAYLIST_TYPE, Playlist } from "../../logic/playlist/Playlist";
import { subscribe } from "../../socket";

export class PlaylistController {
  playlists = new Map<PLAYLIST_TYPE, Playlist>();
  current: Playlist;
  private _repeat = false;

  playlistRenderers: IPlaylistRenderer[] = [];

  recipientId;

  constructor(recipientId: string, widgetId: string, conf: any) {
    const requested = new Playlist(PLAYLIST_TYPE.REQUESTED, conf.topic.player);
    const personal = new Playlist(PLAYLIST_TYPE.PERSONAL, conf.topic.player);
    const playlistEndListener = {
      id: `playlistController_${widgetId}`,
      trigger: (playlist: Playlist) => {
        log.debug(
          `checking playlist end, total song count: ${
            playlist.songs().length
          }, current index: ${playlist.index()}`,
        );
        if (playlist.index() !== null) {
          return;
        }
        const personalIndex = personal.index();
        if (personalIndex !== null) {
          if (personalIndex < personal.songs().length) {
            this.switchTo(PLAYLIST_TYPE.PERSONAL);
            return;
          }
        }
        if (this._repeat) {
          playlist.setIndex(0);
        }
      },
    };
    requested.addListener(playlistEndListener);
    this.current = requested;
    this.recipientId = recipientId;
    this.playlists.set(PLAYLIST_TYPE.REQUESTED, requested);
    this.playlists.set(PLAYLIST_TYPE.PERSONAL, personal);

    log.info(`Loading playlist for ${recipientId}`);

    axios
      .get(`${process.env.REACT_APP_MEDIA_API_ENDPOINT}/media/video`)
      .then((response) => {
        let songs = response.data;
        songs = songs.map(
          (element: {
            url: string;
            id: string;
            title: string;
            owner: string;
          }) => {
            return {
              src: element.url,
              type: "video/youtube",
              id: uuidv4(),
              originId: element.id,
              owner: element.owner,
              title: element.title,
            };
          },
        );
        return songs;
      })
      .then((playlist: Song[]) => {
        playlist.forEach((song) => this.current.addSong(song));
      });

    subscribe(widgetId, conf.topic.media, (message) => {
      let json = JSON.parse(message.body);
      log.debug({ media: json}, "Received new media");
      let song = {
        src: json.url,
        type: "video/youtube",
        id: uuidv4(),
        originId: json.id,
        owner: json.owner,
        title: json.title,
      };
      const playlist =
        PLAYLIST_TYPE.parse(json.playlist) ?? PLAYLIST_TYPE.REQUESTED;
      this.handleNewRequestedSongEvent(playlist, song);
      message.ack();
    });
    subscribe(
      `${widgetId}_playlistController`,
      conf.topic.remoteplayerfeedback,
      (message) => {
        const feedback = JSON.parse(message.body);
        if (feedback.state === "finished") {
          this.current.markListened(feedback.song.id);
        }
        message.ack();
      },
    );
  }

  handleNewRequestedSongEvent(playlist: PLAYLIST_TYPE, song: Song) {
    log.debug({song: song, playlist: playlist},"Adding song to playlist");
    this.playlists.get(playlist)?.addSong(song);
    if (
      this.current.type() == PLAYLIST_TYPE.PERSONAL &&
      playlist === PLAYLIST_TYPE.REQUESTED
    ) {
      this.switchTo(PLAYLIST_TYPE.REQUESTED);
    }
  }

  previousSong() {
    const index = this.current.index();
    if (index != null && index > 0) {
      this.current.setIndex(index - 1);
    }
  }

  finishSong() {
    const song = this.current.song();
    log.debug(`finishing song: ${JSON.stringify(song)}`);
    if (song?.id) {
      this.current.markListened(song?.id);
    }
  }

  addPlaylistRenderer(renderer: IPlaylistRenderer): PlaylistController {
    this.playlistRenderers.push(renderer);
    renderer.bind(this.current);
    return this;
  }

  switchTo(type: PLAYLIST_TYPE) {
    log.debug(`switching to ${PLAYLIST_TYPE.toString(type)}`);
    const playlist = this.playlists.get(type);
    if (playlist) {
      this.playlistRenderers.forEach((renderer) => {
        renderer.unbind(this.current);
        renderer.bind(playlist);
      });
      this.current = playlist;
    }
  }
  public get repeat() {
    return this._repeat;
  }
  public set repeat(value) {
    this._repeat = value;
  }
}
