import { Alert } from "./Alerts";
import { useTranslation } from "react-i18next";
import { Tabs as AntTabs, Flex } from "antd";
import { observer } from "mobx-react-lite";
import { log } from "../../../../logging";
import { toJS } from "mobx";
import ImageTab from "./ImageTab";
import GeneralTab from "./GeneralTab";
import { HeaderTab } from "./HeaderTab";
import { MessageTab } from "./MessageTab";
import { SoundTab } from "./SoundTab";
import { VoiceTab } from "./VoiceTab";
import PresetTab from "./PresetTab";
import { LayoutTab } from "./LayoutTab";

export const AlertComponent = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  log.debug({ alert: toJS(alert) }, "render alert");

  return (
    <div key={alert.id} className="payment-alerts-previews-item">
      <AntTabs
        type="card"
        tabPosition="top"
        items={[
          {
            key: "preset",
            label: "Готовые шаблоны",
            children: [<PresetTab alert={alert} />],
          },
          {
            key: "trigger",
            label: t("General"),
            children: [<GeneralTab alert={alert} />],
          },
          {
            key: "layout",
            label: t("Layout"),
            children: [<LayoutTab alert={alert} />],
          },
          {
            key: "sound",
            label: t("tab-alert-audio"),
            children: [<SoundTab alert={alert} />],
          },
          {
            key: "image",
            label: t("tab-alert-image"),
            children: [<ImageTab alert={alert} />],
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
