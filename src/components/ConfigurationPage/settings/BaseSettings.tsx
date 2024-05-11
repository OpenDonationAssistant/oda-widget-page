import { useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import { log } from "../../../logging";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";

export default function BaseSettings({
  id,
  propertyFilter,
}: {
  id: string;
  customHandler?: Function;
  propertyFilter?: (prop: WidgetProperty) => boolean;
}) {
  const { config, updateConfig } = useContext(WidgetsContext);
  log.debug(
    { settings: config.get(id) },
    "creating layout for widget settings",
  );
  log.debug({ properties: config.get(id)?.properties }, "use properties");

  const filter = (prop) => (propertyFilter ? propertyFilter(prop) : true);

  return config.get(id)?.markup(updateConfig);
}
