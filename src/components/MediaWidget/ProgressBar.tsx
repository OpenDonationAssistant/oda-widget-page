import { Slider } from "antd";
import React, { useEffect, useState } from "react";
import { VideoJsPlayer } from "video.js";

export default function ProgressBar({ player }: { player: VideoJsPlayer }) {
  const [position, setPosition] = useState<number>(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!player) {
        return;
      }
      let progress = (player.currentTime() / player.duration()) * 100;
      setPosition(progress);
    }, 250);
    return () => clearInterval(intervalId);
  }, [player]);

  return (
    <Slider
      value={position}
      onChange={(value: number) => {
        setPosition(value);
        player.currentTime(value/100*player.duration());
      }}
    />
  );
}
