import React, { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { log } from "../../logging";
import "./Menu.css";
import TestAlertPopup from "../TestAlertPopup/TestAlertPopup";

export default function Menu({ config, socket }) {
  const navigate = useNavigate();
  const [requestsEnabled, setRequestsEnabled] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (requestsEnabled !== null) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/alerts.enabled`)
      .then((response) => {
        let enabled = response.data[0].value === "true";
        setRequestsEnabled(enabled);
      });
  });

  function sendMusicAlert() {
    socket.publish({
      destination: config.topic.alerts,
      body: JSON.stringify({
        id: "ae7d3c02-209b-4b69-a95b-2a60de4aff9b",
        senderName: "",
        message: "Музыкальный алерт",
        amount: {
          amount: 100,
          currency: "RUB",
        },
      }),
    });
    socket.publish({
      destination: config.topic.media,
      body: JSON.stringify({
        id: "b9383d82-d5b7-4250-bacc-d48e99b6b1df",
        url: "https://www.youtube.com/watch?v=at1e2XnbOuw",
        recipientId: "tabularussia",
        title:
          "DARK AGE - Afterlife (2013) // Official Music Video // AFM Records",
        thumbnail: "https://i.ytimg.com/vi/at1e2XnbOuw/maxresdefault.jpg",
        ready: true,
      }),
    });
  }

  function disableRequests() {
    axios
      .put(`${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config`, {
        name: "alerts.enabled",
        value: "false",
      })
      .then(() => reloadAlertWidget());
    setRequestsEnabled(false);
  }

  function enableRequests() {
    axios
      .put(`${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config`, {
        name: "alerts.enabled",
        value: "true",
      })
      .then(() => reloadAlertWidget());
    setRequestsEnabled(true);
  }

  function reloadAlertWidget() {
    socket.publish({
      destination: config.topic.alertWidgetCommans,
      body: JSON.stringify({
        command: "reload",
      }),
    });
  }

  return (
    <>
      <div className="buttons">
        {!requestsEnabled && (
          <div className="disabled-alerts-warning">
            <span className="material-symbols-sharp">priority_high</span>
            Alerts are disabled
          </div>
        )}
        <button
          className="btn btn-outline-light"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
					<img className="menu-button-logo" src={`${process.env.PUBLIC_URL}/favicon.png`}/>
        </button>
        <div
          ref={menuRef}
          className={`widget-menu payment-menu ${
            showMenu ? "" : "visually-hidden"
          }`}
        >
          <button
            className="btn btn-dark"
            onClick={() => {
              navigate(0);
              log.debug("reload payments widget");
            }}
          >
            Reload
          </button>
          {requestsEnabled && (
            <button className="btn btn-dark" onClick={() => disableRequests()}>
              Disable alerts
            </button>
          )}
          {!requestsEnabled && (
            <button className="btn btn-dark" onClick={() => enableRequests()}>
              Enable alerts
            </button>
          )}
          <TestAlertPopup config={config} socket={socket} />
        </div>
      </div>
    </>
  );
}
