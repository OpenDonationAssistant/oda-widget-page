import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { Flex, Select } from "antd";
import { produce } from "immer";
import { toJS } from "mobx";
import InputNumber from "../../components/InputNumber";
import classes from "./DonatonPriceProperty.module.css";

const DonationPricePropertyComponent = observer(
  ({ property }: { property: DonatonPriceProperty }) => {
    return (
      <>
        <LabeledContainer displayName="Соотношение" help={property.help}>
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
                { label: "Минута", value: "MIN" },
                { label: "10 Минут", value: "10MIN" },
                { label: "Час", value: "HOUR" },
                { label: "Сутки", value: "DAY" },
              ]}
            />
            <span className={`${classes.equalsign}`}>=</span>
            <div>
              <InputNumber
                value={property.value.price}
                addon="RUB"
                onChange={(value) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.price = value;
                  });
                }}
              />
            </div>
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

// TODO: 18n
export class DonatonPriceProperty extends DefaultWidgetProperty<DonationPrice> {
  constructor() {
    super({
      name: "price",
      value: {
        price: 100,
        unit: "HOUR",
      },
      displayName: "widget-donation-price",
      help: "Соотношение, исходя из которого будет добавляться время к таймеру. Например, если 1 час = 360 рублей, то в пересчете на один рубль, (60*60)/360=10 секунд за 1 рубль доната. Округление всегда вверх.",
    });
  }

  markup(): ReactNode {
    return <DonationPricePropertyComponent property={this} />;
  }
}
