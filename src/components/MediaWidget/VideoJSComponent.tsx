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
import { publish, subscribe, unsubscribe } from "../../socket";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
  isRemote,
}: {
  song: Song | null;
  playlistController: PlaylistController;
  isRemote: boolean;
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
    subscribe(widgetId, conf.topic.playerCommands, (message) => {
      log.debug({message: message}, "Received player command");
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
    sendAlert(song.title);
  }, [isRemote, song]);

  function sendAlert(title: string) {
    publish(conf.topic.player, {
      title: title,
    });
  }

  useEffect(() => {
    if (isRemote || song === null) {
      return;
    }
    log.debug(`playing song ${JSON.stringify(song)}`);

    const videoElement = document.createElement("video-js");
    videoElement.setAttribute("id", "mediaplayer");
    videoElement.classList.add("vjs-big-play-centered");
    videoRef.current?.appendChild(videoElement);
    options.sources = song;
    log.debug({options: options}, "creating player with  options");

    const player = videojs(videoElement, options);
    player.src(song);
    player.volume(volume/100);
    player.on("play", () => {
      log.debug("start playing");
      setPlayerState(PLAYER_STATE.PLAYING);
      if (song) {
        sendAlert(song.title);
      }
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
  }, [song, isRemote]);

  useEffect(() => {
    if (player) {
      player.volume(volume/100);
      localStorage.setItem("volume", JSON.stringify(volume));
    }
  },[volume]);

  return (
    <>
      {!isRemote && song && (
        <div
          className="video-player"
          data-vjs-player
          style={hideVideo ? { visibility: "hidden", height: "1px" } : {}}
        >
          <div ref={videoRef} />
        </div>
      )}
      {!isRemote && <ProgressBar player={player} />}
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
                    sendAlert(song?.title ?? "");
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
                    sendAlert("");
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
            {!isRemote && <VideoDuration player={player} />}
          </div>
        </div>
        <Slider value={volume} onChange={(value) => {
          setVolume(value);
        }} />
      </div>
    </>
  );
}
