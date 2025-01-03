import classes from "./common.module.css";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import { Input, Flex, QRCode } from "antd";

export default function GeneralTab({ config }: { config: PaymentPageConfig }) {
  return (
    <>
      <div className={classes.widgetsettingsitem}>
        <div className={classes.widgetsettingsname}>Адрес страницы</div>
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
            color="#2b3566"
            icon="https://api.oda.digital/public/logo.png"
            value={`https://${config.recipientId}.oda.digital/`}
          />
        </div>
      </Flex>
      <div className={classes.widgetsettingsitem}>
        <div className={classes.widgetsettingsname}>
          Текст кнопки "Задонатить"
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
          Минимальная сумма доната
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
