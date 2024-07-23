import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import ModalButton from "../../ModalButton/ModalButton";

export class TextProperty extends DefaultWidgetProperty {
  constructor(
    widgetId: string,
    name: string,
    type: string,
    value: any,
    displayName: string,
    tab?: string | undefined,
  ) {
    super(widgetId, name, type, value, displayName, tab);
  }

  copy() {
    return new TextProperty(
      this.widgetId,
      this.name,
      this.type,
      this.value,
      this.displayName,
      this.tab,
    );
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <ModalButton
        modalTitle={this.displayName}
        buttonLabel="button-settings"
        label={this.displayName}
      >
        <div className="textarea-container">
          <textarea
            className="widget-settings-value"
            value={this.value}
            onChange={(e) =>
              updateConfig(this.widgetId, this.name, e.target.value)
            }
          />
        </div>
      </ModalButton>
    );
  }
}
