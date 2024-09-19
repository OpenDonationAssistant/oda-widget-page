import React, { ChangeEvent, useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import axios from "axios";
import ColorPicker from "./ColorPicker";
import BaseSettings from "./BaseSettings";
import BooleanPropertyInput from "./properties/BooleanPropertyInput";
import {
  Tabs as AntTabs,
  Flex,
  Input,
  InputNumber,
  Segmented,
  Select,
  Slider,
} from "antd";
import TextPropertyModal from "../widgetproperties/TextPropertyModal";
import { useTranslation } from "react-i18next";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import AnimatedFontComponent from "../widgetproperties/AnimatedFontComponent";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { DEFAULT_ALERT } from "../widgetsettings/PaymentAlertsWidgetSettings";

interface PaymentAlertSettingsProps {
  id: string;
  onChange: Function;
}

export const APPEARANCE_ANIMATIONS = [
  "bounce",
  "flash",
  "pulse",
  "rubberBand",
  "shakeY",
  "shakeX",
  "headShake",
  "swing",
  "tada",
  "wobble",
  "jello",
  "heartBeat",
  "backInDown",
  "backInLeft",
  "backInRight",
  "backInUp",
  "bounceIn",
  "bounceInDown",
  "bounceInLeft",
  "bounceInRight",
  "bounceInUp",
  "fadeIn",
  "fadeInDown",
  "fadeInDownBig",
  "fadeInLeft",
  "fadeInLeftBig",
  "fadeInRight",
  "fadeInRightBig",
  "fadeInUp",
  "fadeInUpBig",
  "fadeInTopLeft",
  "fadeInTopRight",
  "fadeInBottomLeft",
  "fadeInBottomRight",
  "flip",
  "flinInX",
  "flipInY",
  "lightSpeedInRight",
  "lightSpeedInLeft",
  "rotateIn",
  "rotateInDownLeft",
  "rotateInDownRight",
  "rotateInUpLeft",
  "rotateInUpRight",
  "hinge",
  "jackInTheBox",
  "rollIn",
  "zoomIn",
  "zoomInDown",
  "zoomInLeft",
  "zoomInRight",
  "zoomInUp",
  "slideInDown",
  "slideInLeft",
  "slideInRight",
  "slideInUp",
];

export default function PaymentAlertSettings({
  id,
  onChange,
}: PaymentAlertSettingsProps) {
  const { config, setConfig } = useContext(WidgetsContext);
  const { t } = useTranslation();

  function addDefaultAlert(): void {
    let alerts = config.get(id)?.alerts ?? [];
    alerts.push(DEFAULT_ALERT);

    setConfig((oldConfig) => {
      const alertConfig = oldConfig.get(id);
      alertConfig.alerts = alerts;
      return new Map(config).set(id, alertConfig);
    });
  }

  function playAudio(url: string) {
    if (!url) {
      return;
    }
    const audio = new Audio(
      `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${url}`,
    );
    audio.play();
  }

  function deleteAlert(index: number) {
    const oldConfig = config.get(id) ?? {};
    const alerts = oldConfig?.alerts ?? [];
    alerts.splice(index, 1);
    oldConfig.alerts = alerts;
    setConfig(new Map(config).set(id, oldConfig));
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

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const name = file.name.replace(/[^0-9a-z\.]/gi, "_");
      uploadFile(file, name).then((ignore) => {
        setConfig((oldConfig) => {
          const alertConfig = oldConfig.get(id);
          const alerts = alertConfig?.alerts;
          let updatedAlerts = alerts?.at(index);
          updatedAlerts.image = name;
          alerts[index] = updatedAlerts;
          alertConfig.alerts = alerts;
          const newConfig = new Map(oldConfig).set(id, alertConfig);
          return newConfig;
        });
        onChange.call({});
      });
    }
  };

  function deleteImage(index: number) {
    setConfig((oldConfig) => {
      const alertConfig = oldConfig.get(id);
      const alerts = alertConfig?.alerts;
      let updatedAlerts = alerts?.at(index);
      updatedAlerts.image = null;
      updatedAlerts.video = null;
      alerts[index] = updatedAlerts;
      alertConfig.alerts = alerts;
      const newConfig = new Map(oldConfig).set(id, alertConfig);
      return newConfig;
    });
    onChange.call({});
  }

  const handleVideoUpload = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const name = file.name.replace(/[^0-9a-z\.]/gi, "");
      uploadFile(file, name).then((ignore) => {
        setConfig((oldConfig) => {
          const alertConfig = oldConfig.get(id);
          const alerts = alertConfig?.alerts;
          let updatedAlerts = alerts?.at(index);
          updatedAlerts.video = name;
          alerts[index] = updatedAlerts;
          alertConfig.alerts = alerts;
          const newConfig = new Map(oldConfig).set(id, alertConfig);
          return newConfig;
        });
        onChange.call({});
      });
    }
  };

  const handleAudioUpload = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const name = file.name.replace(/[^0-9a-z\.]/gi, "");
      uploadFile(file, name).then((ignore) => {
        setConfig((oldConfig) => {
          const alertConfig = oldConfig.get(id);
          const alerts = alertConfig?.alerts;
          let updatedAlerts = alerts?.at(index);
          updatedAlerts.audio = name;
          alerts[index] = updatedAlerts;
          alertConfig.alerts = alerts;
          const newConfig = new Map(oldConfig).set(id, alertConfig);
          return newConfig;
        });
        onChange.call({});
      });
    }
  };

  function deleteAudio(index: number) {
    setConfig((oldConfig) => {
      const alertConfig = oldConfig.get(id);
      const alerts = alertConfig?.alerts;
      let updatedAlerts = alerts?.at(index);
      updatedAlerts.audio = null;
      alerts[index] = updatedAlerts;
      alertConfig.alerts = alerts;
      const newConfig = new Map(oldConfig).set(id, alertConfig);
      return newConfig;
    });
    onChange.call({});
  }

  function update(key: string, value: any, index: number) {
    setConfig((oldConfig) => {
      const widgetConfig = oldConfig.get(id) ?? {};
      let updatedProperties = widgetConfig?.alerts
        ?.at(index)
        ?.properties.map((it) => {
          if (it.name === key) {
            it.value = value;
          }
          return it;
        });
      let updatedAlerts = oldConfig
        .get(id)
        ?.alerts?.map((it, number: number) => {
          if (number === index && updatedProperties) {
            it.properties = updatedProperties;
          }
          return it;
        });
      widgetConfig.alerts = updatedAlerts;
      return new Map(oldConfig).set(id, widgetConfig);
    });
    onChange.call({});
  }

  function updateTrigger(value: string, index: number) {
    console.log("updating trigger to " + value + " for index: " + index);
    const amount = parseInt(value);
    setConfig((oldConfig) => {
      const alerts = oldConfig.get(id)?.alerts;
      if (alerts) {
        const updatedAlert = alerts.at(index);
        updatedAlert.trigger.amount = amount;
        alerts[index] = updatedAlert;
      }
      return new Map(oldConfig);
    });
    onChange.call({});
  }

  const alertCard = (alert: any, index?: number) => (
    <div key={index} className="payment-alerts-previews-item">
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
      <AntTabs type="card" items={tabs(alert, index)} />
      {index !== null && index !== undefined && (
        <div onClick={() => deleteAlert(index)} className="alert-delete-button">
          <span className="material-symbols-sharp">delete</span>
        </div>
      )}
    </div>
  );

  const previews = () => (
    <>
      <div
        style={{ marginTop: "10px", marginBottom: "10px", textAlign: "center" }}
      >
        <button className="oda-btn-default" onClick={() => addDefaultAlert()}>
          {t("button-add-alert")}
        </button>
      </div>
      <div className="payment-alerts-previews">
        {config.get(id)?.alerts?.map(alertCard)}
      </div>
    </>
  );

  const tabContent = (alert, selectedTab: string, index: number) =>
    alert?.properties
      .filter((it) => it.tab === selectedTab)
      .filter((it) => it.type !== "fontselect")
      .filter((it) => it.type !== "custom")
      .map((prop) => (
        <div className="settings-item">
          <LabeledContainer key={`${prop.name}`} displayName={prop.displayName}>
            {(!prop.type || prop.type == "string") && (
              <Input
                value={prop.value}
                onChange={(e) => {
                  update(prop.name, e.target.value, index);
                }}
              />
            )}
            {prop.type === "color" && (
              <ColorPicker
                value={prop.value}
                onChange={(value) => update(prop.name, value, index)}
              />
            )}
            {prop.type === "text" && (
              <TextPropertyModal
                title={prop.displayName}
                className="textarea-popup-container"
              >
                <div className="textarea-container">
                  <textarea
                    style={{ height: "700px" }}
                    className="widget-settings-value"
                    value={prop.value}
                    onChange={(e) => update(prop.name, e.target.value, index)}
                  />
                </div>
              </TextPropertyModal>
            )}
            {prop.type === "boolean" && (
              <BooleanPropertyInput
                prop={prop}
                onChange={() => update(prop.name, !prop.value, index)}
              />
            )}
          </LabeledContainer>
        </div>
      ));

  const tabs = (alert, index) => [
    {
      key: "trigger",
      label: t("tab-alert-trigger"),
      children: [
        <>
          {[
            <div className="settings-item">
              <LabeledContainer displayName="widget-alert-amount">
                <InputNumber
                  value={alert.trigger.amount}
                  addonAfter="руб."
                  onChange={(value) => updateTrigger(value, index)}
                />
              </LabeledContainer>
            </div>,
          ]}
        </>,
      ],
    },
    {
      key: "image",
      label: t("tab-alert-image"),
      children: [
        <>
          {[
            ...tabContent(alert, "image", index),
            <div className="settings-item">
              <LabeledContainer displayName="alert-appearance-label">
                <Select
                  className="full-width"
                  value={
                    alert.properties.find((prop) => prop.name === "appearance")
                      ?.value
                  }
                  options={[...APPEARANCE_ANIMATIONS, "random", "none"].map(
                    (option) => {
                      return { label: t(option), value: option };
                    },
                  )}
                  onChange={(selected) => {
                    update("appearance", selected, index);
                  }}
                />
              </LabeledContainer>
            </div>,
            <div className="upload-button-container">
              {!alert.video && !alert.image && (
                <>
                  <div
                    style={{
                      marginBottom: "10px",
                      marginTop: "10px",
                      marginRight: "10px",
                    }}
                  >
                    <label
                      className="oda-btn-default"
                      style={{ marginRight: "10px" }}
                    >
                      <input
                        type="file"
                        onChange={(e) => handleVideoUpload(e, index)}
                      />
                      {t("button-upload-video")}
                    </label>
                    <label className="oda-btn-default">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, index)}
                      />
                      {t("button-upload-image")}
                    </label>
                  </div>
                </>
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
                    onClick={() => deleteImage(index)}
                  >
                    {t("button-delete")}
                  </label>
                </div>
              )}
            </div>,
          ]}
        </>,
      ],
    },
    {
      key: "sound",
      label: t("tab-alert-audio"),
      children: [
        <>
          {[
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
                          onClick={() => deleteAudio(index)}
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
                        value={
                          alert.properties.find(
                            (prop) => prop.name === "audio-volume",
                          )?.value
                        }
                        onChange={(value) =>
                          update("audio-volume", value, index)
                        }
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
                        onChange={(e) => handleAudioUpload(e, index)}
                      />
                      {t("button-upload-audio")}
                    </label>
                  </div>
                )}
              </div>
            </div>,
          ]}
        </>,
      ],
    },
    {
      key: "voice",
      label: t("tab-alert-voice"),
      children: [<>{tabContent(alert, "voice", index)}</>],
    },
    {
      key: "header",
      label: t("tab-alert-title"),
      children: [
        <>
          {[
            ...tabContent(alert, "header", index),
            <div className="settings-item">
              <WidgetsContext.Provider
                value={{
                  config: config,
                  setConfig: setConfig,
                  updateConfig: (widgetId, name, value) =>
                    update("headerFont", value, index),
                }}
              >
                <AnimatedFontComponent
                  property={
                    new AnimatedFontProperty({
                      widgetId: "widgetId",
                      name: "headerFont",
                      value: alert.properties.find(
                        (prop) => prop.name === "headerFont",
                      )?.value,
                      label: "widget-alert-title-font-family",
                    })
                  }
                />
              </WidgetsContext.Provider>
            </div>,
          ]}
        </>,
      ],
    },
    {
      key: "message",
      label: t("tab-alert-message"),
      children: [
        <>
          {[
            <div className="settings-item">
              <WidgetsContext.Provider
                value={{
                  config: config,
                  setConfig: setConfig,
                  updateConfig: (widgetId, name, value) =>
                    update("font", value, index),
                }}
              >
                <AnimatedFontComponent
                  property={
                    new AnimatedFontProperty({
                      widgetId: "widgetId",
                      name: "font",
                      value: alert.properties.find(
                        (prop) => prop.name === "font",
                      )?.value,
                      label: "widget-alert-message-font-family",
                    })
                  }
                />
              </WidgetsContext.Provider>
            </div>,
            <div className="settings-item">
              {new SingleChoiceProperty({
                widgetId: "widgetId",
                name: "message-appearance",
                value: alert.properties.find(
                  (prop) => prop.name === "message-appearance",
                )?.value,
                displayName: "alert-message-appearance-label",
                options: [...APPEARANCE_ANIMATIONS, "random", "none"],
              }).markup((widgetId, name, value) =>
                update("message-appearance", value, index),
              )}
            </div>,
          ]}
        </>,
      ],
    },
  ];

  return (
    <>
      <AntTabs
        type="card"
        items={[
          {
            key: "1",
            label: t("tab-alert-alerts"),
            children: previews(),
          },
        ]}
      />
    </>
  );
}
