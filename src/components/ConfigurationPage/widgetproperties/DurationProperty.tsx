import { observer } from "mobx-react-lite";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { ReactNode } from "react";

const DurationPropertyComponent = observer(({}) => {
  return <></>;
});

export class DurationProperty extends DefaultWidgetProperty<number> {

  copy() {
    return new DurationProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
    });
  }

  markup(): ReactNode {
    return <DurationPropertyComponent />;
  }

}
