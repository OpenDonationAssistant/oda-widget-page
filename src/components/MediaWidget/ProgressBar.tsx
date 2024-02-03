import React, { useEffect } from "react";
import { VideoJsPlayer } from "video.js";

export default function ProgressBar({ player }: { player: VideoJsPlayer }) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!player) {
        return;
      }
      let bar = document.getElementById("progressBar");
      if (!bar) {
        return;
      }
      let progress = ((player.currentTime() / player.duration()) * 100).toFixed(
        2,
      );
      bar.style["width"] = `${progress}%`;
    }, 250);
    return () => clearInterval(intervalId);
  }, [player]);

  return (
    <div className="progress">
      <div id="progressBar" className="progress-bar"></div>
    </div>
  );
}
