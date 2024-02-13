import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-youtube";
import { v4 as uuidv4 } from "uuid";
import { publish, subscribe } from "../../socket";
import { useLoaderData } from "react-router";
import { log } from "../../logging";
import { Song } from "../MediaWidget/types";
import { VideoJsPlayer } from "video.js";
import { findSetting } from "../utils";

let options = {
  autoplay: true,
  controls: false,
  responsive: false,
  fluid: false,
  preload: "none",
  techOrder: ["youtube"],
  youtube: { ytControls: 0, rel: 0 },
};

export default function PlayerPopup({}) {
  const playerRef = useRef<VideoJsPlayer>(null);
  const videoRef = useRef(null);
  const [hideVideo, setHideVideo] = useState(false);
  const { recipientId, settings, conf, widgetId } = useLoaderData();
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const audioOnly = findSetting(settings, "audioOnly", false);
    setHideVideo(audioOnly);
  }, [conf]);

  function createPlayer(song: Song) {
    if (playerRef.current) {
      playerRef.current.dispose();
      log.debug(`cancel player creation because of existing instance`);
    }
    log.debug("Creating player");

    const videoElement = document.createElement("video-js");
    videoElement.setAttribute("id", "mediaplayer");

    videoElement.classList.add("vjs-big-play-centered");
    videoRef?.current?.appendChild(videoElement);
    options.sources = [song];

    playerRef.current = videojs(videoElement, options);
    playerRef.current.uuid = uuidv4();
    playerRef.current.on("ended", () => {
      log.debug(`finished playing song`);
      publish(conf.topic.remoteplayerfeedback, {
        state: "finished",
        song: song,
      });
      playerRef.current?.dispose();
      playerRef.current = null;
    });
    log.debug("Player has been created");
  }

  useEffect(() => {
    subscribe(widgetId, conf.topic.remoteplayer, (message) => {
      let json = JSON.parse(message.body);
      log.debug(`playing ${JSON.stringify(json.song)}`);
      if (json.command === "play") {
        setSong(json.song);
      }
      if (json.command === "stop") {
        playerRef.current?.dispose();
        setSong(null);
      }
      if (json.command === "pause") {
        playerRef.current?.pause();
      }
      if (json.command === "resume") {
        playerRef.current?.play();
      }
      message.ack();
    });
  }, [widgetId]);

  useEffect(() => {
    if (!song) {
      return;
    }
    log.debug(`create player for new song`);
    createPlayer(song);
  }, [song]);

  return (
    <div
      className="video-player"
      data-vjs-player
      style={hideVideo ? { visibility: "hidden", height: "1px" } : {}}
    >
      <div ref={videoRef} />
    </div>
  );
}
