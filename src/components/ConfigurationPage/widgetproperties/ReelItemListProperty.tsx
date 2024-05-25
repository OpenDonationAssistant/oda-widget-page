import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import classes from "./ReelItemListProperty.module.css";

export class ReelItemListProperty extends DefaultWidgetProperty {
  constructor(widgetId: string, value: string[]) {
    super(widgetId, "optionList", "predefined", value, "Призы", "prizes");
  }

  addOption(updateConfig: Function) {
    this.value.push("");
    updateConfig(this.widgetId, "optionList", this.value);
  }

  updateOption(index: number, value: string, updateConfig: Function) {
    const updated = this.value.toSpliced(index, 1, value);
    updateConfig(this.widgetId, "optionList", updated);
  }

  removeOption(index: number, updateConfig: Function) {
    const updated = this.value.toSpliced(index, 1);
    updateConfig(this.widgetId, "optionList", updated);
  }

  copy() {
    return new ReelItemListProperty(this.widgetId, this.value);
  }

  markup(updateConfig: Function): ReactNode {
    console.log(this.value);
    return (
      <div className="widget-settings-item">
        <label className="widget-settings-name">Призы</label>
        <div className={classes.optionscontainer}>
          {this.value &&
            this.value.map((option, number) => (
              <>
                <div className={classes.option}>
                  <textarea
                    key={number}
                    value={option}
                    className="widget-settings-value"
                    style={{ width: "100%" }}
                    onChange={(e) =>
                      this.updateOption(number, e.target.value, updateConfig)
                    }
                  />
                  <button
                    className="widget-button"
                    onClick={() => {
                      this.removeOption(number, updateConfig);
                    }}
                  >
                    <span className="material-symbols-sharp">delete</span>
                  </button>
                </div>
              </>
            ))}
          <div className={classes.addbuttoncontainer}>
            <button
              className="widget-button"
              style={{ width: "100%" }}
              onClick={() => {
                this.addOption(updateConfig);
              }}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    );
  }
}
