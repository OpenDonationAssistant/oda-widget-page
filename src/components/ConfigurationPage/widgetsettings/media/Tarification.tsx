import { observer } from "mobx-react-lite";
import { Segmented } from "antd";
import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";
import SmallLabeledContainer from "../../../SmallLabeledContainer/SmallLabeledContainer";

export interface TarificationValue {
  method: "perMinute" | "perLink";
  cost: number;
}

const TarificationComponent = observer(
  ({ property }: { property: Tarification }) => {
    return (
      <>
        <LabeledContainer displayName="Стоимость видео">
          <SmallLabeledContainer displayName="Рассчитывать за">
            <Segmented
              className="full-width"
              options={[
                {
                  label: "За минуту",
                  value: "perMinute",
                },
                {
                  label: "За ссылку",
                  value: "perLink",
                },
              ]}
              value={property.value.method}
              onChange={(update) => {
                property.value.method = update as TarificationValue["method"];
              }}
            />
          </SmallLabeledContainer>
          <SmallLabeledContainer
            displayName={
              property.value.method === "perMinute"
                ? "Стоимость минуты"
                : "Стоимость одной ссылки"
            }
          >
            <InputNumber
              value={property.value.cost ?? 0}
              onChange={(update) => (property.value.cost = update)}
              addon="RUB."
            />
          </SmallLabeledContainer>
        </LabeledContainer>
      </>
    );
  },
);

export class Tarification extends DefaultWidgetProperty<TarificationValue> {
  constructor() {
    super({
      name: "tarification",
      value: {
        method: "perLink",
        cost: 100,
      },
      displayName: "Стоимость видео",
    });
  }

  markup(): ReactNode {
    return <TarificationComponent property={this} />;
  }
}
