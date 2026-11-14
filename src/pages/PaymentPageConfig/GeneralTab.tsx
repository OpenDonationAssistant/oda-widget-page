import classes from "./common.module.css";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import { Input, Flex, QRCode } from "antd";
import { useTranslation } from "react-i18next";

export default function GeneralTab({ config }: { config: PaymentPageConfig }) {
  const { t } = useTranslation();
  return (
    <>
      <div className={classes.widgetsettingsitem}>
        <div className={classes.widgetsettingsname}>
          {t("payment-page-address")}
        </div>
        <a
          href={`https://${config.recipientId}.oda.digital/`}
          className={classes.url}
        >
          https://{config.recipientId}.oda.digital/
        </a>
      </div>
      <Flex justify="flex-end">
        <div className={`${classes.qrholder}`}>
          <QRCode
            color="var(--oda-panel-backgroun-color)"
            icon="https://api.oda.digital/public/logo.png"
            value={`https://${config.recipientId}.oda.digital/`}
          />
        </div>
      </Flex>
      <div className={classes.widgetsettingsitem}>
        <div className={classes.widgetsettingsname}>
          {t("payment-page-button-text")}
        </div>
        <Input
          value={config.payButtonText}
          className={classes.widgetsettingsvalue}
          style={{ width: "250px" }}
          onChange={(e) => {
            config.payButtonText = e.target.value;
          }}
        />
      </div>
      <div className={classes.widgetsettingsitem}>
        <div className={classes.widgetsettingsname}>
          {t("payment-page-minimal-amount")}
        </div>
        <InputNumber
          value={config.minimalAmount}
          onChange={(value) => {
            config.minimalAmount = Number(value);
          }}
        />
      </div>
    </>
  );
}
