import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import { Segmented } from "antd";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { useTranslation } from "react-i18next";

const DonatersTopListLayoutPropertyComponent = observer(
  ({ property }: { property: DonatersTopListLayoutProperty }) => {
    const { t } = useTranslation();
    return (
      <>
        <LabeledContainer displayName={property.displayName}>
          <Segmented
            className="full-width"
            options={[
              {
                label: t("vertical"),
                value: "vertical",
              },
              { label: t("horizontal"), value: "horizontal" },
            ]}
            value={property.value}
            onChange={(value) => {
              property.value = value;
            }}
          />
        </LabeledContainer>
      </>
    );
  },
);

export class DonatersTopListLayoutProperty extends DefaultWidgetProperty<string> {
  constructor() {
    super({
      name: "layout",
      displayName: "widget-donaterslist-list-layout",
      value: "vertical",
    });
  }

  copy() {
    const newCopy = new DonatersTopListLayoutProperty();
    newCopy.value = this.value;
    return newCopy;
  }

  markup(): ReactNode {
    return <DonatersTopListLayoutPropertyComponent property={this} />;
  }
}
