import { ReactNode } from "react";
import { log } from "../../../logging";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import Tabs from "../../Tabs/Tabs";

export class AbstractWidgetSettings {
  private _properties: WidgetProperty[];
  private _defaultValues: WidgetProperty[];
  private _tabDescriptions: Map<string, string>;
  private _widgetId: string;

  constructor(
    widgetId: string,
    properties: WidgetProperty[],
    defaultValues: WidgetProperty[],
    tabDescriptions: Map<string, string>,
  ) {
    this._widgetId = widgetId;
    this._defaultValues = defaultValues;
    this._properties = this.mergeProperties(properties);
    this._tabDescriptions = tabDescriptions;
    log.debug({ created: this }, "created widget settings");
  }

  private mergeProperties(value: WidgetProperty[]): WidgetProperty[] {
    const updated = this._defaultValues.map((prop) => {
      const merged = prop.copy();
      merged.value =
        value.find((it) => it.name === merged.name)?.value ?? merged.value;
      return merged;
    });
    log.debug({ settings: updated }, `merged properties`);
    return updated;
  }

  public markup(): ReactNode {
    return <Tabs tabs={this._tabDescriptions} properties={this._properties} />;
  }

  public set(key: string, value: any) {
    this._properties.map((prop) => {
      if (prop.name === key) {
        const updated = structuredClone(prop);
        updated.value = value;
        return updated;
      }
      return prop;
    });
  }

  public get(key: string): WidgetProperty | undefined {
    const setting = this.properties.find((prop) => key === prop.name);
    if (setting) {
      return setting.value;
    }
    return this._defaultValues.find((prop) => key === prop.name);
  }

  public get properties(): WidgetProperty[] {
    return this._properties;
  }

  public set properties(value: WidgetProperty[]) {
    this._properties = this.mergeProperties(value);
  }

  public get defaultValues(): WidgetProperty[] {
    return structuredClone(this._defaultValues);
  }

  public get tabDescriptions(): Map<string, string> {
    return this._tabDescriptions;
  }

  public set tabDescriptions(value: Map<string, string>) {
    this._tabDescriptions = value;
  }

  public get widgetId(): string {
    return this._widgetId;
  }

  public copy() {
    return new AbstractWidgetSettings(
      this._widgetId,
      this.properties,
      this.defaultValues,
      this.tabDescriptions,
    );
  }
}
