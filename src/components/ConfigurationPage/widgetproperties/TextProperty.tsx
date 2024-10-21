import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import ModalButton from "../../ModalButton/ModalButton";
import { observer } from "mobx-react-lite";

const TextPropertyComponent = observer(
  ({ property }: { property: TextProperty }) => {
    return (
      <ModalButton
        modalTitle={property.displayName}
        buttonLabel="button-settings"
        label={property.displayName}
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
}
