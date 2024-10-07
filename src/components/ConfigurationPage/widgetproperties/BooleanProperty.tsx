import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import classes from "./BooleanProperty.module.css";
import { Switch } from "antd";

export class BooleanProperty extends DefaultWidgetProperty<boolean> {
  constructor(params: { name: string; value: boolean; displayName: string }) {
    super({
      name: params.name,
      value: params.value,
      displayName: params.displayName,
    });
  }

  comp = observer(() => (
    <LabeledContainer displayName={this.displayName}>
      <div className={classes.checkboxwrapper}>
        <Switch
          checked={true === this.value}
          onChange={() => {
            this.value = !this.value;
          }}
        />
      </div>
    </LabeledContainer>
  ));

  markup(): ReactNode {
    return <this.comp />;
  }
}
