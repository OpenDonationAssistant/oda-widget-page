import React, { useEffect, useState } from "react";
import { log } from "../../logging";
import { Song } from "./types";

export default function VideoContainer({
  widgetId,
  song,
}: {
  widgetId: string;
  song: Song;
}) {
  const [hideVideo, setHideVideo] = useState(true);

  function listenToggleVideoEvent() {
    log.debug("toggle video");
    setHideVideo((value) => !value);
  }

  useEffect(() => {
    document.addEventListener("toggleVideo", listenToggleVideoEvent);
    return () =>
      document.removeEventListener("toggleVideo", listenToggleVideoEvent);
  }, [widgetId]);

  return (
    <>
      {hideVideo && (
        <>
          <div className="song-title-container">{song.title}</div>
        </>
      )}
    </>
  );
}
