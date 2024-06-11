import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Divider } from "antd";
import classes from "./DonatersTopListLayoutProperty.module.css";

export class DonatersTopListLayoutProperty extends DefaultWidgetProperty {
  constructor(widgetId: string, value: string) {
    super(widgetId, "layout", "predefined", value, "Компоновка", "layout");
  }

  copy(): DonatersTopListLayoutProperty {
    return new DonatersTopListLayoutProperty(this.widgetId, this.value);
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <>
        <div key={this.name} className="widget-settings-item">
          <div className="widget-settings-radiocontainer">
            <div
              className={`${classes.radiobutton} ${
                this.value === "vertical" ? classes.selected : ""
              }`}
              onClick={() => {
                updateConfig(this.widgetId, this.name, "vertical");
              }}
            >
              <img title="vertical" src={`/icons/vertical.jpg`} />
              <div className={`${classes.layoutdescription}`}>
                Список ников будет располагаться вертикально
              </div>
            </div>
            <div
              className={`${classes.radiobutton} ${this.value === "horizontal" ? classes.selected : ""}`}
              onClick={() => {
                updateConfig(this.widgetId, this.name, "horizontal");
              }}
            >
              <img title="horizontal" src={`/icons/horizontal.jpg`} />
              <div
                className={`${classes.layoutdescription}`}
              >
                Список ников будет располагаться в одну линию
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
