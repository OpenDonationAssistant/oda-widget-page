import "./Payments.css";
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  subscribe,
  unsubscribe,
} from "../../socket";
import { log } from "../../logging";
import NewsComponent from "./NewsComponent";
import EventComponent from "./EventComponent";
import { WidgetData } from "../../types/WidgetData";
import classes from "./Payments.module.css";
import Menu from "../../components/Menu/Menu";
import MenuEventButton from "../../components/Menu/MenuEventButton";
import {
  DefaultApiFactory as HistoryService,
} from "@opendonationassistant/oda-history-service-client";

const dateTimeFormat = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  day: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("ru-RU", {
  hour: "numeric",
  minute: "numeric",
});

const Collapse = ({
  active,
  dateToPaymentsMap,
  attachmentTitles,
  date,
  number,
}) => {
  log.debug("rerendering old payments");
  const [hidden, setHidden] = useState<boolean>(true);
  return (
    <div key={date}>
      <button
        type="button"
        className={`${
          hidden
            ? classes.paymentdatebuttonclosed
            : classes.paymentdatebuttonopened
        }`}
        onClick={() => {
          setHidden((prev) => !prev);
        }}
      >
        {date}
        <span
          id={`payment_${number}_toggler`}
          className="payment-toggler material-symbols-sharp"
        >
          {hidden ? "expand_more" : "expand_less"}
        </span>
      </button>
      <div
        id={`payment_${number}`}
        className={`payment-list ${hidden ? "visually-hidden" : ""}`}
      >
        {dateToPaymentsMap.get(date).map((data) => (
          <EventComponent
            key={"event" + data.id}
            active={active === data.id}
            data={data}
            attachmentTitles={attachmentTitles}
          />
        ))}
      </div>
    </div>
  );
};

export default function Payments({}: {}) {
  const [active, setActive] = useState("");
  const [dateToPaymentsMap, setDateToPaymentsMap] = useState(new Map());
  const [todayPayments, setTodayPayments] = useState([]);
  const [attachmentTitles, setAttachmentTitles] = useState(new Map());
  const [paymentDates, setPaymentDates] = useState<any[]>([]);
  const { recipientId, conf, widgetId } =
    useLoaderData() as WidgetData;

  useEffect(() => {
    let timerFunc = setTimeout(() => {
      setTodayPayments((prev) => setDisplayedTimeForTodayPayments(prev));
    }, 10000);
    return () => clearTimeout(timerFunc);
  });

  useEffect(() => {
    updatePayments();
    log.debug("create subscriptions");
    subscribe(widgetId, conf.topic.alerts, (message) => {
      log.debug(`events widgets received: ${message.body}`);
      setTimeout(() => updatePayments(), 3000);
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
    return () => {
      unsubscribe(widgetId, conf.topic.alertStatus);
      unsubscribe(widgetId, conf.topic.alerts);
    };
  }, [recipientId]);

  function setDisplayedTimeForTodayPayments(todayPayments) {
    const now = Date.now();
    return todayPayments.map((payment) => {
      const paymentDate = new Date(payment.authorizationTimestamp);
      if (now - paymentDate > 60 * 60 * 1000) {
        payment.displayedTime = timeFormat.format(paymentDate);
        return payment;
      }
      payment.isRelativeTime = true;
      if (now - paymentDate < 60 * 1000) {
        payment.displayedTime = "Новое"; // TODO: use i18n
        return payment;
      }
      payment.displayedTime =
        Math.floor((now - paymentDate) / (60 * 1000)) + " min";
      return payment;
    });
  }

  function updatePayments() {
    HistoryService(
      undefined,
      process.env.REACT_APP_HISTORY_API_ENDPOINT,
    ).getHistory(
      {
        recipientId: recipientId,
      },
      { params: { size: 20, page: 0 } },
    )
      .then((data) => data.data)
      .then((json) => {
        let updatedDateToPaymentsMap = new Map();
        const today = dateTimeFormat.format(Date.now());
        updatedDateToPaymentsMap.set(today, []);

        const attachQueryString = json.content
          .reduce((attachmentIds, payment) => {
            const paymentAttachIds =
              payment.attachments
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
              updatedAttachmentTitles.set(attach.id, attach);
            });
            setAttachmentTitles(updatedAttachmentTitles);
            log.debug(`${JSON.stringify(updatedAttachmentTitles)}`);
          });

        json.content.forEach((payment) => {
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

        log.debug({ updatedDateToPaymentsMap: updatedDateToPaymentsMap });
        setDateToPaymentsMap((prev) => updatedDateToPaymentsMap);
        setTodayPayments((prev) =>
          setDisplayedTimeForTodayPayments(updatedDateToPaymentsMap.get(today)),
        );
        updatePaymentDates(updatedDateToPaymentsMap);
      });
  }

  function updatePaymentDates(dateToPaymentsMap) {
    const today = dateTimeFormat.format(Date.now());
    const dates = Array.from(dateToPaymentsMap.keys());
    const index = dates.indexOf(today);
    if (index > -1) {
      dates.splice(index, 1);
    }
    log.debug(`using payment dates array: ${JSON.stringify(dates)}`);
    setPaymentDates(dates);
  }

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
body::before {
    content: "";
    position: fixed;
    left: 0;
    right: 0;
    z-index: -1;
    display: block;
    background-color: #0c122e;
    width: 100%;
    height: 100%;
}`,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
#root {
  overflow-y: scroll;
}`,
        }}
      />

      <div style={{ marginBottom: "5px", marginLeft: "5px" }}>
        <Menu>
          <MenuEventButton
            event="toggleSendAlertPopup"
            text="Send test alert"
          />
        </Menu>
      </div>

      <div>
        <NewsComponent />
        <div>
          {todayPayments.map((data) => (
            <EventComponent
              key={data.id}
              active={active == data.id}
              data={data}
              attachmentTitles={attachmentTitles}
            />
          ))}
        </div>
        {paymentDates.map((date, number) => (
          <Collapse
            key={number}
            active={active}
            dateToPaymentsMap={dateToPaymentsMap}
            attachmentTitles={attachmentTitles}
            date={date}
            number={number}
          />
        ))}
      </div>
    </div>
  );
}
