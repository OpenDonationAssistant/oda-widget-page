import React, { useEffect } from "react";
import "./PlayerInfo.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoaderData, useNavigate } from "react-router";
import { findSetting } from "../utils";
import { setupCommandListener, subscribe } from "../../socket";
import { log } from "../../logging";
import FontImport from "../FontImport/FontImport";

function PlayerInfo() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({});
  const [left, setLeft] = useState(0);
  const { settings, conf, widgetId } = useLoaderData();

  useEffect(() => {
    subscribe(widgetId, conf.topic.player, (message) => {
      log.debug(`Received: ${message.body}`);
      let json = JSON.parse(message.body);
      setAlert(json);
      setLeft(json.count - json.number);
      message.ack();
    });
		setupCommandListener(widgetId, () => navigate(0));
  }, [widgetId]);

  const fontSize = findSetting(settings, "fontSize", "24px");
  const font = findSetting(settings, "font", "Roboto");
  const color = findSetting(settings, "color", "white");
  const textStyle = {
    fontSize: fontSize ? fontSize + "px" : "unset",
    fontFamily: font ? font : "unset",
    color: color,
  };

  return (
    <>
      <FontImport font={font} />
      <div className="player-info-container" data-vjs-player>
        <div className="player-info"></div>
        <span className="player-info-text" style={textStyle}>
          {alert.title != undefined && alert.title
            ? (left > 1 ? "Треков в очереди: " + left + ", " : "") +
              "играет: " +
              alert.title
            : ""}
        </span>
      </div>
    </>
  );
}

export default PlayerInfo;
