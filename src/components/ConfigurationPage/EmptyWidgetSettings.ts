import { AbstractWidgetSettings } from "./widgetsettings/AbstractWidgetSettings";

export class EmptyWidgetSettings extends AbstractWidgetSettings {
  constructor() {
    super({ properties: [], sections: [] });
  }
}
