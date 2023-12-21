import React, { useEffect, useRef } from "react";
import "./PaymentAlerts.css";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { log } from "../../logging";
import { publish, setupCommandListener, subscribe } from "../../socket";
import FontImport from "../FontImport/FontImport";

let playingAudio = null;
let playingSource = null;
let endFunction = null;

function interruptAlert() {
  if (playingAudio) {
    playingAudio.onended = null;
    playingAudio.currentTime = playingAudio.duration;
  }
  if (playingSource) {
    playingSource.stop();
  }
  endFunction();
}

var showing = false;

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const audioCtx = new AudioContext();

function getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function textToVoice(
  alertInfo,
  onEndHandler,
  textTemplate: string,
  playIfMessageEmpty: boolean,
  emptyMessageTextTemplate: string,
  recipientId: string,
) {
  if (alertInfo === undefined || alertInfo === null) {
    return;
  }
  if (
    (alertInfo.message === undefined ||
      alertInfo.message === null ||
      alertInfo.message === "") &&
    !playIfMessageEmpty
  ) {
    onEndHandler();
    return;
  }
  console.log("text to voice " + alertInfo.message);
  const message = alertInfo?.message?.trim();
  const headerForVoice = message ? textTemplate : emptyMessageTextTemplate;
  const text = headerForVoice
    ? headerForVoice
    : "Пользователь <username> отправил сообщение";
  const templates = text.split("\n");
  const choosenTemplate = 
    templates.length > 1 ? templates[getRndInteger(0, templates.length)] : text;
  let body = {
    input: {
      ssml:
        "<speak>" +
        choosenTemplate.trim()
          .replace(
            "<username>",
            alertInfo.senderName ? alertInfo.senderName : "Аноним",
          )
          .replace("<amount>", alertInfo.amount.amount)
          .replace("<minoramount>", alertInfo.amount.amount * 100)
          .replace("<streamer>", recipientId) +
        '<break time="1s"/>' +
        alertInfo.message +
        ".</speak>",
    },
    voice: {
      languageCode: "ru-RU",
      name: "ru-RU-Wavenet-D",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  };

  let data = await fetch("https://api.oda.digital/texttospeech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let json = await data.json();

  let rawAudio = base64ToArrayBuffer(json.audioContent);
  audioCtx.decodeAudioData(
    rawAudio,
    (buf) => {
      let source = audioCtx.createBufferSource();
      if (onEndHandler) {
        source.addEventListener("ended", onEndHandler);
      }
      playingSource = source;
      source.connect(audioCtx.destination);
      source.buffer = buf;
      source.loop = false;
      source.start(0);
    },
    (err) => {
      console.log(err);
    },
  );
  log.debug("textToVoice finished");
}

function PaymentAlerts({}: {}) {
  const [image, setImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(100);
  const [imageHeight, setImageHeight] = useState(100);
  const [alert, setAlert] = useState({});
  const { recipientId, settings, conf, widgetId } = useLoaderData();
  const [nicknameTextTemplate, setNicknameTextTemplate] = useState("");
  const [headerFont, setHeaderFont] = useState("Roboto");
  const [headerStyle, setHeaderStyle] = useState({});
  const [messageFont, setMessageFont] = useState("Roboto");
  const [messageStyle, setMessageStyle] = useState({});
  const [imagesToCache, setImagesToCache] = useState([]);
  const sortedAlerts = useRef([]);
  const navigate = useNavigate();

  function clear() {
    setImage(null);
    setAlert({});
    showing = false;
  }

  function pausePlayer() {
    publish(conf.topic.playerCommands, {
      command: "pause",
    });
  }

  function resumePlayer() {
    publish(conf.topic.playerCommands, {
      command: "resume",
    });
  }

  function sendStartNotification(id) {
    publish(conf.topic.alertStatus, {
      id: id,
      status: "started",
    });
  }

  function sendEndNotification() {
    publish(conf.topic.alertStatus, {
      status: "finished",
    });
  }

  useEffect(() => {
    const sorted = settings.config.alerts.sort(
      (a, b) => a.trigger.amount - b.trigger.amount,
    );
    sorted.map((alert) => {
      alert.audiofile = new Audio(
        `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.audio}`,
      );
    });
    sortedAlerts.current = sorted;
    console.log(sortedAlerts.current);
    setImagesToCache(sorted);
  }, [settings]);

  function renderAlert(alert, data, ackFunction) {
    console.log(
      `try to render alert ${JSON.stringify(alert)}, audio: ${
        alert.audio
      }, image: ${alert.image}`,
    );
    sendStartNotification(data.id);
    pausePlayer();
    playingAudio = alert.audiofile;
    endFunction = () => {
      resumePlayer();
      clear();
      sendEndNotification();
      ackFunction();
    };
    playingAudio.onended = () => {
      playingAudio = null;
      textToVoice(
        data,
        endFunction,
        findSetting(alert.properties, "voiceTextTemplate", null),
        findSetting(alert.properties, "enableVoiceWhenMessageIsEmpty", false),
        findSetting(alert.properties, "voiceEmptyTextTemplate", null),
				recipientId
      );
    };
    playingAudio.play();
    setNicknameTextTemplate(
      findSetting(
        alert.properties,
        "nicknameTextTemplate",
        "<username> - <amount>",
      ),
    );
    setImage(`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`);
    setImageWidth(findSetting(alert.properties, "imageWidth", 100));
    setImageHeight(findSetting(alert.properties, "imageHeight", 100));
    const headerFont = findSetting(alert.properties, "nicknameFont", "Roboto");
    const headerFontSize = findSetting(
      alert.properties,
      "nicknameFontSize",
      "24px",
    );
    const headerColor = findSetting(alert.properties, "headerColor", "#fb8c2b");
    setHeaderStyle({
      fontSize: headerFontSize ? headerFontSize + "px" : "unset",
      fontFamily: headerFont ? headerFont : "unset",
      color: headerColor,
    });
    setHeaderFont(headerFont);
    const messageFont = findSetting(alert.properties, "messageFont", "Roboto");
    const messageFontSize = findSetting(
      alert.properties,
      "messageFontSize",
      "24px",
    );
    const messageColor = findSetting(
      alert.properties,
      "messageColor",
      "#fb8c2b",
    );
    setMessageFont(messageFont);
    setMessageStyle({
      fontSize: messageFontSize ? messageFontSize + "px" : "unset",
      fontFamily: messageFont ? messageFont : "unset",
      color: messageColor,
    });
    return;
  }
  function findSetting(properties, key: string, defaultValue: any | null) {
    const setting = properties.find((prop) => key === prop.name);
    if (setting) {
      return setting.value;
    }
    return defaultValue;
  }

  function handleNewAlert(json, ackFunction) {
    if (showing == true) {
      setTimeout(() => handleNewAlert(json, ackFunction), 1000);
      console.log("another alert in play");
      return;
    }
    showing = true;
    setAlert(json);
    console.log("message to alert:" + json.message);
    console.log(sortedAlerts.current);
    const index = sortedAlerts.current.findLastIndex(
      (item) => item.trigger.amount <= json.amount.amount,
    );
    console.log(index);
    if (index === -1) {
      return;
    }
    const alert = sortedAlerts.current[index];
    renderAlert(alert, json, ackFunction);
  }

  useEffect(() => {
    subscribe(widgetId, conf.topic.alerts, (message) => {
      log.info(`Alerts received: ${message.body}`);
      let json = JSON.parse(message.body);
      handleNewAlert(json, () => message.ack());
      log.info("Alert handled");
    });

    subscribe(widgetId, conf.topic.alertWidgetCommans, (message) => {
      log.info(`Alerts command: ${message.body}`);
      let json = JSON.parse(message.body);
      if (json.command === "reload") {
        navigate(0);
      }
      if (json.command === "interrupt") {
        interruptAlert();
      }
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
  }, [widgetId]);

  return (
    <>
      <FontImport font={headerFont} />
      <FontImport font={messageFont} />
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%;}`,
        }}
      />
      {imagesToCache.map((alert) => (
        <img
          key={alert.image}
          style={{ display: "none" }}
          src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`}
        />
      ))}
      <div className="PaymentAlerts h-100">
			<div className={`${imageWidth && imageHeight ? "text-center" : "image-container"}`}>
        {image && (
          <img
            src={image}
            style={calculateImageStyle(imageWidth, imageHeight)}
            className="alert-image"
          />
        )}
				</div>
        <div className="message">
          <div style={headerStyle} className="message-header">
            {alert.amount != undefined && alert.amount != null
              ? nicknameTextTemplate
                  .replace(
                    "<username>",
                    alert.senderName ? alert.senderName : "Аноним",
                  )
                  .replace(
                    "<amount>",
                    `${alert.amount.amount} ${alert.amount.currency}`,
                  )
              : null}
          </div>
          <div style={messageStyle} className="message-body">
            {alert.message != undefined && alert.message != null
              ? alert.message
              : null}
          </div>
        </div>
      </div>
    </>
  );
}

function calculateImageStyle(
  imageWidth: number | undefined,
  imageHeight: number | undefined,
) {
  return imageWidth && imageHeight
    ? {
        width: imageWidth + "px",
        height: imageHeight + "px",
      }
    : {
				objectFit: "contain"
      };
}

export default PaymentAlerts;
