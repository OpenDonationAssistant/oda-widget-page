import React, { ChangeEvent, useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import axios from "axios";
import ColorPicker from "./ColorPicker";
import BaseSettings from "./BaseSettings";
import BooleanPropertyInput from "./properties/BooleanPropertyInput";
import { Tabs as AntTabs, Input } from "antd";
import TextPropertyModal from "../widgetproperties/TextPropertyModal";
import { useTranslation } from "react-i18next";
import { AnimatedFontProperty } from "../widgetproperties/AnimatedFontProperty";
import AnimatedFontComponent from "../widgetproperties/AnimatedFontComponent";
import { SingleChoiceProperty } from "../widgetproperties/SingleChoiceProperty";

interface PaymentAlertSettingsProps {
  id: string;
  onChange: Function;
}

export const APPEARANCE_ANIMATIONS =               [
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
    let alerts = config.get(id)?.alerts;
    if (!alerts) {
      alerts = [];
    }
    alerts.push({
      audio: null,
      image: null,
      video: null,
      trigger: {
        amount: 10,
      },
      properties: [
        {
          tab: "image",
          name: "imageWidth",
          value: null,
          displayName: "widget-alert-image-width",
        },
        {
          tab: "image",
          name: "imageHeight",
          value: null,
          displayName: "widget-alert-image-height",
        },
        {
          tab: "image",
          name: "imageShowTime",
          value: null,
          displayName: "widget-alert-image-show-time",
        },
        {
          tab: "image",
          name: "appearance",
          type: "custom",
          value: "none",
        },
        {
          tab: "header",
          name: "headerFont",
          type: "fontselect",
          value: null,
          displayName: "widget-alert-title-font-family",
        },
        {
          tab: "header",
          name: "nicknameTextTemplate",
          type: "text",
          value: "<username> - <amount>",
          displayName: "widget-alert-title-template",
        },
        {
          tab: "message",
          name: "font",
          type: "fontselect",
          value: null,
          displayName: "widget-alert-message-font-family",
        },
        {
          tab: "voice",
          name: "voiceTextTemplate",
          type: "text",
          value: `Пользователь <username> оставил сообщение
<amount> рублей пожертвовал добрый человек по имени <username> с фразой
Щедрый донат в <amount> рублей от <username> со словами
Стример стал богаче на <amount> рублей благодаря <username>
Перевод на <amount> рублей стримеру <streamer> от <username>
Некто <username> сделал подарок в размере <amount> рублей
<streamer> теперь может покушать благодаря <username> и <amount> рублям
<amount> рублей перекочевали в карман <streamer>, спасибо <username>
Донат от <username> в размере <amount> рублей
Низкий поклон <username> за <amount> рублей
Броадкастер <streamer> теперь будет счастливее благодаря <amount> рублям от <username>
Спасибо <username> за целых <amount> рублей, это так неожиданно и приятно
Спасибо <username> за <amount> рублей
Пользователь <username> поддержал стримера <amount> рублями
Пользователь <username> пожертвовал <amount> рублей
Поддержка стримера в размере <amount> рублей от <username>
Стримеру упала денюжка от <username>
Для <streamer> на развитие канала донат <amount> рублей от <username>
Пожертвование на развитие и поддержку канала <streamer> в размере <amount> рублей от <username>
Плюс <amount> от <username>
Донат <minoramount> <break time=\"1s\"/> копеек от <username>
<username> закинул <amount>
Еще <amount> рублей от <username>
Пользователь <username> поддержал стримера, предоставив ему 100 рублей
<username> оказывает помощь стримеру в размере <amount> рублей
Пользователь <username> произвел безвозмедное дарение <amount> рублей
<amount> рублей в помощь от <username>
Некоторую значительную сумму подарил пользователь <username>
Определенное количество рублей подарено щедрым пользователем <username>
<amount> рублей от <username>, премного благодарны
Плюс-минус <amount> рублей донатом от <username>
<streamer> сможет продолжать стримить благодаря <amount> рублям от <username>
Осуществлен перевод на сумму <amount> от <username> в пользу стримера <streamer>
Пользователь всемирной сети Интернет, известный как <username>, поддержал стримера денежным переводом в размере <amount> рублей
Очень рады <username> и <amount> рублям`,
          displayName: "widget-alert-voice-title-phrase",
        },
        {
          tab: "voice",
          name: "voiceEmptyTextTemplates",
          type: "text",
          value: `Пользователь <username> оставил сообщение
<amount> рублей пожертвовал добрый человек по имени <username>
Щедрый донат в <amount> рублей от <username>
Стример стал богаче на <amount> рублей благодаря <username>
Перевод на <amount> рублей стримеру <streamer> от <username>
Некто <username> сделал подарок в размере <amount> рублей
<streamer> теперь может покушать благодаря <username> и <amount> рублям
<amount> рублей перекочевали в карман <streamer>, спасибо <username>
Донат от <username> в размере <amount> рублей
Низкий поклон <username> за <amount> рублей
Броадкастер <streamer> теперь будет счастливее благодаря <amount> рублям от <username>
Спасибо <username> за целых <amount> рублей, это так неожиданно и приятно
Спасибо <username> за <amount> рублей
Пользователь <username> поддержал стримера <amount> рублями
Пользователь <username> пожертвовал <amount> рублей
Поддержка стримера в размере <amount> рублей от <username>
Стримеру упала денюжка от <username>
Для <streamer> на развитие канала донат <amount> рублей от <username>
Пожертвование на развитие и поддержку канала <streamer> в размере <amount> рублей от <username>
Плюс <amount> от <username>
Донат <minoramount> <break time=\"1s\"/> копеек от <username>
<username> закинул <amount>
Еще <amount> рублей от <username>
Пользователь <username> поддержал стримера, предоставив ему 100 рублей
<username> оказывает помощь стримеру в размере <amount> рублей
Пользователь <username> произвел безвозмедное дарение <amount> рублей
<amount> рублей в помощь от <username>
Некоторую значительную сумму подарил пользователь <username>
Определенное количество рублей подарено щедрым пользователем <username>
<amount> рублей от <username>, премного благодарны
Плюс-минус <amount> рублей донатом от <username>
<streamer> сможет продолжать стримить благодаря <amount> рублям от <username>
Осуществлен перевод на сумму <amount> от <username> в пользу стримера <streamer>
Пользователь всемирной сети Интернет, известный как <username>, поддержал стримера денежным переводом в размере <amount> рублей
Очень рады <username> и <amount> рублям`,
          displayName: "widget-alert-voice-empty-alert-phrase",
        },
        {
          tab: "voice",
          name: "enableVoiceWhenMessageIsEmpty",
          type: "boolean",
          value: true,
          displayName: "widget-alert-voice-if-empty",
        },
      ],
    });

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
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
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
        <div key={`${prop.name}`} className="widget-settings-item">
          <div className="widget-settings-name">{t(prop.displayName)}</div>
          {(!prop.type || prop.type == "string") && (
            <Input
              value={prop.value}
              size="small"
              className="widget-settings-value"
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
            <>
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
            </>
          )}
          {prop.type === "boolean" && (
            <BooleanPropertyInput
              prop={prop}
              onChange={() => update(prop.name, !prop.value, index)}
            />
          )}
        </div>
      ));

  const tabs = (alert, index) => [
    {
      key: "trigger",
      label: t("tab-alert-trigger"),
      children: [
        <>
          {[
            ...tabContent(alert, "trigger", index),
            <div key={`${index}_trigger`} className="widget-settings-item">
              <div className="widget-settings-name">
                {t("widget-alert-amount")}
              </div>
              <Input
                size="small"
                className="widget-settings-value"
                value={alert.trigger.amount}
                onChange={(e) => updateTrigger(e.target.value, index)}
              />
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
            new SingleChoiceProperty(
              "widgetId",
              "appearance",
              "choice",
              alert.properties.find((prop) => prop.name === "appearance")
                ?.value,
              "alert-appearance-label",
              [...APPEARANCE_ANIMATIONS,"random","none"]
            ).markup((widgetId, name, value) =>
              update("appearance", value, index),
            ),
            <div className="upload-button-container">
              {!alert.video && !alert.image && (
                <>
                  <div style={{ marginBottom: "10px", marginTop: "10px" }}>
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
                  <button
                    className="oda-btn-default"
                    onClick={() => deleteImage(index)}
                  >
                    {t("button-delete")}
                  </button>
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
            ...tabContent(alert, "sound", index),
            <div className="sound-container">
              {alert.audio && (
                <div className="current-sound">
                  <span className="audio-name">{alert.audio}</span>
                  <span
                    onClick={() => playAudio(alert.audio)}
                    className="material-symbols-sharp"
                  >
                    play_circle
                  </span>
                </div>
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
                {alert.audio && (
                  <button
                    onClick={() => deleteAudio(index)}
                    className="oda-btn-default"
                  >
                    {t("button-delete")}
                  </button>
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
            </WidgetsContext.Provider>,
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
                    value: alert.properties.find((prop) => prop.name === "font")
                      ?.value,
                    label: "widget-alert-message-font-family",
                  })
                }
              />
            </WidgetsContext.Provider>,
            new SingleChoiceProperty(
              "widgetId",
              "message-appearance",
              "choice",
              alert.properties.find((prop) => prop.name === "appearance")
                ?.value,
              "alert-message-appearance-label",
              [...APPEARANCE_ANIMATIONS,"random","none"]
            ).markup((widgetId, name, value) =>
              update("message-appearance", value, index),
            ),
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
          {
            key: "2",
            label: t("tab-alert-default"),
            children: (
              <>
                <BaseSettings id={id} />
              </>
            ),
          },
        ]}
      />
    </>
  );
}
