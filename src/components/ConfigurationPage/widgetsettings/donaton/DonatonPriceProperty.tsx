import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { Flex, Select } from "antd";
import { produce } from "immer";
import { toJS } from "mobx";
import InputNumber from "../../components/InputNumber";
import classes from "./DonatonPriceProperty.module.css";
import { useTranslation } from "react-i18next";

const DonationPricePropertyComponent = observer(
  ({ property }: { property: DonatonPriceProperty }) => {
    const { t } = useTranslation();
    return (
      <>
        <LabeledContainer displayName="donaton-price-ratio" help={property.help}>
          <Flex
            className="full-width"
            gap={10}
            align="center"
            justify="flex-end"
          >
            <Select
              value={property.value.unit}
              className={`${classes.unitselector}`}
              onChange={(value) => {
                property.value = produce(toJS(property.value), (draft) => {
                  draft.unit = value;
                });
              }}
              options={[
                { label: t("donaton-unit-minute"), value: "MIN" },
                { label: t("donaton-unit-10-minutes"), value: "10MIN" },
                { label: t("donaton-unit-hour"), value: "HOUR" },
                { label: t("donaton-unit-day"), value: "DAY" },
              ]}
            />
            <span className={`${classes.equalsign}`}>=</span>
            <InputNumber
              className={`${classes.price}`}
              value={property.value.price}
              addon="RUB"
              onChange={(value) => {
                property.value = produce(toJS(property.value), (draft) => {
                  draft.price = value;
                });
              }}
            />
          </Flex>
        </LabeledContainer>
      </>
    );
  },
);

interface DonationPrice {
  price: number;
  unit: string;
}

export class DonatonPriceProperty extends DefaultWidgetProperty<DonationPrice> {
  constructor() {
    super({
      name: "price",
      value: {
        price: 100,
        unit: "HOUR",
      },
      displayName: "widget-donation-price",
      help: "donaton-price-help",
    });
  }

  public copy(){
    return new DonatonPriceProperty();
  }

  markup(): ReactNode {
    return <DonationPricePropertyComponent property={this} />;
  }
}
