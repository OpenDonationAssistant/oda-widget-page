import { ChangeEvent } from "react";
import { Alert } from "./Alerts";
import { useTranslation } from "react-i18next";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { Tabs as AntTabs, Flex, Slider } from "antd";
import TextPropertyModal from "../../widgetproperties/TextPropertyModal";
import { observer } from "mobx-react-lite";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { log } from "../../../../logging";
import { toJS } from "mobx";
import BooleanPropertyInput from "../../components/BooleanPropertyInput";
import ImageTab from "./ImageTab";
import GeneralTab from "./GeneralTab";
import classes from "./AlertComponent.module.css";
import { ResizableBox } from "react-resizable";
import { HeaderTab } from "./HeaderTab";
import { MessageTab } from "./MessageTab";

function playAudio(url: string | null) {
  if (!url) {
    return;
  }
  const audio = new Audio(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${url}`,
  );
  audio.play();
}

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

const SoundTab = observer(({ alert }: { alert: Alert }) => {
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
        </>
      )}
      <div className="audio-button-container">
        {!alert.audio && (
          <div style={{ textAlign: "center", width: "100%" }}>
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

const VoiceTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-voice-for-header">
          <BooleanPropertyInput
            prop={{ value: alert.property("enableVoiceForHeader") }}
            onChange={(e) => alert.update("enableVoiceForHeader", e)}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-voice-title-phrase">
          <TextPropertyModal title="widget-alert-voice-title-phrase">
            <TextArea
              className="full-width"
              value={alert.property("voiceTextTemplate")}
              onChange={(text) =>
                alert.update("voiceTextTemplate", text.target.value)
              }
            />
          </TextPropertyModal>
        </LabeledContainer>
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-voice-if-empty">
          <BooleanPropertyInput
            prop={{ value: alert.property("enableVoiceWhenMessageIsEmpty") }}
            onChange={(e) => alert.update("enableVoiceWhenMessageIsEmpty", e)}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-voice-empty-alert-phrase">
          <TextPropertyModal title="widget-alert-voice-empty-alert-phrase">
            <TextArea
              className="full-width"
              value={alert.property("voiceEmptyTextTemplates")}
              onChange={(text) =>
                alert.update("voiceEmptyTextTemplates", text.target.value)
              }
            />
          </TextPropertyModal>
        </LabeledContainer>
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-voice-for-message">
          <BooleanPropertyInput
            prop={{ value: alert.property("enableVoiceForMessage") }}
            onChange={(e) => alert.update("enableVoiceForMessage", e)}
          />
        </LabeledContainer>
      </div>
    </>
  );
});

export const AlertComponent = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  log.debug({ alert: toJS(alert) }, "render alert");

  return (
    <div key={alert.id} className="payment-alerts-previews-item">
      <Flex justify="space-around" className={`${classes.preview}`}>
        <ResizableBox
          width={650}
          height={350}
          className={`${classes.resizable}`}
          axis="both"
          minConstraints={[650, 100]}
        >
          <div style={{ maxWidth: "100%" }}></div>
        </ResizableBox>
      </Flex>
      <AntTabs
        type="card"
        tabPosition="top"
        items={[
          {
            key: "trigger",
            label: t("General"),
            children: [<GeneralTab alert={alert} />],
          },
          {
            key: "image",
            label: t("tab-alert-image"),
            children: [<ImageTab alert={alert} />],
          },
          {
            key: "sound",
            label: t("tab-alert-audio"),
            children: [<SoundTab alert={alert} />],
          },
          {
            key: "header",
            label: t("tab-alert-title"),
            children: [<HeaderTab alert={alert} />],
          },
          {
            key: "message",
            label: t("tab-alert-message"),
            children: [<MessageTab alert={alert} />],
          },
          {
            key: "voice",
            label: t("tab-alert-voice"),
            children: [<VoiceTab alert={alert} />],
          },
        ]}
      />
    </div>
  );
});
//
// {alert.image && (
//   <div className="image-preview-container">
//     <img
//       className={`payment-alert-image-preview`}
//       src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`}
//     />
//   </div>
// )}
// {alert.video && (
//   <video
//     className={`payment-alert-image-preview`}
//     src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.video}`}
//     muted={true}
//   />
// )}
// {!alert.image && !alert.video && (
//   <div className={`payment-alert-image-preview`}>
//     <img className="alert-no-image" src={`/icons/picture.png`} />
//   </div>
// )}
//
