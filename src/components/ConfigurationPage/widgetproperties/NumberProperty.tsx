import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { InputNumber } from "antd";
import classes from "./NumberProperty.module.css";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Notifier } from "../Notifier";
import { observer } from "mobx-react-lite";

export class NumberProperty extends DefaultWidgetProperty<number> {
  constructor({
    name,
    value,
    displayName,
  }: {
    name: string;
    value: any;
    displayName: string;
  }) {
    super({ name, value, displayName});
  }

  comp = observer(() => {
    return (
      <LabeledContainer displayName={this.displayName}>
        <InputNumber
          value={this.value}
          className={`${classes.value} full-width`}
          onChange={(value) => {
            this.value = value ? value : 0;
          }}
        />
      </LabeledContainer>
    );
  });

  markup(): ReactNode {
    return <this.comp />;
  }

}
