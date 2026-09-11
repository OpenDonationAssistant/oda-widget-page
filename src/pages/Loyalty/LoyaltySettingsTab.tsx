import { Flex, InputNumber } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../../components/Button/PrimaryButton";
import {
  LoyaltyAction,
  useLoyaltySettingsStore,
} from "./LoyaltySettingsStore";
import classes from "./LoyaltyPage.module.css";

const ACTION_LABEL_KEYS: Record<LoyaltyAction, string> = {
  [LoyaltyAction.FOLLOW]: "loyalty-action-follow",
  [LoyaltyAction.SUBSCRIBE]: "loyalty-action-subscribe",
  [LoyaltyAction.GIFT_SUB]: "loyalty-action-gift-sub",
  [LoyaltyAction.DONATE]: "loyalty-action-donate",
  [LoyaltyAction.RAID]: "loyalty-action-raid",
  [LoyaltyAction.CHAT_MESSAGE]: "loyalty-action-chat-message",
  [LoyaltyAction.WATCH_TIME]: "loyalty-action-watch-time",
};

export const LoyaltySettingsTab = observer(() => {
  const { t } = useTranslation();
  const { store } = useLoyaltySettingsStore();

  return (
    <Flex vertical gap={9} className={`${classes.tabcontainer}`}>
      {store.settings.map((setting) => (
        <Flex
          key={setting.action}
          justify="space-between"
          align="center"
          gap={12}
          className={`${classes.settingitem}`}
        >
          <div className={`${classes.settinglabel}`}>
            {t(ACTION_LABEL_KEYS[setting.action])}
          </div>
          <InputNumber
            min={0}
            value={setting.points}
            addonAfter={t("loyalty-points")}
            onChange={(value) => {
              setting.points = value ?? 0;
            }}
          />
        </Flex>
      ))}
      <Flex justify="flex-end" className="full-width">
        <PrimaryButton onClick={() => store.save()}>
          {t("button-save")}
        </PrimaryButton>
      </Flex>
    </Flex>
  );
});
