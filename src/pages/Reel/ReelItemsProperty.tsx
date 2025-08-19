import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";

const ReelItemsPropertyComponent = observer(
  ({ property }: { property: ReelItemsProperty }) => {
    return <></>;
  },
);

export interface ReelItem {
  id: string;
  name: string;
  weight: number;
}

export interface ReelItemsPropertyValue {
  items: 
}

export class ReelItemsProperty extends DefaultWidgetProperty<ReelItemsPropertyValue> {
  constructor() {
    super({
      name: "reelItems",
      value: {},
      displayName: "Призы",
    });
  }

  public copy() {
    return new ReelItemsProperty();
  }

  markup(): ReactNode {
    return <ReelItemsPropertyComponent property={this} />;
  }
}
