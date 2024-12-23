import { Trans } from "react-i18next";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";
import { Alert, FixedDonationAmountTrigger, RangeDonationAmountTrigger, UnknownTrigger } from "./Alerts";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { log } from "../../../../logging";
import { Select } from "antd";

const GeneralTab = observer(({ alert }: { alert: Alert }) => {
  log.debug({ alerts: alert }, "render general tab");
  const [amount, setAmount] = useState<number>(() => {
    if (alert.triggers.at(0)?.type === "fixed-donation-amount") {
      return alert.triggers.at(0).amount;
    }
    if (alert.triggers.at(0)?.type === "at-least-donation-amount") {
      return alert.triggers.at(0).min;
    }
    return 0;
  });
  const updateAmount = (amount: number) => {
    log.debug({ triggers: alert.triggers }, "set amount");
    if (alert.triggers.at(0)?.type === "fixed-donation-amount") {
      alert.triggers.at(0).amount = amount;
    }
    if (alert.triggers.at(0)?.type === "at-least-donation-amount") {
      alert.triggers.at(0).min = amount;
    }
    setAmount(amount);
  };

  return (
    <>
      <div className="settings-item">
        <LabeledContainer displayName="tab-alert-trigger">
          <Select
            value={alert.triggers.at(0)?.type}
            className="full-width"
            onChange={(e) => {
              switch (e) {
                case "fixed-donation-amount":
                  alert.triggers.splice(
                    0,
                    1,
                    new FixedDonationAmountTrigger({ amount: amount }),
                  );
                  break;
                case "at-least-donation-amount":
                  alert.triggers.splice(
                    0,
                    1,
                    new RangeDonationAmountTrigger({ min: amount, max: null }),
                  );
                  break;
                default:
                  alert.triggers.splice(0, 1, new UnknownTrigger());
                  break;
              }
            }}
            options={[
              {
                value: "fixed-donation-amount",
                label: <Trans i18nKey={"когда сумма доната равна"} />,
              },
              {
                value: "at-least-donation-amount",
                label: <Trans i18nKey={"когда сумма доната больше"} />,
              },
              {
                value: "never",
                label: <Trans i18nKey={"никогда"} />,
              },
            ]}
          />
        </LabeledContainer>
      </div>
      {alert.triggers.at(0)?.type === "fixed-donation-amount" && (
        <LabeledContainer displayName="">
          <InputNumber
            value={alert.triggers.at(0)?.amount}
            addon="руб."
            onChange={(newAmount) => {
              if (!newAmount) {
                return;
              }
              updateAmount(newAmount);
            }}
          />
        </LabeledContainer>
      )}
      {alert.triggers.at(0)?.type === "at-least-donation-amount" && (
        <LabeledContainer displayName="">
          <InputNumber
            value={alert.triggers.at(0)?.min}
            addon="руб."
            onChange={(newAmount) => {
              if (!newAmount) {
                return;
              }
              updateAmount(newAmount);
            }}
          />
        </LabeledContainer>
      )}
    </>
  );
});

export default GeneralTab;
