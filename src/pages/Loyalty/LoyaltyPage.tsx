import { Tabs } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { LoyaltySettingsTab } from "./LoyaltySettingsTab";
import { LoyaltyViewersTab } from "./LoyaltyViewersTab";

const LoyaltyPage = observer(() => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("menu-loyalty")}</h1>
      <Tabs
        type="card"
        items={[
          {
            label: t("loyalty-tab-settings"),
            key: "settings",
            children: <LoyaltySettingsTab />,
          },
          {
            label: t("loyalty-tab-viewers"),
            key: "viewers",
            children: <LoyaltyViewersTab />,
          },
        ]}
      />
    </>
  );
});

export default LoyaltyPage;
