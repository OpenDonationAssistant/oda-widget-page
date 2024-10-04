import React from "react";
import { log } from "../../logging";
import { findSetting } from "../utils";
import classes from "./EventComponent.module.css";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { publish } from "../../socket";
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";

export default function EventComponent({
  active,
  data,
  attachmentTitles,
}: {
  active: boolean;
  data: any;
  attachmentTitles: Map<string, any>;
}) {
  const { recipientId, settings, conf, widgetId } =
    useLoaderData() as WidgetData;

  const musicFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "musicFont",
    value: findSetting(settings, "musicFont", {}),
  });
  const musicStyle = musicFont.calcStyle();
  musicStyle.textDecoration = undefined;
  const messageFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "messageFont",
    value: findSetting(settings, "messageFont", {}),
  });
  const messageStyle = messageFont.calcStyle();
  const headerFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "nicknameFont",
    value: findSetting(settings, "nicknameFont", {}),
  });
  const nicknameStyle = headerFont.calcStyle();
  const amountStyle= headerFont.calcStyle();
  amountStyle.color = undefined;
  amountStyle.background = undefined;
  const timeStyle= headerFont.calcStyle();
  timeStyle.color = undefined;
  timeStyle.background = undefined;

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

  return (
    <>
      {headerFont.createFontImport()}
      {musicFont.createFontImport()}
      {messageFont.createFontImport()}
      <div className={`${classes.payment} ${active ? "active" : ""}`}>
        <div className={`${classes.paymentheader}`}>
          <div className="payment-maker">
            <div
              style={amountStyle}
              className={`${
                classes.paymentamount
              }`}
            >
              {`\u20BD${data.amount.major}`}
            </div>
            <div
              className={`${classes.nickname}`}
              style={nicknameStyle}
            >
              {data.nickname ? data.nickname : "Аноним"}
            </div>
          </div>
          <div
            style={timeStyle}
            className={`${classes.paymenttime}`}
          >
            {data.displayedTime}
          </div>
          <button
            className={`${classes.stopbutton} oda-btn-default`}
            onClick={() => interruptAlert()}
          >
            <span className="material-symbols-sharp">block</span>
          </button>
          <button
            className={`${classes.replaybutton} oda-btn-default`}
            onClick={() => resendAlert(data)}
          >
            <span className="material-symbols-sharp">replay</span>
          </button>
        </div>
        <div
          className={`${classes.paymentinfo} ${
            data.attachments && data.attachments.length > 1
              ? classes.padded
              : ""
          }`}
        >
          {data.attachments &&
            data.attachments.map((attach) => {
              const music = attachmentTitles.get(attach);
              if (!music) {
                return null;
              }
              return (
                <div
                  key={attach}
                  style={musicStyle}
                  className={`${classes.singleattachtitle}`}
                  onClick={() => window.open(music.url)}
                >
                  <span className="material-symbols-sharp">music_note</span>
                  {music.title}
                </div>
              );
            })}
        </div>
        {data.message && (
          <div style={messageStyle} className={`${classes.paymentbody}`}>
            {data.message}
          </div>
        )}
      </div>
    </>
  );
}
