import { log } from "../../logging";
import classes from "./EventComponent.module.css";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Flex } from "antd";
import { useContext } from "react";
import { PaymentsWidgetSettingsContext } from "../../components/ConfigurationPage/widgetsettings/PaymentsWidgetSettings";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";

export default function EventComponent({
  active,
  data,
  attachmentTitles,
}: {
  active: boolean;
  data: any;
  attachmentTitles: Map<string, any>;
}) {
  const { conf } = useLoaderData() as WidgetData;
  const settings = useContext(PaymentsWidgetSettingsContext);
  const { publish } = useContext(WidgetSettingsContext);

  const musicFont = settings.musicFontProperty;
  const musicStyle = musicFont.calcStyle();
  musicStyle.textDecoration = undefined;
  const messageFont = settings.messageFontProperty;
  const messageStyle = messageFont.calcStyle();
  const headerFont = settings.nicknameFontProperty;
  const nicknameStyle = headerFont.calcStyle();
  const amountStyle = headerFont.calcStyle();
  amountStyle.color = undefined;
  amountStyle.background = undefined;
  const timeStyle = headerFont.calcStyle();
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
            <div style={amountStyle} className={`${classes.paymentamount}`}>
              {`\u20BD${data.amount.major}`}
            </div>
            <div className={`${classes.nickname}`} style={nicknameStyle}>
              {data.nickname ? data.nickname : "Аноним"}
            </div>
          </div>
          <Flex gap={5}>
            <div style={timeStyle} className={`${classes.paymenttime}`}>
              {data.displayedTime}
            </div>
            <button
              className={`${classes.stopbutton}`}
              onClick={() => interruptAlert()}
            >
              <span className="material-symbols-sharp">block</span>
            </button>
            <button
              className={`${classes.replaybutton}`}
              onClick={() => resendAlert(data)}
            >
              <span className="material-symbols-sharp">replay</span>
            </button>
          </Flex>
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
