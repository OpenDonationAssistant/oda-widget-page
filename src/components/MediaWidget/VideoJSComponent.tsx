import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "videojs-youtube";
import { Provider, Song } from "./types";
import { VideoJsPlayer } from "video.js";
import { VideoJsPlayerOptions } from "video.js";
import { log } from "../../logging";
import { useLoaderData } from "react-router";
import ProgressBar from "./ProgressBar";
import VideoDuration from "./VideoDuration";
import { PlaylistController } from "./PlaylistController";
import { publish, subscribe, unsubscribe } from "../../socket";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { WidgetData } from "../../types/WidgetData";
import "https://widgets.oda.digital/videplayer.js";

let options: VideoJsPlayerOptions = {
  autoplay: true,
  controls: false,
  responsive: false,
  fluid: false,
  width: 500,
  height: 500,
  preload: "none",
  techOrder: ["youtube"],
  youtube: { ytControls: 0, rel: 0 },
};

enum PLAYER_STATE {
  PLAYING,
  PAUSED,
}

interface Player {
  play(): void;
  pause(): void;
  paused(): boolean;
  volume(value: number): void;
}

export default function VideoJSComponent({
  song,
  playlistController,
  isRemote,
}: {
  song: Song | null;
  playlistController: PlaylistController;
  isRemote: boolean;
}) {
  const { conf, widgetId } = useLoaderData() as WidgetData;
  const videoRef = useRef<HTMLDivElement>(null);
  const vkRef = useRef<HTMLDivElement>(null);
  const [hideVideo, setHideVideo] = useState(true);
  const [playerState, setPlayerState] = useState<PLAYER_STATE>(
    PLAYER_STATE.PAUSED,
  );
  const pausedByCommand = useRef<boolean>(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const commandHandler = useRef<Function | null>(null);
  const [volume, setVolume] = useState<number>(() => {
    const vol = localStorage.getItem("volume");
    if (vol) {
      return JSON.parse(vol);
    }
    return 50;
  });

  function freeze() {
    log.debug(`freezing player`);
    if (player && !player.paused()) {
      pausedByCommand.current = true;
      player.pause();
    }
  }

  function unfreeze() {
    log.debug(`unfreezing player`);
    if (!player) {
      log.debug(`cancel unfreeze because of missing player`);
      return;
    }
    if (pausedByCommand.current) {
      pausedByCommand.current = false;
      log.debug(`calling player.play()`);
      player.play();
    }
  }

  function listenToggleVideoEvent() {
    log.debug(`toggle video`);
    setHideVideo((value) => !value);
  }

  const vkplayer = (song: Song) => {
    log.debug({ song: song }, "creating vk  player for song");
    const videoElement = document.createElement("iframe");
    videoElement.setAttribute(
      "src",
      `https://vk.com/video_ext.php?oid=${song.originId?.replace(
        "_",
        "&id=",
      )}&hd=2&autoplay=1&js_api=1`,
    );
    videoElement.setAttribute(
      "allow",
      "autoplay;  encrypted-media; picture-in-picture",
    );
    vkRef.current?.appendChild(videoElement);
    const player = VK.VideoPlayer(videoElement);
    player.on("started", () => {
      log.debug("start playing");
      setPlayerState(PLAYER_STATE.PLAYING);
      if (song) {
        sendAlert(song);
      }
    });
    player.on("resumed", () => {
      log.debug("start playing");
      setPlayerState(PLAYER_STATE.PLAYING);
      if (song) {
        sendAlert(song);
      }
    });
    player.on("paused", () => {
      log.debug("pause player");
      setPlayerState(PLAYER_STATE.PAUSED);
      sendAlert();
    });
    player.on("ended", () => {
      log.debug("song ended");
      playlistController.finishSong();
      sendAlert();
    });
    player.on("error", function () {
      log.error(player.error());
      playlistController.finishSong();
      sendAlert();
    });
    log.debug({ vkPlayer: player });
    const playerAdapter = {
      play: player.play,
      pause: player.pause,
      paused: () => player.getState() !== "playing",
      volume: (value: number) => {
        player.setVolume(value);
      },
    };
    setPlayer(playerAdapter);
    return () => {
      videoElement.remove();
    };
  };

  useEffect(() => {
    document.addEventListener("toggleVideo", listenToggleVideoEvent);
    return () =>
      document.removeEventListener("toggleVideo", listenToggleVideoEvent);
  }, [widgetId]);

  useEffect(() => {
    commandHandler.current = (message) => {
      let json = JSON.parse(message.body);
      if (player === null) {
        message.ack();
        return;
      }
      if (json.command === "pause") {
        freeze();
      }
      if (json.command === "resume") {
        unfreeze();
      }
      if (json.command === "play") {
        player.play();
      }
      if (json.command === "volume") {
        player.volume(json.value);
      }
      if (json.command === "next") {
        playlistController.finishSong();
      }
      if (json.command === "state") {
        if (song) {
          if (playerState === PLAYER_STATE.PLAYING){
            sendAlert(song);
            playlistController.publishState();
          }
        }
      }
      message.ack();
    };
  }, [player]);

  useEffect(() => {
    subscribe(widgetId, conf.topic.playerCommands, (message) => {
      log.debug({ message: message }, "Received player command");
      if (commandHandler.current) {
        commandHandler.current(message);
      }
    });
    return () => unsubscribe(widgetId, conf.topic.playerCommands);
  }, [widgetId]);

  useEffect(() => {
    if (!isRemote || song === null) {
      return;
    }
    log.debug(`sending song ${JSON.stringify(song)} to remote player`);
    publish(conf.topic.remoteplayer, { command: "play", song: song });
    setPlayerState(PLAYER_STATE.PLAYING);
    sendAlert(song);
  }, [isRemote, song]);

  function sendAlert(song?: Song) {
    publish(conf.topic.player, {
      title: song?.title ?? "",
      owner: song?.owner ?? "",
    });
  }

  useEffect(() => {
    if (isRemote || song === null) {
      return;
    }
    log.debug(`playing song ${JSON.stringify(song)}`);

    if (song.provider === Provider.VK) {
      return vkplayer(song);
    }

    const videoElement = document.createElement("video-js");
    videoElement.setAttribute("id", "mediaplayer");
    videoElement.classList.add("vjs-big-play-centered");
    videoRef.current?.appendChild(videoElement);
    options.sources = song;
    log.debug({ options: options }, "creating player with  options");

    const player = videojs(videoElement, options);
    player.src(song);
    player.volume(volume / 100);
    player.on("play", () => {
      log.debug("start playing");
      setPlayerState(PLAYER_STATE.PLAYING);
      if (song) {
        sendAlert(song);
      }
    });
    player.on("pause", () => {
      log.debug("pause player");
      setPlayerState(PLAYER_STATE.PAUSED);
      sendAlert();
    });
    player.on("ended", () => {
      log.debug("song ended");
      playlistController.finishSong();
      sendAlert();
    });
    player.on("error", function () {
      log.error(player.error());
      playlistController.finishSong();
      sendAlert();
    });
    setPlayer(player);
    return () => {
      player.dispose();
    };
  }, [song, isRemote]);

  useEffect(() => {
    if (player) {
      player.volume(volume / 100);
      localStorage.setItem("volume", JSON.stringify(volume));
    }
  }, [volume]);

  return (
    <>
      <div ref={vkRef} />
      {!isRemote && song && (
        <div
          className="video-player"
          data-vjs-player
          style={hideVideo ? { visibility: "hidden", height: "1px" } : {}}
        >
          <div ref={videoRef} />
        </div>
      )}
      {!isRemote && song?.provider === Provider.YOUTUBE && (
        <ProgressBar player={player} />
      )}
      <div className="player-container">
        <div className="video-controls">
          <div className="video-buttons">
            <button
              className="btn btn-outline-light"
              onClick={() => {
                playlistController.previousSong();
              }}
            >
              <span className="material-symbols-sharp">skip_previous</span>
            </button>
            {playerState == PLAYER_STATE.PAUSED && (
              <button
                className="btn btn-outline-light"
                disabled={song == null}
                onClick={() => {
                  if (isRemote) {
                    publish(conf.topic.remoteplayer, {
                      command: "resume",
                    });
                    sendAlert(song ?? undefined);
                    setPlayerState(PLAYER_STATE.PLAYING);
                  }
                  if (!isRemote) {
                    player.play();
                  }
                }}
              >
                <span className="material-symbols-sharp">play_arrow</span>
              </button>
            )}
            {playerState == PLAYER_STATE.PLAYING && (
              <button
                className="btn btn-outline-light"
                disabled={song == null}
                onClick={() => {
                  if (isRemote) {
                    publish(conf.topic.remoteplayer, {
                      command: "pause",
                    });
                    sendAlert();
                    setPlayerState(PLAYER_STATE.PAUSED);
                  }
                  if (!isRemote) {
                    player.pause();
                  }
                }}
              >
                <span className="material-symbols-sharp">pause</span>
              </button>
            )}
            <button
              className="btn btn-outline-light"
              disabled={!song}
              onClick={() => {
                playlistController.finishSong();
              }}
            >
              <span className="material-symbols-sharp">skip_next</span>
            </button>
            {!isRemote && song?.provider === Provider.YOUTUBE && (
              <VideoDuration player={player} />
            )}
          </div>
        </div>
        <Slider
          value={volume}
          onChange={(value) => {
            setVolume(value);
          }}
        />
      </div>
    </>
  );
}
