import React from "react";
import "./Payments.css";
import { useState, useRef, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Menu from "../Menu/Menu";
import { findSetting } from "../utils";
import { publish, setupCommandListener, subscribe } from "../../socket";
import { log } from "../../logging";
import TestAlertPopup from "../TestAlertPopup/TestAlertPopup";
import MenuEventButton from "../Menu/MenuEventButton";

const dateTimeFormat = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  day: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("ru-RU", {
  hour: "numeric",
  minute: "numeric",
});

function Payments({}: {}) {
  const clientRef = useRef(null);
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [dateToPaymentsMap, setDateToPaymentsMap] = useState(new Map());
  const [todayPayments, setTodayPayments] = useState([]);
  const [attachmentTitles, setAttachmentTitles] = useState(new Map());
  const { recipientId, settings, conf, widgetId } = useLoaderData();

  useEffect(() => {
    let timerFunc = setTimeout(() => {
      setTodayPayments((prev) => setDisplayedTimeForTodayPayments(prev));
    }, 10000);
    return () => clearTimeout(timerFunc);
  });

  useEffect(() => {
    updatePayments();
    subscribe(widgetId, conf.topic.alerts, (message) => {
      updatePayments();
      message.ack();
    });
    subscribe(widgetId, conf.topic.alertStatus, (message) => {
      log.debug(`Payments widgets received: ${message.body}`);
      let json = JSON.parse(message.body);
      if (json.status === "started") {
        setActive(json.id);
      }
      if (json.status === "finished") {
        setActive("");
      }
      message.ack();
    });
    setupCommandListener(widgetId, () => navigate(0));
  }, [recipientId]);

  function setDisplayedTimeForTodayPayments(todayPayments) {
    const now = Date.now();
    log.debug("Now: " + now);
    return todayPayments.map((payment) => {
      const paymentDate = new Date(payment.authorizationTimestamp);
      log.debug("PaymentDate: " + paymentDate);
      if (now - paymentDate > 60 * 60 * 1000) {
        payment.displayedTime = timeFormat.format(paymentDate);
        return payment;
      }
      payment.isRelativeTime = true;
      if (now - paymentDate < 60 * 1000) {
        payment.displayedTime = "Now";
        return payment;
      }
      log.debug("Difference: " + (now - paymentDate));
      payment.displayedTime =
        Math.floor((now - paymentDate) / (60 * 1000)) + " min";
      return payment;
    });
  }

  function updatePayments() {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/payments`)
      .then((data) => data.data)
      .then((json) => {
        let updatedDateToPaymentsMap = dateToPaymentsMap;
        const today = dateTimeFormat.format(Date.now());
        updatedDateToPaymentsMap.set(today, []);

        const attachQueryString = json
          .reduce((attachmentIds, payment) => {
            const paymentAttachIds = payment.attachments
              ?.reduce(
                (paymentAttachmentIds, attach) =>
                  `${paymentAttachmentIds},${attach}`,
                "",
              )
              ?.substring(1) ?? "";
            return `${attachmentIds},${paymentAttachIds}`;
          }, "")
          .substring(1);

        axios
          .get(
            `${process.env.REACT_APP_MEDIA_API_ENDPOINT}/media/video/${attachQueryString}`,
          )
          .then((data) => data.data)
          .then((json) => {
            let updatedAttachmentTitles = new Map();
            json.forEach((attach) => {
              updatedAttachmentTitles.set(attach.id, attach.title);
            });
            setAttachmentTitles(updatedAttachmentTitles);
            log.debug(`${JSON.stringify(updatedAttachmentTitles)}`);
          });

        json.forEach((payment) => {
          const paymentDate = new Date(payment.authorizationTimestamp);
          let date = dateTimeFormat.format(paymentDate);
          payment.displayedTime = timeFormat.format(paymentDate);
          let paymentsInThatDate = updatedDateToPaymentsMap.get(date);
          if (!paymentsInThatDate) {
            paymentsInThatDate = [];
          }
          paymentsInThatDate.push(payment);
          updatedDateToPaymentsMap.set(date, paymentsInThatDate);
        });

        log.debug(`${JSON.stringify(updatedDateToPaymentsMap)}`);
        setDateToPaymentsMap((prev) => updatedDateToPaymentsMap);
        setTodayPayments((prev) =>
          setDisplayedTimeForTodayPayments(updatedDateToPaymentsMap.get(today)),
        );
      });
  }

  function interruptAlert() {
    publish(conf.topic.alertWidgetCommans, {
      command: "interrupt",
    });
  }

  function resendAlert(data) {
    publish(conf.topic.alerts, {
      id: data.id,
      nickname: data.nickname ? data.nickname : "Аноним",
      message: data.message,
      amount: {
        major: data.amount.major,
        currency: "RUB",
      },
    });
    log.debug("resend alert");
  }

  function paymentDates() {
    const today = dateTimeFormat.format(Date.now());
    const dates = Array.from(dateToPaymentsMap.keys());
    const index = dates.indexOf(today);
    if (index > -1) {
      dates.splice(index, 1);
    }
    log.debug(`using payment dates array: ${JSON.stringify(dates)}`);
    console.log(dates);
    return dates;
  }

  function paymentList(data) {
    log.debug(`rendering ${JSON.stringify(data)}`);
    const nicknameFontSize = findSetting(settings, "nicknameFontSize", "24px");
    const nicknameStyle = nicknameFontSize
      ? { fontSize: nicknameFontSize + "px" }
      : {};
    const messageFontSize = findSetting(settings, "messageFontSize", "24px");
    const messageStyle = messageFontSize
      ? { fontSize: messageFontSize + "px" }
      : {};
    return (
      <div
        key={data.id}
        className={`payment ${data.id === active ? "active" : ""}`}
      >
        <div className="payment-header">
          <div className="payment-maker">
            <span className="payment-maker-icon material-symbols-sharp">
              payments
            </span>{" "}
            <span style={nicknameStyle}>
              {data.nickname ? data.nickname : "Аноним"}
            </span>
          </div>
          <div className="payment-time">
            {data.isRelativeTime && (
              <span className="material-symbols-sharp">history</span>
            )}
            {!data.isRelativeTime && (
              <span className="material-symbols-sharp">schedule</span>
            )}
            {data.displayedTime}
          </div>
          <button
            className="stop-button btn btn-outline-light"
            onClick={() => interruptAlert()}
          >
            <span className="material-symbols-sharp">block</span>
          </button>
          <button
            className="replay-button btn btn-outline-light"
            onClick={() => resendAlert(data)}
          >
            <span className="material-symbols-sharp">replay</span>
          </button>
        </div>
        <div className="payment-info">
          <div className="payment-amount">{`\u20BD${data.amount.major}`}</div>
          {data.attachments && data.attachments.length === 1 && (
            <>
              <div className="single-attach-title">
                <span className="material-symbols-sharp">music_note</span>
                {attachmentTitles.get(data.attachments[0])}
              </div>
            </>
          )}
          {data.attachments && data.attachments.length > 1 ? (
            <span className="song-container">
              <span className="song-counter">{data.attachments.length}</span>
              <span className="song-marker material-symbols-sharp">
                music_note
              </span>
            </span>
          ) : null}
        </div>
        {data.message && (
          <div style={messageStyle} className="payment-body">
            {data.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="Payments h-100">
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {background-color: rgb(25,27,27);}`,
        }}
      />
      <div style={{ marginBottom: "5px", marginLeft: "5px" }}>
        <TestAlertPopup config={conf} socket={clientRef.current} />
        <Menu>
          <MenuEventButton
            event="toggleSendAlertPopup"
            text="Send test alert"
          />
        </Menu>
      </div>
      <div>
        <div>{todayPayments.map((data) => paymentList(data))}</div>
        {paymentDates().map((date, number) => {
          return (
            <div key={date}>
              <button
                type="button"
                className="payment-date-button"
                onClick={() => {
                  let target = document.getElementById(`payment_${number}`);
                  let icon = document.getElementById(
                    `payment_${number}_toggler`,
                  );
                  if (target?.classList.contains("visually-hidden")) {
                    target.classList.remove("visually-hidden");
                    icon.innerHTML = "expand_less";
                  } else {
                    target?.classList.add("visually-hidden");
                    icon.innerHTML = "expand_more";
                  }
                }}
              >
                {date}
                <span
                  id={`payment_${number}_toggler`}
                  className="payment-toggler material-symbols-sharp"
                >
                  expand_more
                </span>
              </button>
              <div
                id={`payment_${number}`}
                className="payment-list visually-hidden"
              >
                {dateToPaymentsMap.get(date).map((data) => paymentList(data))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Payments;
