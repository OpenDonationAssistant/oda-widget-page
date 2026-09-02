import { Alert } from "../components/ConfigurationPage/widgetsettings/alerts/Alerts";
import { log } from "../logging";
import { Widget } from "../types/Widget";

interface PresetProperty {
  name: string;
  value: any;
}

export interface Preset {
  name: string;
  showcase: string;
  properties: PresetProperty[];
  owner: string;
}
