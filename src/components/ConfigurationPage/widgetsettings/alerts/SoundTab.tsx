import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import Slider from "rc-slider";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Flex } from "antd";
import { Alert } from "./Alerts";
import { NumberProperty } from "../../widgetproperties/NumberProperty";

function uploadFile(file: File, name: string) {
  return axios.put(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`,
    { file: file },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) {
    return Promise.reject();
  }
  const file = e.target.files[0];
  const name = encodeURIComponent(file.name);
  return uploadFile(file, name).then((ignore) => {
    return name;
  });
};

const audioCtx = new AudioContext();

function loadAudio(name: string): Promise<ArrayBuffer | void> {
  if (!name) {
    return Promise.resolve();
  }
  let url = name;
  if (!name.startsWith("http")) {
    url = `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`;
  }
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    },
  }).then((response) => response.arrayBuffer());
}

function play(buffer: ArrayBuffer | null) {
  if (!buffer) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    audioCtx.decodeAudioData(
      buffer,
      (buf) => {
        const gainNode = audioCtx.createGain();
        gainNode.connect(audioCtx.destination);

        let source = audioCtx.createBufferSource();
        source.connect(gainNode);
        source.buffer = buf;
        source.loop = false;
        source.start(0);
        source.addEventListener("ended", () => {
          resolve();
        });
      },
      (err) => {
        console.log(err);
      },
    );
  });
}

export const SoundTab = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    if (alert.audio) {
      loadAudio(alert.audio).then((buffer) => setBuffer(buffer));
    }
  }, [alert.audio]);

  return (
    <div className="sound-container">
      {alert.audio && (
        <>
          <div className="settings-item">
            <LabeledContainer displayName="Файл">
              <div className="current-sound">
                <span className="audio-name">
                  {alert.audio.replace("https://api.oda.digital/assets/", "")}
                </span>
                <span
                  onClick={() => play(structuredClone(buffer))}
                  className="material-symbols-sharp"
                >
                  play_circle
                </span>
                <span
                  onClick={() => {
                    alert.audio = null;
                  }}
                  className="material-symbols-sharp"
                >
                  delete
                </span>
              </div>
            </LabeledContainer>
          </div>
          <div className="settings-item full-width">
            <LabeledContainer displayName="Громкость">
              <Slider
                min={1}
                max={100}
                defaultValue={100}
                value={alert.property("audio-volume")}
                onChange={(value) => alert.update("audio-volume", value)}
              />
            </LabeledContainer>
          </div>
          <div className="settings-item">
            {(alert.get("audioDelay") as NumberProperty).markup()}
          </div>
        </>
      )}
      <div className="audio-button-container">
        {!alert.audio && (
          <div
            style={{
              textAlign: "center",
              width: "100%",
              paddingBottom: "10px",
            }}
          >
            <label className="oda-btn-default">
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((name) => (alert.audio = name))
                }
              />
              <Flex justify="center" align="center" gap={3}>
                <span className="material-symbols-sharp">upload</span>
                <div>{t("button-upload-audio")}</div>
              </Flex>
            </label>
          </div>
        )}
      </div>
    </div>
  );
});
