import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-youtube";
import { markListened } from "./api";
import { v4 as uuidv4 } from "uuid";
import { publish, subscribe } from "../../socket";
import { useLoaderData } from "react-router";
import { PLAYLIST_TYPE } from "./PlaylistController";
import { log } from "../../logging";

let options = {
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

export default function Player({ playlist, tab, current, updateCurrentFn }) {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const currentRef = useRef(null);
  const playlistRef = useRef(null);
  const [previousListen, setPreviousListen] = useState(-1);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [hideVideo, setHideVideo] = useState(true);
  const { recipientId, conf, widgetId } = useLoaderData();

  function previous() {
    if (current > 0) {
      updateCurrentFn(current - 1);
    }
  }

  function next() {
    playerRef.current.currentTime(playerRef.current.duration());
  }

  function sendAlert(title, number, count) {
    publish(conf.topic.player, {
      title: title,
      number: number,
      count: tab == PLAYLIST_TYPE.REQUESTED ? count : 0,
    });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!playerRef.current) {
        return;
      }
      let bar = document.getElementById("progressBar");
      if (!bar) {
        return;
      }
      let progress = (
        (playerRef.current.currentTime() / playerRef.current.duration()) *
        100
      ).toFixed(2);
      bar.style["width"] = `${progress}%`;
    }, 250);
    return () => clearInterval(intervalId);
  }, [playerRef]);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  function listenToggleVideoEvent() {
    log.debug("toggle video");
    setHideVideo((value) => !value);
  }

  useEffect(() => {
    document.addEventListener("toggleVideo", listenToggleVideoEvent);
    return () =>
      document.removeEventListener("toggleVideo", listenToggleVideoEvent);
  }, [recipientId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!playerRef.current) {
        return;
      }
      let duration = document.getElementById("video-duration");
      if (!duration) {
        return;
      }
      let currentSeconds = Math.trunc(playerRef.current.currentTime() % 60);
      if (currentSeconds < 10) {
        currentSeconds = "0" + currentSeconds;
      }
      let durationSeconds = Math.trunc(playerRef.current.duration() % 60);
      if (durationSeconds < 10) {
        durationSeconds = "0" + durationSeconds;
      }
      duration.innerHTML = `${Math.trunc(
        playerRef.current.currentTime() / 60,
      )}:${currentSeconds} / ${Math.trunc(
        playerRef.current.duration() / 60,
      )}:${durationSeconds}`;
    }, 1000);
    return () => clearInterval(intervalId);
  }, [playerRef]);

  useEffect(() => {
    log.debug("Running constructing");
    const intervalId = setInterval(() => {
      if (playerRef.current) {
        return;
      }

      if (!playlist || current < 0 || !playlist[current]) {
        return;
      }

      console.log("CREATING PLAYER");

      const videoElement = document.createElement("video-js");
      videoElement.setAttribute("id", "mediaplayer");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);
      options.sources = playlist[current];

      playerRef.current = videojs(videoElement, options);
      const player = playerRef.current;
      player.src(playlist[current]);
      player.uuid = uuidv4();
      player.volume(0.5);
      player.off("play");
      player.on("play", () => {
        setShowPlayButton(false);
        pausedByCommand = false;
        pausedManually = false;
        sendAlert(player.currentSource().title, current, playlist.length);
      });
      player.off("pause");
      player.on("pause", () => {
        pausedManually = false;
        setShowPlayButton(true);
        sendAlert(null, 0, 0);
      });
      player.off("ended");
      player.on("ended", () => {
        setShowPlayButton(true);
        setPreviousListen(currentRef.current);
        if (playerRef.current.currentSource().originId) {
          markListened(playerRef.current.currentSource().originId);
        }
        log.debug(`updating index to ${current + 1}`);
        updateCurrentFn(current + 1);
        sendAlert(null, 0, 0);
      });
      player.off("error");
      player.on("error", function () {
        console.log("2");
        console.log(player.error());
        setShowPlayButton(true);
        setPreviousListen(currentRef.current);
        if (playerRef.current.currentSource().originId) {
          markListened(playerRef.current.currentSource().originId);
        }
        log.debug(`updating index to ${current + 1}`);
        updateCurrentFn(current + 1);
        sendAlert(null, 0, 0);
      });
      console.log("created: " + playerRef.current.uuid);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [playerRef, videoRef, playlist, current]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }
    if (current >= playlist.length) {
      return;
    }
    if (current === -1) {
      return;
    }
    let player = playerRef.current;
    console.log("set song: " + current);
    console.log(playlist[current]);
    player.src(playlist[current]);
    console.log("pausedByCommand:" + pausedByCommand);
    console.log("pausedManually:" + pausedManually);
    if (!pausedByCommand && !pausedManually) {
      console.log("start playing after changing playlist/current");
      setTimeout(() => player.play(), 500);
    }
  }, [playerRef, playlist, tab, current]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }
    let player = playerRef.current;
    player.off("play");
    player.on("play", () => {
      setShowPlayButton(false);
      pausedByCommand = false;
      pausedManually = false;
      console.log(player.currentSource());
      sendAlert(player.currentSource().title, current, playlist.length);
    });
    player.off("pause");
    player.on("pause", () => {
      console.log("pausing");
      pausedManually = true;
      setShowPlayButton(true);
      sendAlert(null, 0, 0);
    });
    player.off("ended");
    player.on("ended", () => {
      setShowPlayButton(true);
      setPreviousListen(currentRef.current);
      if (playerRef.current.currentSource().originId) {
        markListened(playerRef.current.currentSource().originId);
      }
      log.debug(`updating index to ${current + 1}`);
      updateCurrentFn(current + 1);
      sendAlert(null, 0, 0);
    });
    player.off("error");
    player.on("error", function () {
      console.log("1");
      console.log(player.error());
      pausedManually = false;
      setShowPlayButton(true);
      setPreviousListen(currentRef.current);
      if (playerRef.current.currentSource().originId) {
        markListened(playerRef.current.currentSource().originId);
      }
      log.debug(`updating index to ${current + 1}`);
      updateCurrentFn(current + 1);
      sendAlert(null, 0, 0);
    });
  }, [playerRef, playlist, current]);

  useEffect(() => {
    subscribe(widgetId, conf.topic.playerCommands, (message) => {
      console.log("--------");
      if (playerRef.current) {
        console.log("HANDLE COMMAND for " + playerRef.current.uuid);
      } else {
        console.log("HANDLE COMMAND for future player");
      }
      if (playlistRef.current) {
        console.log("playlist length:" + playlistRef.current.length);
      }
      if (currentRef.current) {
        console.log("current: " + currentRef.current);
      }
      if (playerRef.current) {
        console.log("paused: " + playerRef.current.paused());
        console.log("paused by command: " + pausedByCommand);
        console.log("ended: " + playerRef.current.ended());
      }
      console.log("previousListen: " + previousListen);

      let json = JSON.parse(message.body);
      // todo check if playing
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
            previousListen + 1 == currentRef.current))
      ) {
        console.log("start playing by command");
        playerRef.current.play();
        console.log("Playlist length in player:" + playlistRef.current.length);
      }
      if (json.command === "play") {
        playerRef.current.play();
      }
      if (json.command === "volume") {
        playerRef.current.volume(json.value);
      }
      if (json.command === "next") {
        setPreviousListen(currentRef.current);
        if (playerRef.current.currentSource().originId) {
          markListened(playerRef.current.currentSource().originId);
        }
        updateCurrentFn(current + 1);
        sendAlert(null, 0, 0);
      }
      message.ack();
    });
  }, [recipientId]);

  return (
    <div className="player-container">
      {hideVideo && (
        <>
          <div className="song-title-container">
            {playlist[current] ? playlist[current].title : ""}
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
      <div className="progress">
        <div id="progressBar" className="progress-bar"></div>
      </div>
      <div className="video-controls">
        <div className="video-buttons">
          <button
            className="btn btn-outline-light"
            disabled={current < 1 || !playlist[current]}
            onClick={() => {
              previous();
            }}
          >
            <span className="material-symbols-sharp">skip_previous</span>
          </button>
          {showPlayButton ? (
            <button
              className="btn btn-outline-light"
              disabled={playlist[current] == null}
              onClick={() => playerRef.current.play()}
            >
              <span className="material-symbols-sharp">play_arrow</span>
            </button>
          ) : (
            <button
              className="btn btn-outline-light"
              disabled={playlist[current] == null}
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
            disabled={!playlist[current]}
            onClick={() => {
              next();
            }}
          >
            <span className="material-symbols-sharp">skip_next</span>
          </button>
        </div>
        <div id="video-duration" className="video-duration">
          0.00 / 0.00
        </div>
      </div>
    </div>
  );
}
