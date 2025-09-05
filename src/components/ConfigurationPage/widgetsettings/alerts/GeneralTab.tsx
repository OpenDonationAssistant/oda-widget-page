import {
  Alert,
  FixedDonationAmountTrigger,
  RangeDonationAmountTrigger,
  UnknownTrigger,
} from "./Alerts";
import { observer } from "mobx-react-lite";
import { AnimationProperty } from "../../widgetproperties/AnimationProperty";
import { DurationProperty } from "./DurationProperty";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { ColorProperty } from "../../widgetproperties/ColorProperty";
import { BackgroundImageProperty } from "../../widgetproperties/BackgroundImageProperty";
import { WidthProperty } from "../../widgetproperties/WidthProperty";
import { Flex, Select } from "antd";
import { Trans } from "react-i18next";
import InputNumber from "../../components/InputNumber";
import { log } from "../../../../logging";
import { useState } from "react";
import { HeightProperty } from "../../widgetproperties/HeightProperty";

const GeneralTab = observer(({ alert }: { alert: Alert }) => {
  const [amount, setAmount] = useState<number>(() => {
    if (alert.triggers.at(0)?.type === "fixed-donation-amount") {
      return (alert.triggers.at(0) as FixedDonationAmountTrigger).amount ?? 0;
    }
    if (alert.triggers.at(0)?.type === "at-least-donation-amount") {
      return (alert.triggers.at(0) as RangeDonationAmountTrigger).min ?? 0;
    }
    return 0;
  });
  const updateAmount = (amount: number) => {
    log.debug({ triggers: alert.triggers }, "set amount");
    if (alert.triggers.at(0)?.type === "fixed-donation-amount") {
      (alert.triggers.at(0) as FixedDonationAmountTrigger).amount = amount;
    }
    if (alert.triggers.at(0)?.type === "at-least-donation-amount") {
      (alert.triggers.at(0) as RangeDonationAmountTrigger).min = amount;
    }
    setAmount(amount);
  };
  return (
    <>
      <div className="settings-item">
        <div style={{ fontSize: "21px" }}>Срабатывает</div>
        <Flex gap={12} justify="space-around">
          <Flex className="full-width">
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
                      new RangeDonationAmountTrigger({
                        min: amount,
                        max: null,
                      }),
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
          </Flex>
          {alert.triggers.at(0)?.type === "fixed-donation-amount" && (
            <div style={{ display: "inline-block", width: "50%" }}>
              <InputNumber
                value={
                  (alert.triggers.at(0) as FixedDonationAmountTrigger)?.amount
                }
                addon="руб."
                onChange={(newAmount) => {
                  if (!newAmount) {
                    return;
                  }
                  updateAmount(newAmount);
                }}
              />
            </div>
          )}
          {alert.triggers.at(0)?.type === "at-least-donation-amount" && (
            <div style={{ display: "inline-block", width: "50%" }}>
              <InputNumber
                value={(alert.triggers.at(0) as RangeDonationAmountTrigger)?.min ?? 0}
                addon="руб."
                onChange={(newAmount) => {
                  if (!newAmount) {
                    return;
                  }
                  updateAmount(newAmount);
                }}
              />
            </div>
          )}
        </Flex>
      </div>
      <div className="settings-item">
        {(alert.get("duration") as DurationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalAppearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalAnimation") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalDisappearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalWidth") as WidthProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalHeight") as HeightProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalBackgroundColor") as ColorProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(
          alert.get("totalBackgroundImage") as BackgroundImageProperty
        )?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalBorder") as BorderProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalRounding") as RoundingProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalPadding") as PaddingProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalShadow") as BoxShadowProperty)?.markup()}
      </div>
    </>
  );
});

export default GeneralTab;
