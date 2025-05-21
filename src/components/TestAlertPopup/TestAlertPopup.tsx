import { useContext, useState } from "react";
import { log } from "../../logging";
import "./TestAlertPopup.css";
import { publish } from "../../socket";
import { Config } from "../../config";
import { Dialog, ModalStateContext, Overlay } from "../Overlay/Overlay";

export default function TestAlertPopup({ config }: { config: Config }) {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const state = useContext(ModalStateContext);

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

  return (
    <ModalStateContext.Provider value={state}>
      <Overlay>
        <Dialog>
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
            <button
              className="btn btn-dark"
              onClick={() => {
                sendTestAlert();
                state.show = false;
              }}
            >
              Test alert
            </button>
            <button
              className="btn btn-dark"
              onClick={() => {
                state.show = false;
              }}
            >
              Close
            </button>
          </div>
        </Dialog>
      </Overlay>
    </ModalStateContext.Provider>
  );
}
