import { useRef, useEffect, useState } from "react";
import { markListened } from "./api";
import { publish, subscribe } from "../../socket";
import { useLoaderData } from "react-router";
import { PlaylistController } from "./PlaylistController";
import { log } from "../../logging";
import VideoDuration from "./VideoDuration";
import { Song } from "./types";
import ProgressBar from "./ProgressBar";
import VideoPopupToggler from "./VideoPopupToggler";

export default function Player({
  playlistController,
}: {
  playlistController: PlaylistController;
}) {
  const { recipientId, conf, widgetId } = useLoaderData();

  const [showPlayButton, setShowPlayButton] = useState(true);
  const [song, setSong] = useState<Song | null>(null);

  function sendAlert(title: string | null, number: number, count: number) {
    // publish(conf.topic.player, {
    //   title: title,
    //   number: number,
    //   count: tab == PLAYLIST_TYPE.REQUESTED ? count : 0,
    // });
  }


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
  );
}
