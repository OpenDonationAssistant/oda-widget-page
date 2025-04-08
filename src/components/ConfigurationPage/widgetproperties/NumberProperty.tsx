import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import InputNumber from "../components/InputNumber";

export class NumberProperty extends DefaultWidgetProperty<number> {
  private _addon: ReactNode | undefined;

  constructor({
    name,
    value,
    displayName,
    addon,
  }: {
    name: string;
    value: number;
    displayName: string;
    addon?: ReactNode;
  }) {
    super({ name, value, displayName });
    this._addon = addon;
  }

  copy(){
    return new NumberProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      addon: this._addon
    });
  }

  comp = observer(() => {
    return (
      <LabeledContainer displayName={this.displayName}>
        <InputNumber
          value={this.value}
          addon={this._addon}
          onChange={(newValue) => {
            if (newValue === null) {
              return;
            }
            this.value = newValue;
          }}
        />
      </LabeledContainer>
    );
  });

  markup(): ReactNode {
    return <this.comp />;
  }
}
