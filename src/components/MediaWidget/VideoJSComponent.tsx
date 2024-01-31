import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import videojs from "video.js";
import "videojs-youtube";
import { Song } from "./types";
import { VideoJsPlayer } from "video.js";
import { VideoJsPlayerOptions } from "video.js";
import { log } from "../../logging";
import { useLoaderData } from "react-router";
import VideoPopupToggler from "./VideoPopupToggler";
import ProgressBar from "./ProgressBar";
import VideoDuration from "./VideoDuration";
import { PlaylistController } from "./PlaylistController";

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
  const { widgetId } = useLoaderData();
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer>(null);
  const [hideVideo, setHideVideo] = useState(false);
  const [playerState, setPlayerState] = useState<PLAYER_STATE>(
    PLAYER_STATE.PAUSED,
  );

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
    log.debug("Creating new player instance");
    log.debug(`playing song ${JSON.stringify(song)}`);

    const videoElement = document.createElement("video-js");
    videoElement.setAttribute("id", "mediaplayer");
    videoElement.classList.add("vjs-big-play-centered");
    videoRef.current?.appendChild(videoElement);
    options.sources = song;

    playerRef.current = videojs(videoElement, options);
    const player = playerRef.current;
    player.src(song);
    player.uuid = uuidv4();
    player.volume(0.5);
    player.on("play", () => {
      log.debug("start playing");
      setPlayerState(PLAYER_STATE.PLAYING);
    });
    player.on("pause", () => {
      log.debug("pause player");
      setPlayerState(PLAYER_STATE.PAUSED);
    });
    player.on("ended", () => {
      log.debug("song ended");
      playlistController.finishSong();
    });
    player.on("error", function () {
      log.error(player.error());
      playlistController.finishSong();
    });
    log.debug(`created: ${playerRef.current.uuid}`);
    return () => {
      playerRef.current.dispose();
    };
  }, [song]);

  return (
    <>
      {hideVideo && (
        <>
          <div className="player-header">
            <div className="song-title-container">{song?.title}</div>
            <VideoPopupToggler />
          </div>
        </>
      )}
      <div
        className="video-player"
        data-vjs-player
        style={hideVideo ? { visibility: "hidden", height: "1px" } : {}}
      >
        <div ref={videoRef} />
      </div>
      <ProgressBar player={playerRef.current} />
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
                onClick={() => playerRef.current.play()}
              >
                <span className="material-symbols-sharp">play_arrow</span>
              </button>
            )}
            {playerState == PLAYER_STATE.PLAYING && (
              <button
                className="btn btn-outline-light"
                disabled={song == null}
                onClick={() => {
                  playerRef.current.pause();
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
            <VideoDuration player={playerRef.current} />
          </div>
        </div>
      </div>
    </>
  );
}
