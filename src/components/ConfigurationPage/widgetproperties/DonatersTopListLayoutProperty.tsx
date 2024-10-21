import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import classes from "./DonatersTopListLayoutProperty.module.css";
import { Trans } from "react-i18next";
import { observer } from "mobx-react-lite";

const DonatersTopListLayoutPropertyComponent = observer(
  ({ property }: { property: DonatersTopListLayoutProperty }) => {
    return (
      <>
        <div key={property.name} className="widget-settings-item">
          <div className="widget-settings-radiocontainer">
            <div
              className={`${classes.radiobutton} ${
                property.value === "vertical" ? classes.selected : ""
              }`}
              onClick={() => {
                property.value = "vertical";
              }}
            >
              <img title="vertical" src={`/icons/vertical.jpg`} />
              <div className={`${classes.layoutdescription}`}>
                <Trans i18nKey="widget-donaterslist-list-vertical-layout" />
              </div>
            </div>
            <div
              className={`${classes.radiobutton} ${
                property.value === "horizontal" ? classes.selected : ""
              }`}
              onClick={() => {
                property.value = "horizontal";
              }}
            >
              <img title="horizontal" src={`/icons/horizontal.jpg`} />
              <div className={`${classes.layoutdescription}`}>
                <Trans i18nKey="widget-donaterslist-list-horizontal-layout" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

export class DonatersTopListLayoutProperty extends DefaultWidgetProperty<string> {
  constructor() {
    super({ name: "layout", displayName: "Компоновка", value: "vertical" });
  }

  markup(): ReactNode {
    return <DonatersTopListLayoutPropertyComponent property={this} />;
  }
}
