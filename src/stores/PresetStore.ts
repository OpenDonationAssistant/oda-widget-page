import { createContext } from "react";
import { log } from "../logging";
import { Preset } from "../types/Preset";
import { DefaultApiFactory as WidgetApiFactory } from "@opendonationassistant/oda-widget-service-client";

export interface PresetStore {
  for: (type: string | null | undefined) => Promise<Preset[]>;
  save: (preset: Preset, type: string) => void,
}

export class DefaultPresetStore implements PresetStore {
  private client(){
    return WidgetApiFactory(
      undefined,
      process.env.REACT_APP_WIDGET_API_ENDPOINT,
    );
  }

  public async for(type: string | null | undefined): Promise<Preset[]> {
    if (!type) {
      return Promise.resolve([]);
    }
    log.debug({ type: type }, "loading templates");
    return this.client().listTemplates(type)
      .then((response) => {
        return response.data.map((template) => {
          const props = template.properties.map((prop) => {
            return { name: prop["name"], value: prop["value"] };
          });
          return new Preset({
            name: template.id,
            owner: template.recipientId,
            properties: props,
            showcase: template.showcase,
          });
        });
      });
  }

  public save(preset: Preset, type: string) {
    log.debug({preset: preset} ,"Saving preset");
    this.client().createTemplate({
      widgetType: type,
      showcase: preset.showcase,
      properties: preset.properties
    });
  }
}

export const PresetStoreContext = createContext<PresetStore>({
  for: (type) => Promise.resolve([]),
  save: (preset, type) => {},
});
