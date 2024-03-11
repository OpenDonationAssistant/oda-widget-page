import React, { useEffect, useState } from "react";
import { log } from "../../logging";
import "./TestAlertPopup.css";
import { publish } from "../../socket";
import { Config } from "../../config";

export default function TestAlertPopup({ config }: { config: Config }) {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [showAlertPopup, setShowAlertPopup] = useState(false);

  function sendTestAlert() {
    publish(config.topic.alerts, {
      id: "ae7d3c02-209b-4b69-a95b-2a60de4aff9b",
      nickname: nickname ? nickname : "Аноним",
      message: message ? message : "Тестовое сообщение",
      amount: {
        major: amount ? parseInt(amount) : 40,
        minor: 0,
        currency: "RUB",
      },
    });
    log.debug("Send test alert");
  }

  useEffect(() => {
    function toggle() {
      setShowAlertPopup((value) => !value);
    }
    document.addEventListener("toggleSendAlertPopup", toggle);
    return () => document.removeEventListener("toggleSendAlertPopup", toggle);
  }, [showAlertPopup]);

  return (
    <>
      {showAlertPopup && (
        <div className="test-alert-popup">
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">Nickname</div>
            <input
              value={nickname}
              placeholder="Аноним"
              autoComplete="off"
              onChange={(e) => {
                setNickname(e.target.value);
              }}
            />
          </div>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">Message</div>
            <textarea
              value={message}
              placeholder="Тестовое сообщение"
              autoComplete="off"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </div>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">Amount</div>
            <input
              value={amount}
              placeholder="40"
              autoComplete="off"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>
          <div className="test-alert-buttons">
            <button className="btn btn-dark" onClick={() => {
							sendTestAlert();
							setShowAlertPopup(false);
						}}>
              Test alert
            </button>
            <button
              className="btn btn-dark"
              onClick={() => setShowAlertPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
