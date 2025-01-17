import React, { useState } from "react";
import PopupComponent from "../../Popup/PopupComponent";
import { publish } from "../../../socket";
import { log } from "../../../logging";
import { Config } from "../../../config";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../../types/WidgetData";
import { useTranslation } from "react-i18next";

export default function TestAlertButton({ config }: { config: Config }) {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const { conf } = useLoaderData() as WidgetData;
  const { t } = useTranslation();

  function sendTestAlert() {
    publish(conf.topic.alerts, {
      id: "ae7d3c02-209b-4b69-a95b-2a60de4aff9b",
      nickname: nickname ? nickname : t("testalert-nickname-value"),
      message: message ? message : t("testalert-message-value"),
      amount: {
        major: amount ? parseInt(amount) : 40,
        minor: 0,
        currency: "RUB",
      },
    });
    log.debug("Send test alert");
  }

  return (
    <>
      <PopupComponent buttonText={t("button-testalert")}>
        <div>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">{t("testalert-nickname-label")}</div>
            <input
              value={nickname}
              placeholder={t("testalert-nickname-value")}
              autoComplete="off"
              onChange={(e) => {
                setNickname(e.target.value);
              }}
            />
          </div>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">{t("testalert-message-label")}</div>
            <textarea
              value={message}
              placeholder={t("testalert-message-value")}
              autoComplete="off"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </div>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">{t("testalert-amount-label")}</div>
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
            <button
              className="btn btn-dark"
              onClick={() => {
                sendTestAlert();
              }}
            >
              {t("testalert-button-label")}
            </button>
          </div>
        </div>
      </PopupComponent>
    </>
  );
}
