import { Slider } from "antd";
import { useEffect, useState } from "react";
import { Player } from "./VideoJSComponent";

export default function ProgressBar({ player }: { player: Player }) {
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!player) {
        return;
      }
      let progress = (player.currentTime() / player.duration()) * 100;
      setPosition(progress < 99 ? progress : 99);
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
