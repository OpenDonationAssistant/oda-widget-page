import React, { useEffect } from "react";
import { Player } from "./VideoJSComponent";

export default function VideoDuration({ player }: { player: Player }) {

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!player) {
        return;
      }
      let duration = document.getElementById("video-duration");
      if (!duration) {
        return;
      }
      let currentSeconds = String(Math.trunc(player.currentTime() % 60));
      if (currentSeconds.length < 2) {
        currentSeconds = "0" + currentSeconds;
      }
      let durationSeconds = String(Math.trunc(player.duration() % 60));
      if (durationSeconds.length < 2) {
        durationSeconds = "0" + durationSeconds;
      }
      duration.innerHTML = `${Math.trunc(
        player.currentTime() / 60,
      )}:${currentSeconds} / ${Math.trunc(
        player.duration() / 60,
      )}:${durationSeconds}`;
    }, 1000);
    return () => clearInterval(intervalId);
  }, [player]);
  return (
    <>
      <div id="video-duration" className="video-duration">
        0.00 / 0.00
      </div>
    </>
  );
}
