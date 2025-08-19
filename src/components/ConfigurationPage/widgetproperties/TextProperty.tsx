import { ChangeEvent, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import classes from "./TextProperty.module.css";

export const TextPropertyRawComponent = observer(
  ({
    displayName,
    value,
    onChange,
    size,
  }: {
    displayName: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    size?: "small" | "normal";
  }) => {
    return (
      <LabeledContainer displayName={displayName}>
        <textarea
          className={`${classes.text} ${"small" === size ? classes.small : classes.normal}`}
          value={value}
          onChange={onChange}
        />
      </LabeledContainer>
    );
  },
);

const TextPropertyComponent = observer(
  ({ property }: { property: TextProperty }) => {
    return (
      <TextPropertyRawComponent
        displayName={property.displayName}
        value={property.value}
        onChange={(e) => {
          property.value = e.target.value;
        }}
      />
    );
  },
);

export class TextProperty extends DefaultWidgetProperty<string> {
  markup(): ReactNode {
    return <TextPropertyComponent property={this} />;
  }

  public copy(): TextProperty {
    return new TextProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      help: this.help,
    });
  }
}
