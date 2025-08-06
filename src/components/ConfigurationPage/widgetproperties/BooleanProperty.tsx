import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import { log } from "../../../logging";
import { LightLabeledSwitchComponent } from "../../LabeledSwitch/LabeledSwitchComponent";

const BooleanPropertyComponent = observer(
  ({ property }: { property: BooleanProperty }) => {
    log.debug({ property: property }, "rendering property");
    return (
      <Flex>
        <LightLabeledSwitchComponent
          value={property.value}
          label={property.displayName}
          onChange={() => {
            property.value = !property.value;
          }}
        />
      </Flex>
    );
  },
);

export class BooleanProperty extends DefaultWidgetProperty<boolean> {
  private _labels: { on: string; off: string };

  constructor(params: {
    name: string;
    value: boolean;
    displayName: string;
    help?: string;
    labels?: { on: string; off: string };
  }) {
    super({
      name: params.name,
      value: params.value,
      displayName: params.displayName,
      help: params.help,
    });
    this._labels = params.labels
      ? params.labels
      : { on: "Включено", off: "Выключено" };
  }

  copy() {
    return new BooleanProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      help: this.help,
    });
  }

  markup(): ReactNode {
    return <BooleanPropertyComponent property={this} />;
  }

  public get labels() {
    return this._labels;
  }
}
