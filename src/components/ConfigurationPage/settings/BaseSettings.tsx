import React, { useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import { WidgetProperty } from "../WidgetSettings";
import { log } from "../../../logging";

export default function BaseSettings({
  id,
  customHandler,
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

  return (
    <>
      {config
        .get(id)
        ?.properties?.filter(filter)
        .map(
          (prop) => (prop.type !== "custom" || customHandler) && prop.markup(),
        )}
    </>
  );
}
