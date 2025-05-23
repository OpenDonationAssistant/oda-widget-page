import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import ModalButton from "../../ModalButton/ModalButton";
import { observer } from "mobx-react-lite";

const TextPropertyComponent = observer(
  ({ property }: { property: TextProperty }) => {
    return (
      <ModalButton
        modalTitle={property.displayName}
        buttonLabel="button-edit"
        label={property.displayName}
        help={property.help}
        icon="edit"
      >
        <div className="textarea-container">
          <textarea
            className="widget-settings-value"
            value={property.value}
            onChange={(e) => {
              property.value = e.target.value;
            }}
          />
        </div>
      </ModalButton>
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
