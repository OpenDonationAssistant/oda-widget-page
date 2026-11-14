import React, { useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { useTranslation } from "react-i18next";

export enum VIDEO_IMPL {
  EMBEDDED,
  REMOTE,
}

export default function VideoPopupToggler({
  state,
  onChange,
}: {
  state: VIDEO_IMPL;
  onChange: Function;
}) {
  const { t } = useTranslation();
  const [videoImpl, setVideoImpl] = useState<VIDEO_IMPL>(state);
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
              onChange();
            }}
          />
          <span className="videoImpl">
            {videoImpl === VIDEO_IMPL.REMOTE
              ? t("media-video-remote")
              : t("media-video-embedded")}
          </span>
        </label>
      </div>
    </>
  );
}
