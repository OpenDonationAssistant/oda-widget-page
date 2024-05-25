import React, { ChangeEvent, useContext } from "react";
import { useState } from "react";
import { WidgetsContext } from "../WidgetsContext";
import axios from "axios";
import ColorPicker from "./ColorPicker";
import BaseSettings from "./BaseSettings";
import BooleanPropertyInput from "./properties/BooleanPropertyInput";
import TestAlertButton from "./TestAlertButton";

interface PaymentAlertSettingsProps {
  id: string;
  onChange: Function;
}

const fonts = [
  "Roboto",
  "Ruslan Display",
  "Cuprum",
  "Anonymous Pro",
  "Pangolin",
  "Ruda",
  "Stalinist One",
  "Montserrat",
  "Ubuntu Mono",
  "Jura",
  "Scada",
  "Prosto One",
  "Arsenal",
  "Tenor Sans",
  "El Messiri",
  "Yeseva One",
  "Pattaya",
  "Andika",
  "Gabriela",
  "Marmelad",
  "Cormorant Unicase",
  "Cormorant SC",
  "Amatic SC",
  "Rubik Mono One",
  "PT Sans Caption",
  "Spectral SC",
  "Rubik",
  "Exo 2",
  "Exo",
  "Oswald",
  "Underdog",
  "Kurale",
  "Forum",
  "Neucha",
  "Didact Gothic",
  "Philosopher",
  "Russo One",
  "Noto Serif",
];

export default function PaymentAlertSettings({
  id,
  onChange,
}: PaymentAlertSettingsProps) {
  const [tab, setTab] = useState("trigger");
  const [selected, setSelected] = useState<number>(-2);
  const { config, setConfig } = useContext(WidgetsContext);
  const [showTestAlert, setShowTestAlert] = useState<boolean>(false);

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
          displayName: "Ширина изображения в пикселях",
        },
        {
          tab: "image",
          name: "imageHeight",
          value: null,
          displayName: "Высота изображения в пикселях",
        },
        {
          tab: "image",
          name: "imageShowTime",
          value: null,
          displayName: "Сколько времени показывать изображение (сек)",
        },
        {
          tab: "header",
          name: "nicknameFont",
          type: "fontselect",
          value: "Roboto",
          displayName: "Шрифт в заголовке",
        },
        {
          tab: "header",
          name: "nicknameFontSize",
          value: "60",
          displayName: "Размер шрифта в заголовке",
        },
        {
          tab: "header",
          name: "headerColor",
          type: "color",
          value: "#fb8c2b",
          displayName: "Цвет заголовка",
        },
        {
          tab: "header",
          name: "nicknameTextTemplate",
          type: "text",
          value: "<username> - <amount>",
          displayName: "Шаблон заголовка",
        },
        {
          tab: "message",
          name: "messageFont",
          type: "fontselect",
          value: "Roboto",
          displayName: "Шрифт в сообщении",
        },
        {
          tab: "message",
          name: "messageFontSize",
          value: "25",
          displayName: "Размер шрифта в сообщении",
        },
        {
          tab: "message",
          name: "messageColor",
          type: "color",
          value: "#ffffff",
          displayName: "Цвет сообщения",
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
          displayName: "Фразы для озвучивания заголовка с сообщением",
        },
        {
          tab: "voice",
          name: "enableVoiceWhenMessageIsEmpty",
          type: "boolean",
          value: true,
          displayName: "Озвучивать заголовок если сообщение отсутствует",
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
          displayName: "Фразы для озвучивания заголовка если нет сообщения",
        },
      ],
    });

    setConfig((oldConfig) => {
      const alertConfig = oldConfig.get(id);
      alertConfig.alerts = alerts;
      return new Map(config).set(id, alertConfig);
    });

    setSelected(alerts.length - 1);
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

  function deleteAlert() {
    const oldConfig = config.get(id) ?? {};
    const alerts = oldConfig?.alerts ?? [];
    alerts.splice(selected, 1);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const name = file.name.replace(/[^0-9a-z\.]/gi, "");
      uploadFile(file, name).then((ignore) => {
        setConfig((oldConfig) => {
          const alertConfig = oldConfig.get(id);
          const alerts = alertConfig?.alerts;
          let updatedAlerts = alerts?.at(selected);
          updatedAlerts.image = name;
          alerts[selected] = updatedAlerts;
          alertConfig.alerts = alerts;
          const newConfig = new Map(oldConfig).set(id, alertConfig);
          return newConfig;
        });
        onChange.call({});
      });
    }
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const name = file.name.replace(/[^0-9a-z\.]/gi, "");
      uploadFile(file, name).then((ignore) => {
        setConfig((oldConfig) => {
          const alertConfig = oldConfig.get(id);
          const alerts = alertConfig?.alerts;
          let updatedAlerts = alerts?.at(selected);
          updatedAlerts.video = name;
          alerts[selected] = updatedAlerts;
          alertConfig.alerts = alerts;
          const newConfig = new Map(oldConfig).set(id, alertConfig);
          return newConfig;
        });
        onChange.call({});
      });
    }
  };

  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const name = file.name.replace(/[^0-9a-z\.]/gi, "");
      uploadFile(file, name).then((ignore) => {
        setConfig((oldConfig) => {
          const alertConfig = oldConfig.get(id);
          const alerts = alertConfig?.alerts;
          let updatedAlerts = alerts?.at(selected);
          updatedAlerts.audio = name;
          alerts[selected] = updatedAlerts;
          alertConfig.alerts = alerts;
          const newConfig = new Map(oldConfig).set(id, alertConfig);
          return newConfig;
        });
        onChange.call({});
      });
    }
  };

  function update(key: string, value: any) {
    setConfig((oldConfig) => {
      const widgetConfig = oldConfig.get(id) ?? {};
      let updatedProperties = widgetConfig?.alerts
        ?.at(selected)
        ?.properties.map((it) => {
          if (it.name === key) {
            it.value = value;
          }
          return it;
        });
      let updatedAlerts = oldConfig
        .get(id)
        ?.alerts?.map((it, number: number) => {
          if (number === selected && updatedProperties) {
            it.properties = updatedProperties;
          }
          return it;
        });
      widgetConfig.alerts = updatedAlerts;
      return new Map(oldConfig).set(id, widgetConfig);
    });
    onChange.call({});
  }

  function updateTrigger(value: string) {
    const amount = parseInt(value);
    setConfig((oldConfig) => {
      const alerts = oldConfig.get(id)?.alerts;
      if (alerts) {
        const updatedAlert = alerts.at(selected);
        updatedAlert.trigger.amount = amount;
        alerts[selected] = updatedAlert;
      }
      return new Map(oldConfig);
    });
    onChange.call({});
  }

  const previews = () => (
    <div className="payment-alerts-previews">
      {config.get(id)?.alerts?.map((alert, number: number) => (
        <div key={number} className="payment-alerts-previews-item">
          {alert.image && (
            <img
              className={`payment-alert-image-preview ${
                selected === number ? "selected" : ""
              }`}
              src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`}
              onClick={() => {
                setTab("trigger");
                setSelected(selected === number ? -2 : number);
              }}
            />
          )}
          {alert.video && (
            <video
              className={`payment-alert-image-preview ${
                selected === number ? "selected" : ""
              }`}
              src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.video}`}
              muted={true}
              onClick={() => {
                setTab("trigger");
                setSelected(selected === number ? -2 : number);
              }}
            />
          )}
          {!alert.image && !alert.video && (
            <div
              onClick={() => {
                setTab("trigger");
                setSelected(selected === number ? -2 : number);
              }}
              className={`payment-alert-image-preview ${
                selected === number ? "selected" : ""
              }`}
            ></div>
          )}
          {selected === number && (
            <div onClick={() => deleteAlert()} className="alert-delete-button">
              <span className="material-symbols-sharp">delete</span>
            </div>
          )}
        </div>
      ))}
      <div className="new-alert payment-alerts-previews-item">
        <div
          className={`payment-alert-image-preview ${
            selected === -1 ? "selected" : ""
          }`}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            userSelect: "none",
          }}
          onClick={() => addDefaultAlert()}
        >
          <span className="material-symbols-sharp">add_box</span>
        </div>
      </div>
    </div>
  );

  const tabs = () => (
    <div className="payment-alert-settings-tabs">
      <div
        className={`settings-tab-item payment-alert-settings-tab-image ${
          tab === "trigger" ? "active" : ""
        }`}
        onClick={() => setTab("trigger")}
      >
        условие
      </div>
      <div
        className={`settings-tab-item payment-alert-settings-tab-image ${
          tab === "image" ? "active" : ""
        }`}
        onClick={() => setTab("image")}
      >
        изображение
      </div>
      <div
        className={`settings-tab-item payment-alert-settings-tab-voice ${
          tab === "sound" ? "active" : ""
        }`}
        onClick={() => setTab("sound")}
      >
        аудио
      </div>
      <div
        className={`settings-tab-item payment-alert-settings-tab-voice ${
          tab === "voice" ? "active" : ""
        }`}
        onClick={() => setTab("voice")}
      >
        голос
      </div>
      <div
        className={`settings-tab-item payment-alert-settings-tab-voice ${
          tab === "header" ? "active" : ""
        }`}
        onClick={() => setTab("header")}
      >
        заголовок
      </div>
      <div
        className={`settings-tab-item payment-alert-settings-tab-voice ${
          tab === "message" ? "active" : ""
        }`}
        onClick={() => setTab("message")}
      >
        сообщение
      </div>
    </div>
  );

  const tabContent = () => (
    <>
      {config
        .get(id)
        ?.alerts?.at(selected)
        ?.properties.filter((it) => it.tab === tab)
        .map((prop) => (
          <div
            key={`${selected}_${prop.name}`}
            className="widget-settings-item"
          >
            <div className="widget-settings-name">{prop.displayName}</div>
            {(!prop.type || prop.type == "string") && (
              <input
                value={prop.value}
                className="widget-settings-value"
                onChange={(e) => update(prop.name, e.target.value)}
              />
            )}
            {prop.type === "fontselect" && (
              <select
                value={prop.value}
                className="widget-settings-value select"
                onChange={(e) => update(prop.name, e.target.value)}
              >
                {fonts.sort().map((font) => (
                  <option key={font}>{font}</option>
                ))}
              </select>
            )}
            {prop.type === "color" && (
              <div className="color-container">
                <ColorPicker
                  value={prop.value}
                  onChange={(value) => update(prop.name, value)}
                />
              </div>
            )}
            {prop.type === "text" && (
              <>
                <div className="textarea-container">
                  <textarea
                    style={{ width: "50%" }}
                    className="widget-settings-value"
                    value={prop.value}
                    onChange={(e) => update(prop.name, e.target.value)}
                  />
                </div>
              </>
            )}
            {prop.type === "boolean" && (
              <BooleanPropertyInput
                prop={prop}
                onChange={() => update(prop.name, !prop.value)}
              />
            )}
          </div>
        ))}
      {"trigger" === tab && (
        <>
          <div key={`${selected}_trigger`} className="widget-settings-item">
            <div className="widget-settings-name">Сумма</div>
            <input
              value={config.get(id)?.alerts?.at(selected)?.trigger.amount}
              className="widget-settings-value"
              onChange={(e) => updateTrigger(e.target.value)}
            />
          </div>
        </>
      )}
      {"image" === tab && (
        <div className="upload-button-container">
          <label className="upload-button" style={{ marginRight: "10px" }}>
            <input type="file" onChange={handleVideoUpload} />
            Загрузить видео
          </label>
          <label className="upload-button">
            <input type="file" onChange={handleFileChange} />
            Загрузить изображение
          </label>
        </div>
      )}
      {"sound" === tab && (
        <>
          <div className="current-sound">
            <span
              onClick={() =>
                playAudio(config.get(id)?.alerts?.at(selected).audio)
              }
              className="material-symbols-sharp"
            >
              play_circle
            </span>
          </div>
          <label className="upload-button">
            <input type="file" onChange={handleAudioUpload} />
            Загрузить аудио
          </label>
        </>
      )}
    </>
  );

  return (
    <>
      <TestAlertButton config={config}/>
      <BaseSettings id={id} />
      {previews()}
      {selected > -1 && (
        <div className="payment-alert-settings">
          {tabs()}
          {tabContent()}
        </div>
      )}
    </>
  );
}
