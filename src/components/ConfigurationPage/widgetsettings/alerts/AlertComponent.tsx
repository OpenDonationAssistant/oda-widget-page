import { Alert } from "./Alerts";
import { useTranslation } from "react-i18next";
import { Tabs as AntTabs, Flex, Select } from "antd";
import { observer } from "mobx-react-lite";
import ImageTab from "./ImageTab";
import GeneralTab from "./GeneralTab";
import { HeaderTab } from "./HeaderTab";
import { MessageTab } from "./MessageTab";
import { SoundTab } from "./SoundTab";
import { VoiceTab } from "./VoiceTab";
import { LayoutTab } from "./LayoutTab";
import classes from "./AlertComponent.module.css";
import { CloseOverlayButton, ModalStateContext } from "../../../Overlay/Overlay";
import { EditableString } from "../../../RenamableLabel/EditableString";
import SubActionButton from "../../../SubActionButton/SubActionButton";
import { ResizableBox } from "react-resizable";
import SecondaryButton from "../../../SecondaryButton/SecondaryButton";
import PrimaryButton from "../../../PrimaryButton/PrimaryButton";
import PaymentAlerts from "../../../../pages/Alerts/PaymentAlerts";
import { DemoAlertController } from "../../../../pages/Alerts/DemoAlertController";
import { DemoTokenStore } from "../../../../stores/TokenStore";
import { useContext, useState } from "react";
import { WidgetContext } from "../../../../types/Widget";
import { reaction } from "mobx";
import { log } from "../../../../logging";
import { PresetStoreContext } from "../../../../stores/PresetStore";

const SaveButtons = observer(({}) => {
  const widget = useContext(WidgetContext);
  const dialog = useContext(ModalStateContext);

  log.debug({widget: widget}, "Load save buttons for widget preview");

  reaction(() => widget?.config.unsaved, () => {
    log.debug({unsaved: widget?.config.unsaved},"tracking unsaved");
  });

  return (
    <Flex className="full-width" justify="flex-end" gap={9}>
      <SecondaryButton
        onClick={() => {
          widget?.reload();
          dialog.show = false;
        }}
      >
        Отменить
      </SecondaryButton>
      <PrimaryButton
        disabled={!widget?.config.unsaved}
        onClick={() => {
          widget?.save();
        }}
      >
        Сохранить
      </PrimaryButton>
    </Flex>
  );
});

export const AlertComponent = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  const [alertController] = useState<any>(
    () => new DemoAlertController(alert, ""),
  );
  const presetStore = useContext(PresetStoreContext);

  return (
    <Flex key={alert.id} vertical style={{ height: "100%" }}>
      <Flex
        justify="space-between"
        className={`${classes.alerttitle}`}
        align="top"
      >
        <EditableString
          label={alert.property("name")}
          onChange={(value) => alert.set("name", value)}
        />
        <CloseOverlayButton />
      </Flex>
      <Flex gap={12} className={`${classes.alertcontainer}`}>
        <Flex vertical className={`${classes.alertsettings}`}>
          <AntTabs
            size="small"
            type="card"
            tabPosition="top"
            items={[
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
        </Flex>
        <Flex vertical className={`${classes.alertpreview}`} gap={9}>
          <Flex
            justify="flex-start"
            gap={9}
            className={`${classes.previewcontainer}`}
          >
            <SubActionButton onClick={() => {}}>Создать шаблон</SubActionButton>
            <SubActionButton onClick={() => {}}>
              Применить шаблон
            </SubActionButton>
          </Flex>
          <Flex justify="space-around" className={`${classes.preview}`}>
            <ResizableBox
              height={-1}
              width={-1}
              className={`${classes.resizable}`}
              axis="both"
              minConstraints={[400, 100]}
            >
              <div style={{ margin: "auto" }}>
                <PaymentAlerts
                  alertController={alertController}
                  tokenStore={new DemoTokenStore()}
                />
              </div>
            </ResizableBox>
          </Flex>
          <SaveButtons />
        </Flex>
      </Flex>
    </Flex>
  );
});
