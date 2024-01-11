import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-youtube";
import { v4 as uuidv4 } from "uuid";
import { publish, subscribe } from "../../socket";
import { useLoaderData } from "react-router";
import { log } from "../../logging";

let options = {
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

export default function PlayerPopup({}) {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const [hideVideo, setHideVideo] = useState(true);
  const [mediaUrl, setMediaUrl] = useState("");
  const { recipientId, conf, widgetId } = useLoaderData();

  useEffect(() => {
    if (!mediaUrl) {
      return;
    }
    createPlayer(mediaUrl);
    setHideVideo(false);
    playerRef?.current?.src({ type: "video/youtube", src: mediaUrl });
  }, [mediaUrl]);

  function createPlayer(url: string) {
    if (playerRef.current) {
      return;
    }
    log.debug("Creating player");

    const videoElement = document.createElement("video-js");
    videoElement.setAttribute("id", "mediaplayer");

    videoElement.classList.add("vjs-big-play-centered");
    videoRef?.current?.appendChild(videoElement);
    options.sources = [{ type: "video/youtube", src: url }];

    playerRef.current = videojs(videoElement, options);
    playerRef.current.uuid = uuidv4();
    playerRef.current.on("ended", () => {
			setHideVideo(true);
			publish("/topic/finishedmedia", {});
    });
    log.debug("Player has been created");
  }

  useEffect(() => {
    subscribe("test", "/topic/media", (message) => {
      let json = JSON.parse(message.body);
      log.debug(`playing ${json.url}`);
      setMediaUrl(json.url);
      message.ack();
    });
  }, [widgetId]);

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
