import classes from "./common.module.css";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import { Input, Button, Flex } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function SocialsSection({
  config,
}: {
  config: PaymentPageConfig;
}) {
  const { t } = useTranslation();
  return (
    <div className={classes.widgetsettingsitem}>
      <div className={classes.widgetsettingsname}>
        {t("payment-page-socials")}
      </div>
      <div style={{ width: "60%" }}>
        {config.socials.map((social, index) => {
          const [[name, link]] = Array.from(social.entries());
          return (
            <Flex key={index} gap={8} align="center" style={{ marginBottom: 8 }}>
              <Input
                placeholder={t("common-name")}
                value={name}
                onChange={(e) => {
                  const newSocials = [...config.socials];
                  newSocials[index] = new Map([[e.target.value, link]]);
                  config.deleteSocial(name);
                  config.addSocial(e.target.value, link);
                }}
                style={{ width: "45%" }}
              />
              <Input
                placeholder={t("payment-page-link")}
                value={link}
                onChange={(e) => {
                  config.deleteSocial(name);
                  config.addSocial(name, e.target.value);
                }}
                style={{ width: "45%" }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => config.deleteSocial(name)}
              />
            </Flex>
          );
        })}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => config.addSocial("", "")}
          block
        >
          {t("payment-page-add-social")}
        </Button>
      </div>
    </div>
  );
}
