import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "videojs-youtube";
import { Song } from "./types";
import { VideoJsPlayer } from "video.js";
import { VideoJsPlayerOptions } from "video.js";
import { log } from "../../logging";
import { useLoaderData } from "react-router";
import ProgressBar from "./ProgressBar";
import VideoDuration from "./VideoDuration";
import { PlaylistController } from "./PlaylistController";
import { publish, subscribe } from "../../socket";

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

export default function VideoJSComponent({
  song,
  playlistController,
}: {
  song: Song;
  playlistController: PlaylistController;
}) {
  const { conf, widgetId } = useLoaderData();
  const videoRef = useRef<HTMLDivElement>(null);
  const [hideVideo, setHideVideo] = useState(true);
  const [playerState, setPlayerState] = useState<PLAYER_STATE>(
    PLAYER_STATE.PAUSED,
  );
  const pausedByCommand = useRef<boolean>(false);
  const [player, setPlayer] = useState<VideoJsPlayer | null>(null);
  const commandHandler = useRef<Function | null>(null);

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
      return;
    }
    if (pausedByCommand.current) {
      pausedByCommand.current = false;
      player.play();
    }
  }

  function listenToggleVideoEvent() {
    log.debug(`toggle video`);
    setHideVideo((value) => !value);
  }

  useEffect(() => {
    document.addEventListener("toggleVideo", listenToggleVideoEvent);
    return () =>
      document.removeEventListener("toggleVideo", listenToggleVideoEvent);
  }, [widgetId]);

  useEffect(() => {
    commandHandler.current = (message) => {
      let json = JSON.parse(message.body);
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
      message.ack();
    };
  }, [player]);

  useEffect(() => {
    subscribe(
      widgetId,
      conf.topic.playerCommands,
      (message) => {
        log.debug(`message: ${JSON.stringify(message)}`);
        if (commandHandler.current){
          commandHandler.current(message);
        }
      }
    );
  }, [widgetId]);

  function sendAlert(title: string) {
    publish(conf.topic.player, {
      title: title,
    });
  }

  useEffect(() => {
    log.debug("Creating new player instance");
    log.debug(`playing song ${JSON.stringify(song)}`);

    const videoElement = document.createElement("video-js");
    videoElement.setAttribute("id", "mediaplayer");
    videoElement.classList.add("vjs-big-play-centered");
    videoRef.current?.appendChild(videoElement);
    options.sources = song;

    const player = videojs(videoElement, options);
    player.src(song);
    player.volume(0.5);
    player.on("play", () => {
      log.debug("start playing");
      setPlayerState(PLAYER_STATE.PLAYING);
      sendAlert(song.title);
    });
    player.on("pause", () => {
      log.debug("pause player");
      setPlayerState(PLAYER_STATE.PAUSED);
      sendAlert("");
    });
    player.on("ended", () => {
      log.debug("song ended");
      playlistController.finishSong();
      sendAlert("");
    });
    player.on("error", function () {
      log.error(player.error());
      playlistController.finishSong();
      sendAlert("");
    });
    setPlayer(player);
    return () => {
      player.dispose();
    };
  }, [song]);

  return (
    <>
      <div
        className="video-player"
        data-vjs-player
        style={hideVideo ? { visibility: "hidden", height: "1px" } : {}}
      >
        <div ref={videoRef} />
      </div>
      <ProgressBar player={player} />
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
                onClick={() => player.play()}
              >
                <span className="material-symbols-sharp">play_arrow</span>
              </button>
            )}
            {playerState == PLAYER_STATE.PLAYING && (
              <button
                className="btn btn-outline-light"
                disabled={song == null}
                onClick={() => {
                  player.pause();
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
            <VideoDuration player={player} />
          </div>
        </div>
      </div>
    </>
  );
}