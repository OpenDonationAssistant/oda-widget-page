import { ReactNode } from "react";
import { DefaultWidgetProperty, WidgetProperty } from "./WidgetProperty";
import { AbstractWidgetSettings } from "../widgetsettings/AbstractWidgetSettings";
import { PresetStore } from "../../../stores/PresetStore";
import PresetPropertyComponent from "./PresetPropertyComponent";
import { Preset } from "../../../types/Preset";
import { log } from "../../../logging";
import { Alert } from "../widgetsettings/alerts/Alerts";

export class PresetProperty extends DefaultWidgetProperty<string> {
  private _settings: AbstractWidgetSettings | Alert;
  private _store: PresetStore;

  constructor({
    type,
    settings,
  }: {
    type: string;
    settings: AbstractWidgetSettings | Alert;
  }) {
    super({ name: "preset", value: type, displayName: "widget-preset" });
    this._settings = settings;
    this._store = new PresetStore();
  }
  protected _name: string = "preset";
  protected _initialValue: string = "unknown";
  protected _displayName: string = "Готовые шаблоны";
  protected _changed: boolean = false;

  public get help(): string | undefined {
    return "";
  }

  protected deepEqual(x: any, y: any): boolean {
    return true;
  }

  markSaved: () => void = () => {};

  copy() {
    return new PresetProperty({ type: this.value, settings: this._settings });
  }

  load(): Promise<Preset[]> {
    log.debug({ property: this }, "load presets");
    return this._store.for(this.value);
  }

  apply(preset: Preset) {
    preset.applyTo(this._settings, this.value);
  }

  markup(): ReactNode {
    return <PresetPropertyComponent property={this} />;
  }
}
