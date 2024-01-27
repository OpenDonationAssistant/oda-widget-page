import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-youtube";
import { markListened } from "./api";
import { v4 as uuidv4 } from "uuid";
import { publish, subscribe } from "../../socket";
import { useLoaderData } from "react-router";
import { PLAYLIST_TYPE, PlaylistController } from "./PlaylistController";
import { log } from "../../logging";
import { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import VideoDuration from "./VideoDuration";
import { Song } from "./types";
import ProgressBar from "./ProgressBar";
import VideoPopupToggler from "./VideoPopupToggler";
import { PlayerState } from "./IPlayer";

let options: VideoJsPlayerOptions = {
  autoplay: false,
  controls: false,
  responsive: false,
  fluid: false,
  width: 500,
  height: 500,
  preload: "none",
  techOrder: ["youtube"],
  youtube: { ytControls: 0, rel: 0 },
};

let pausedByCommand = false;
let pausedManually = false;

export default function Player({
  tab,
  playlistController,
}: {
  tab: PLAYLIST_TYPE;
  playlistController: PlaylistController;
}) {
  const { recipientId, conf, widgetId } = useLoaderData();

  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer>(null);

  const [previousListen, setPreviousListen] = useState(-1);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [song, setSong] = useState<Song | null>(null);
  const [hideVideo, setHideVideo] = useState(true);

  function listenToggleVideoEvent() {
    log.debug("toggle video");
    setHideVideo((value) => !value);
  }

  useEffect(() => {
    let playerAdapter = {
      play: (song: Song) => {
        log.debug(`Playing ${JSON.stringify(song)}`);
        setSong(song);
        if (playerRef.current && song) {
          log.debug(`playing in ${playerRef.current.uuid}`);
          log.debug(playerRef.current.currentSource());
          playerRef.current.src(song);
          playerRef.current.play();
        }
      },
    };
    playlistController.addPlayer(playerAdapter);
  }, [playerRef, playlistController]);

  useEffect(() => {
    document.addEventListener("toggleVideo", listenToggleVideoEvent);
    return () =>
      document.removeEventListener("toggleVideo", listenToggleVideoEvent);
  }, [widgetId]);

  function next() {
    playerRef.current?.currentTime(playerRef.current?.duration());
  }

  function sendAlert(title: string | null, number: number, count: number) {
    publish(conf.topic.player, {
      title: title,
      number: number,
      count: tab == PLAYLIST_TYPE.REQUESTED ? count : 0,
    });
  }

  useEffect(() => {
    if (playerRef.current) {
      return;
    }

    if (!playlistController.currentSong()) {
      return;
    }

    console.log("Creating new player instance");

    const videoElement = document.createElement("video-js");
    videoElement.setAttribute("id", "mediaplayer");

    videoElement.classList.add("vjs-big-play-centered");
    videoRef.current?.appendChild(videoElement);
    options.sources = playlistController.currentSong();

    playerRef.current = videojs(videoElement, options);
    const player = playerRef.current;
    player.src(playlistController.currentSong());
    player.uuid = uuidv4();
    player.volume(0.5);
    player.off("play");
    player.on("play", () => {
      log.debug("start playing");
      setShowPlayButton(false);
      pausedByCommand = false;
      pausedManually = false;
      sendAlert(
        player.currentSource().title,
        playlistController.currentIndex(),
        playlistController.currentPlaylist().length,
      );
    });
    player.off("pause");
    player.on("pause", () => {
      log.debug("pause player");
      pausedManually = false;
      setShowPlayButton(true);
      sendAlert(null, 0, 0);
    });
    player.off("ended");
    player.on("ended", () => {
      log.debug("song ended");
      sendAlert(null, 0, 0);
      setShowPlayButton(true);
      setPreviousListen(playlistController.currentIndex());
      playlistController.markListened(playerRef.current.currentSource().id);
      playlistController.next();
    });
    player.off("error");
    player.on("error", function () {
      console.log(player.error());
      setShowPlayButton(true);
      setPreviousListen(playlistController.currentIndex());
      if (playerRef.current.currentSource().originId) {
        markListened(playerRef.current.currentSource().originId);
      }
      playlistController.next();
      sendAlert(null, 0, 0);
    });
    console.log("created: " + playerRef.current.uuid);
  }, [song, playlistController]);

  useEffect(() => {
    subscribe(widgetId, conf.topic.playerCommands, (message) => {
      if (playerRef.current) {
        console.log("HANDLE COMMAND for " + playerRef.current.uuid);
      } else {
        console.log("HANDLE COMMAND for future player");
      }

      let json = JSON.parse(message.body);
      if (json.command === "pause") {
        console.log("PAUSE BY COMMAND");
        pausedByCommand = true;
        if (playerRef.current) {
          playerRef.current.pause();
        }
      }
      if (
        json.command === "resume" &&
        playerRef.current &&
        (pausedByCommand ||
          (!pausedManually &&
            playerRef.current.ended() &&
            previousListen &&
            previousListen + 1 == playlistController.currentIndex()))
      ) {
        console.log("start playing by command");
        console.log(playerRef.current.src());
        playerRef.current.play();
      }
      if (
        json.command === "resume" &&
        (pausedByCommand ||
          (!pausedManually && playerRef.current && playerRef.current.ended()))
      ) {
        console.log("start playing by command");
        playlistController.next();
      }
      if (json.command === "play") {
        playerRef.current.play();
      }
      if (json.command === "volume") {
        playerRef.current.volume(json.value);
      }
      if (json.command === "next") {
        setPreviousListen(playlistController.currentIndex());
        if (playerRef.current.currentSource().originId) {
          markListened(playerRef.current.currentSource().originId);
        }
        playlistController.next();
        sendAlert(null, 0, 0);
      }
      message.ack();
    });
  }, [recipientId]);

  return (
    <div className="player-container">
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
      <div className="video-controls">
        <div className="video-buttons">
          <button
            className="btn btn-outline-light"
            onClick={() => {
              playlistController.previous();
            }}
          >
            <span className="material-symbols-sharp">skip_previous</span>
          </button>
          {showPlayButton ? (
            <button
              className="btn btn-outline-light"
              disabled={song == null}
              onClick={() => playerRef.current.play()}
            >
              <span className="material-symbols-sharp">play_arrow</span>
            </button>
          ) : (
            <button
              className="btn btn-outline-light"
              disabled={song == null}
              onClick={() => {
                playerRef.current.pause();
                pausedByCommand = true;
              }}
            >
              <span className="material-symbols-sharp">pause</span>
            </button>
          )}
          <button
            className="btn btn-outline-light"
            disabled={!song}
            onClick={() => {
              next();
            }}
          >
            <span className="material-symbols-sharp">skip_next</span>
          </button>
          <VideoDuration player={playerRef.current} />
        </div>
      </div>
    </div>
  );
}
