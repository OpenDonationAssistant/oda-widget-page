import { observer } from "mobx-react-lite";
import { Segmented } from "antd";
import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";
import SmallLabeledContainer from "../../../SmallLabeledContainer/SmallLabeledContainer";
import { useTranslation } from "react-i18next";

export interface TarificationValue {
  method: "perMinute" | "perLink";
  cost: number;
}

const TarificationComponent = observer(
  ({ property }: { property: Tarification }) => {
    const { t } = useTranslation();
    return (
      <>
        <LabeledContainer displayName="media-video-price">
          <SmallLabeledContainer displayName="media-count-per">
            <Segmented
              className="full-width"
              options={[
                {
                  label: t("media-per-minute"),
                  value: "perMinute",
                },
                {
                  label: t("media-per-link"),
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
                ? "media-minute-price"
                : "media-link-price"
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
      displayName: "media-video-price",
    });
  }

  markup(): ReactNode {
    return <TarificationComponent property={this} />;
  }
}
