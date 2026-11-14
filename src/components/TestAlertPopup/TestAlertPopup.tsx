import { useContext, useState } from "react";
import { log } from "../../logging";
import "./TestAlertPopup.css";
import { publish } from "../../socket";
import {
  Dialog,
  ModalState,
  ModalStateContext,
  Overlay,
} from "../Overlay/Overlay";
import SecondaryButton from "../Button/SecondaryButton";
import PrimaryButton from "../Button/PrimaryButton";
import InputNumber from "../ConfigurationPage/components/InputNumber";
import { Flex, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import SubActionButton from "../Button/SubActionButton";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";

export default function TestAlertPopup({}: {}) {
  const { t } = useTranslation();
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const { conf } = useLoaderData() as WidgetData;
  const parentModalState = useContext(ModalStateContext);
  const [state] = useState<ModalState>(() => new ModalState(parentModalState));

  function sendTestAlert() {
    const variables = [
      {
        name: "amount",
        value: String(amount),
      },
      {
        name: "nickname",
        value: nickname ? nickname : "Аноним",
      },
      {
        name: "message",
        value: message ? message : "Тестовое сообщение",
      },
      {
        name: "event",
        value: "payment",
      },
      {
        name: "system",
        value: "ODA",
      },
      {
        name: "force",
        value: true,
      },
    ];
    publish(conf.topic.events, {
      type: "Alert",
      variables: variables,
    });
  }

  return (
    <ModalStateContext.Provider value={state}>
      <SubActionButton
        onClick={() => {
          state.show = true;
        }}
      >
        <div style={{ marginLeft: "2px" }}>{t("button-testalert")}</div>
      </SubActionButton>
      <Overlay>
        <Dialog>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">{t("testalert-donater-nickname")}</div>
            <Input
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
            <TextArea
              value={message}
              placeholder={t("testalert-message-value")}
              autoComplete="off"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </div>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">{t("testalert-donation-amount")}</div>
            <InputNumber
              value={amount}
              onChange={(value) => {
                setAmount(value);
              }}
            />
          </div>
          <Flex justify="flex-end" gap={12} style={{ marginTop: "12px" }}>
            <SecondaryButton
              onClick={() => {
                state.show = false;
              }}
            >
              {t("button-cancel")}
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                sendTestAlert();
                state.show = false;
              }}
            >
              {t("testalert-run-alert")}
            </PrimaryButton>
          </Flex>
        </Dialog>
      </Overlay>
    </ModalStateContext.Provider>
  );
}
