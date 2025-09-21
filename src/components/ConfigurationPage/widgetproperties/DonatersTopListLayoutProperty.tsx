import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import classes from "./DonatersTopListLayoutProperty.module.css";
import { Trans } from "react-i18next";
import { observer } from "mobx-react-lite";
import { Segmented } from "antd";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";

const DonatersTopListLayoutPropertyComponent = observer(
  ({ property }: { property: DonatersTopListLayoutProperty }) => {
    return (
      <>
        <LabeledContainer displayName="Расположить список">
          <Segmented
            className="full-width"
            options={[
              {
                label: "Вертикально",
                value: "vertical",
              },
              { label: "Горизонтально", value: "horizontal" },
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
    super({ name: "layout", displayName: "Компоновка", value: "vertical" });
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
