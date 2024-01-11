import React, { useState } from "react";
import Toggle from "react-toggle";
import { log } from "../../logging";
import "react-toggle/style.css";

enum VIDEO_IMPL {
  EMBEDDED,
  REMOTE,
}

export default function VideoPopupToggler({}) {
  const [videoImpl, setVideoImpl] = useState<VIDEO_IMPL>(VIDEO_IMPL.REMOTE);
  return (
    <>
      <div className="videoImplToggler">
        <label>
          <Toggle
            defaultChecked={videoImpl === VIDEO_IMPL.REMOTE}
            onChange={() => {
              if (videoImpl === VIDEO_IMPL.REMOTE) {
                setVideoImpl(VIDEO_IMPL.EMBEDDED);
              }
              if (videoImpl === VIDEO_IMPL.EMBEDDED) {
                setVideoImpl(VIDEO_IMPL.REMOTE);
              }
            }}
          />
          <span className="videoImpl">{videoImpl === VIDEO_IMPL.REMOTE ? "Remote mode" : "Embedded mode"}</span>
        </label>
        </div>
    </>
  );
}
