import { ChangeEvent, useState } from "react";
import {
  Alert,
  FixedDonationAmountTrigger,
  RangeDonationAmountTrigger,
  UnknownTrigger,
} from "./Alerts";
import { Trans, useTranslation } from "react-i18next";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { Tabs as AntTabs, InputNumber, Select, Slider } from "antd";
import TextPropertyModal from "../../widgetproperties/TextPropertyModal";
import { observer } from "mobx-react-lite";
import { AnimatedFontProperty } from "../../widgetproperties/AnimatedFontProperty";
import { APPEARANCE_ANIMATIONS } from "./PaymentAlertsWidgetSettingsComponent";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { log } from "../../../../logging";
import { toJS } from "mobx";
import { AnimatedFontComponent } from "../../widgetproperties/AnimatedFontComponent";
import BooleanPropertyInput from "../../components/BooleanPropertyInput";

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
  const name = file.name.replace(/[^0-9a-z\.]/gi, "");
  return uploadFile(file, name).then((ignore) => {
    return name;
  });
};

const GeneralTab = observer(({ alert }: { alert: Alert }) => {
  log.debug({ alerts: alert }, "render general tab");
  const [amount, setAmount] = useState<number>(() => {
    if (alert.triggers.at(0)?.type === "fixed-donation-amount") {
      return alert.triggers.at(0).amount;
    }
    if (alert.triggers.at(0)?.type === "at-least-donation-amount") {
      return alert.triggers.at(0).min;
    }
    return 0;
  });
  const updateAmount = (amount: number) => {
    log.debug({ triggers: alert.triggers }, "set amount");
    if (alert.triggers.at(0)?.type === "fixed-donation-amount") {
      alert.triggers.at(0).amount = amount;
    }
    if (alert.triggers.at(0)?.type === "at-least-donation-amount") {
      alert.triggers.at(0).min = amount;
    }
    setAmount(amount);
  };

  return (
    <>
      <div className="settings-item">
        <LabeledContainer displayName="tab-alert-trigger">
          <Select
            value={alert.triggers.at(0)?.type}
            className="full-width"
            onChange={(e) => {
              switch (e) {
                case "fixed-donation-amount":
                  alert.triggers.splice(
                    0,
                    1,
                    new FixedDonationAmountTrigger({ amount: amount }),
                  );
                  break;
                case "at-least-donation-amount":
                  alert.triggers.splice(
                    0,
                    1,
                    new RangeDonationAmountTrigger({ min: amount, max: null }),
                  );
                  break;
                default:
                  alert.triggers.splice(0, 1, new UnknownTrigger());
                  break;
              }
            }}
            options={[
              {
                value: "fixed-donation-amount",
                label: <Trans i18nKey={"Сумма доната равна"} />,
              },
              {
                value: "at-least-donation-amount",
                label: <Trans i18nKey={"Сумма доната больше"} />,
              },
              {
                value: "never",
                label: <Trans i18nKey={"Никогда"} />,
              },
            ]}
          />
        </LabeledContainer>
      </div>
      {alert.triggers.at(0)?.type === "fixed-donation-amount" && (
        <LabeledContainer displayName="">
          <InputNumber
            value={alert.triggers.at(0)?.amount}
            onChange={(newAmount) => {
              if (!newAmount) {
                return;
              }
              updateAmount(newAmount);
            }}
          />
        </LabeledContainer>
      )}
      {alert.triggers.at(0)?.type === "at-least-donation-amount" && (
        <LabeledContainer displayName="">
          <InputNumber
            value={alert.triggers.at(0)?.min}
            onChange={(newAmount) => {
              if (!newAmount) {
                return;
              }
              updateAmount(newAmount);
            }}
          />
        </LabeledContainer>
      )}
    </>
  );
});

const MessageTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <>
      <div className="settings-item">
        <AnimatedFontComponent
          property={
            new AnimatedFontProperty({
              name: "font",
              value: alert.properties.find((prop) => prop.name === "font")
                ?.value,
              label: "widget-alert-message-font-family",
            })
          }
          onChange={(prop) => {
            alert.update("font", prop.value);
          }}
        />
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="alert-message-appearance-label">
          <Select
            value={alert.property("message-appearance")}
            className="full-width"
            onChange={(e) => {
              alert.update("message-appearance", e);
            }}
            options={[...APPEARANCE_ANIMATIONS, "random", "none"].map(
              (option) => {
                return {
                  value: option,
                  label: (
                    <>
                      <Trans i18nKey={option} />
                    </>
                  ),
                };
              },
            )}
          />
        </LabeledContainer>
      </div>
    </>
  );
});

const HeaderTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-title-template">
          <TextPropertyModal title="widget-alert-title-template">
            <TextArea
              className="full-width"
              value={alert.property("nicknameTextTemplate")}
              onChange={(text) =>
                alert.update("nicknameTextTemplate", text.target.value)
              }
            />
          </TextPropertyModal>
        </LabeledContainer>
      </div>
      <div className="settings-item">
        <AnimatedFontComponent
          property={
            new AnimatedFontProperty({
              name: "headerFont",
              value: alert.property("headerFont"),
              label: "widget-alert-title-font-family",
            })
          }
          onChange={(prop) => {
            alert.update("headerFont", prop.value);
          }}
        />
      </div>
    </>
  );
});

const ImageTab = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-image-width">
          <InputNumber
            className="full-width"
            value={alert.property("imageWidth")}
            onChange={(newValue) => {
              alert.update("imageWidth", newValue);
            }}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-image-height">
          <InputNumber
            className="full-width"
            value={alert.property("imageHeight")}
            onChange={(newValue) => {
              alert.update("imageHeight", newValue);
            }}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-image-show-time">
          <InputNumber
            className="full-width"
            value={alert.property("imageShowTime")}
            onChange={(newValue) => {
              alert.update("imageShowTime", newValue);
            }}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="alert-appearance-label">
          <Select
            className="full-width"
            value={alert.property("appearance")}
            options={[...APPEARANCE_ANIMATIONS, "random", "none"].map(
              (option) => {
                return { label: t(option), value: option };
              },
            )}
            onChange={(selected) => {
              alert.update("appearance", selected);
            }}
          />
        </LabeledContainer>
      </div>
      <div className="upload-button-container">
        {!alert.video && !alert.image && (
          <div
            style={{
              marginBottom: "10px",
              marginTop: "10px",
              marginRight: "10px",
            }}
          >
            <label className="oda-btn-default" style={{ marginRight: "10px" }}>
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((name) => {
                    alert.video = name;
                  })
                }
              />
              {t("button-upload-video")}
            </label>
            <label className="oda-btn-default">
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((name) => {
                    alert.image = name;
                  })
                }
              />
              {t("button-upload-image")}
            </label>
          </div>
        )}
        {(alert.video || alert.image) && (
          <div
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginRight: "40px",
            }}
          >
            <label
              className="oda-btn-default"
              onClick={() => {
                alert.image = null;
                alert.video = null;
              }}
            >
              {t("button-delete")}
            </label>
          </div>
        )}
      </div>
    </>
  );
});

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
              {t("button-upload-audio")}
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
      <div className="image-preview-container">
        {alert.image && (
          <img
            className={`payment-alert-image-preview`}
            src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`}
          />
        )}
      </div>
      {alert.video && (
        <video
          className={`payment-alert-image-preview`}
          src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.video}`}
          muted={true}
        />
      )}
      {!alert.image && !alert.video && (
        <div className={`payment-alert-image-preview`}>
          <img className="alert-no-image" src={`/icons/picture.png`} />
        </div>
      )}
      <AntTabs
        type="card"
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
      <div onClick={() => alert.delete()} className="alert-delete-button">
        <span className="material-symbols-sharp">delete</span>
      </div>
    </div>
  );
});
