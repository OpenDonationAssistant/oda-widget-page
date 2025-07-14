import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import classes from "./TextProperty.module.css";

const TextPropertyComponent = observer(
  ({ property }: { property: TextProperty }) => {
    return (
      <LabeledContainer displayName={property.displayName}>
        <textarea
          className={`${classes.text}`}
          value={property.value}
          onChange={(e) => {
            property.value = e.target.value;
          }}
        />
      </LabeledContainer>
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
