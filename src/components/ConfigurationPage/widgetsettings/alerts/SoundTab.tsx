import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import Slider from "rc-slider";
import axios from "axios";
import { ChangeEvent } from "react";
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

function playAudio(url: string | null) {
  if (!url) {
    return;
  }
  const audio = new Audio(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${url}`,
  );
  audio.play();
}


export const SoundTab = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  return (
    <div className="sound-container">
      {alert.audio && (
        <>
          <div className="settings-item">
            <LabeledContainer displayName="Файл">
              <div className="current-sound">
                <span className="audio-name">{alert.audio}</span>
                <span
                  onClick={() => playAudio(alert.audio)}
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
          <div style={{ textAlign: "center", width: "100%", paddingBottom: "10px" }}>
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
