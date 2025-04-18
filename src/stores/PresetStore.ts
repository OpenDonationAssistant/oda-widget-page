import { log } from "../logging";
import { Preset } from "../types/Preset";
import { DefaultApiFactory as WidgetApiFactory } from "@opendonationassistant/oda-widget-service-client";

export class PresetStore {
  public async for(type: string | null | undefined): Promise<Preset[]> {
    log.debug({ type: type }, "checking presets");
    if (!type) {
      return Promise.resolve([]);
    }
    log.debug({ type: type }, "loading templates");
    return WidgetApiFactory(
      undefined,
      process.env.REACT_APP_WIDGET_API_ENDPOINT,
    )
      .listTemplates(type)
      .then((response) => {
        return response.data.map((template) => {
          const props = template.properties.map((prop) => {
            return { name: prop["name"], value: prop["value"] };
          });
          return new Preset({
            name: template.id,
            properties: props,
            showcase: template.showcase,
          });
        });
      });
  }
}
