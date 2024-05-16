import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";

export class DonatersTopListLayoutProperty extends DefaultWidgetProperty {
  constructor(widgetId: string, value: string) {
    super(widgetId, "layout", "predefined", value, "Компоновка", "content");
  }

  copy(): DonatersTopListLayoutProperty {
    return new DonatersTopListLayoutProperty(this.widgetId, this.value);
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <>
        <div key={this.name} className="widget-settings-item">
          <label className="widget-settings-name">{this.displayName}</label>
          <div className="widget-settings-radiocontainer">
            <label className="widget-settings-radiobutton">
              <input
                title="vertical"
                type="radio"
                value="vertical"
                checked={this.value === "vertical"}
                onChange={(e) =>
                  updateConfig(this.widgetId, this.name, e.target.value)
                }
              />
              <img
                title="vertical"
                src={`/icons/vertical.jpg`}
                onClick={() =>
                  updateConfig(this.widgetId, this.name, "vertical")
                }
              />
            </label>
            <label className="widget-settings-radiobutton">
              <input
                title="horizontal"
                type="radio"
                value="horizontal"
                checked={this.value === "horizontal"}
                onChange={(e) =>
                  updateConfig(this.widgetId, this.name, e.target.value)
                }
              />
              <img
                title="horizontal"
                src={`/icons/horizontal.jpg`}
                onClick={() =>
                  updateConfig(this.widgetId, this.name, "horizontal")
                }
              />
            </label>
          </div>
        </div>
      </>
    );
  }
}
