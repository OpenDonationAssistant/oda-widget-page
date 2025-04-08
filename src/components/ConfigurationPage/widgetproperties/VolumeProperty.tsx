import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import Slider from "rc-slider";

const VolumePropertyComponent = observer(
  ({ property }: { property: VolumeProperty }) => {
    return (
      <LabeledContainer displayName="Громкость">
        <Slider
          min={1}
          max={100}
          defaultValue={100}
          value={property.value}
          onChange={(value) => {
            property.value = value as number;
          }}
        />
      </LabeledContainer>
    );
  },
);

export class VolumeProperty extends DefaultWidgetProperty<number> {
  constructor({
    name,
    value,
    displayName,
  }: {
    name: string;
    value?: number;
    displayName?: string;
  }) {
    super({
      name: name,
      value: value ?? 100,
      displayName: displayName ?? "Громкость",
    });
  }

  markup(): ReactNode {
    return <VolumePropertyComponent property={this} />;
  }

  public copy(): VolumeProperty {
    return new VolumeProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
    });
  }
}
