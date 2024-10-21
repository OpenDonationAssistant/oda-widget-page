import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import classes from "./ReelItemListProperty.module.css";
import { observer } from "mobx-react-lite";

const ReelItemListPropertyComponent = observer(
  ({ property }: { property: ReelItemListProperty }) => {
    return (
      <div className="widget-settings-item">
        <label className="widget-settings-name">Призы</label>
        <div className={classes.optionscontainer}>
          {property.value &&
            property.value.map((option, number) => (
              <>
                <div className={classes.option}>
                  <textarea
                    key={number}
                    value={option}
                    className="widget-settings-value"
                    style={{ width: "100%" }}
                    onChange={(e) =>
                      property.updateOption(number, e.target.value)
                    }
                  />
                  <button
                    className="widget-button"
                    onClick={() => {
                      property.removeOption(number);
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
                property.addOption();
              }}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export class ReelItemListProperty extends DefaultWidgetProperty<string[]> {
  constructor() {
    super({
      name: "optionList",
      value: ["Ничего", "Выигрыш"],
      displayName: "Призы",
    });
  }

  addOption() {
    this.value.push("");
  }

  updateOption(index: number, value: string): void {
    this.value.splice(index, 1, value);
  }

  removeOption(index: number): void {
    this.value.splice(index, 1);
  }

  markup(): ReactNode {
    return <ReelItemListPropertyComponent property={this} />;
  }
}
