import { ReactNode } from "react";
import { WidgetProperty } from "./WidgetProperty";
import { AbstractWidgetSettings } from "../widgetsettings/AbstractWidgetSettings";
import { PresetStore } from "../../../stores/PresetStore";
import PresetPropertyComponent from "./PresetPropertyComponent";
import { Preset } from "../../../types/Preset";
import { log } from "../../../logging";
import { Alert } from "../widgetsettings/alerts/Alerts";

export class PresetProperty implements WidgetProperty<string> {
  private _settings: AbstractWidgetSettings | Alert;
  private _store: PresetStore;
  public name: string = "preset";
  public value: string = "";
  public displayName: string = "widget-preset";
  public changed: boolean = false;

  constructor({
    type,
    settings,
  }: {
    type: string;
    settings: AbstractWidgetSettings | Alert;
  }) {
    this.value = type;
    this._settings = settings;
    this._store = new PresetStore();
  }

  markSaved: () => void = () => {};

  load(): Promise<Preset[]> {
    log.debug({ property: this}, "load presets");
    return this._store.for(this.value);
  }

  apply(preset: Preset){
    preset.applyTo(this._settings, this.value);
  }

  markup(): ReactNode {
    return <PresetPropertyComponent property={this} />;
  }
}
