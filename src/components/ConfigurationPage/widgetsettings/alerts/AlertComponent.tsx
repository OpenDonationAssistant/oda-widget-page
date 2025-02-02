import { Alert } from "./Alerts";
import { useTranslation } from "react-i18next";
import { Tabs as AntTabs, Flex } from "antd";
import { observer } from "mobx-react-lite";
import { log } from "../../../../logging";
import { toJS } from "mobx";
import ImageTab from "./ImageTab";
import GeneralTab from "./GeneralTab";
import classes from "./AlertComponent.module.css";
import { ResizableBox } from "react-resizable";
import { HeaderTab } from "./HeaderTab";
import { MessageTab } from "./MessageTab";
import { SoundTab } from "./SoundTab";
import { VoiceTab } from "./VoiceTab";

export const AlertComponent = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  log.debug({ alert: toJS(alert) }, "render alert");

  return (
    <div key={alert.id} className="payment-alerts-previews-item">
      <Flex justify="space-around" className={`${classes.preview}`}>
        <ResizableBox
          width={650}
          height={350}
          className={`${classes.resizable}`}
          axis="both"
          minConstraints={[650, 100]}
        >
          <div style={{ maxWidth: "100%" }}></div>
        </ResizableBox>
      </Flex>
      <AntTabs
        type="card"
        tabPosition="top"
        items={[
          {
            key: "trigger",
            label: t("General"),
            children: [<GeneralTab alert={alert} />],
          },
          {
            key: "image",
            label: t("tab-alert-image"),
            children: [<ImageTab alert={alert} />],
          },
          {
            key: "sound",
            label: t("tab-alert-audio"),
            children: [<SoundTab alert={alert} />],
          },
          {
            key: "header",
            label: t("tab-alert-title"),
            children: [<HeaderTab alert={alert} />],
          },
          {
            key: "message",
            label: t("tab-alert-message"),
            children: [<MessageTab alert={alert} />],
          },
          {
            key: "voice",
            label: t("tab-alert-voice"),
            children: [<VoiceTab alert={alert} />],
          },
        ]}
      />
    </div>
  );
});
