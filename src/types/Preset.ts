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
