import { useContext, useState } from "react";
import { log } from "../../logging";
import "./TestAlertPopup.css";
import { publish } from "../../socket";
import { Config } from "../../config";
import { Dialog, ModalStateContext, Overlay } from "../Overlay/Overlay";
import SubActionButton from "../SubActionButton/SubActionButton";
import RunIcon from "../../icons/RunIcon";
import SecondaryButton from "../SecondaryButton/SecondaryButton";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import InputNumber from "../ConfigurationPage/components/InputNumber";
import { Flex, Input } from "antd";
import TextArea from "antd/es/input/TextArea";

export default function TestAlertPopup({ config }: { config: Config }) {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const state = useContext(ModalStateContext);

  function sendTestAlert() {
    publish(config.topic.alerts, {
      id: "ae7d3c02-209b-4b69-a95b-2a60de4aff9b",
      nickname: nickname ? nickname : "Аноним",
      message: message ? message : "Тестовое сообщение",
      amount: {
        major: amount,
        minor: 0,
        currency: "RUB",
      },
    });
    log.debug("Send test alert");
  }

  return (
    <ModalStateContext.Provider value={state}>
      <SecondaryButton
        onClick={() => {
          state.show = true;
        }}
      >
        <RunIcon />
        Тест
      </SecondaryButton>
      <Overlay>
        <Dialog>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">Ник донатера</div>
            <Input
              value={nickname}
              placeholder="Аноним"
              autoComplete="off"
              onChange={(e) => {
                setNickname(e.target.value);
              }}
            />
          </div>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">Сообщение</div>
            <TextArea
              value={message}
              placeholder="Тестовое сообщение"
              autoComplete="off"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </div>
          <div className="test-alert-field-container">
            <div className="test-alert-field-label">Сумма доната</div>
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
              Отменить
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                sendTestAlert();
                state.show = false;
              }}
            >
              Запустить алерт
            </PrimaryButton>
          </Flex>
        </Dialog>
      </Overlay>
    </ModalStateContext.Provider>
  );
}
