import { useContext } from "react";
import { WidgetsContext } from "../WidgetsContext";
import { log } from "../../../logging";

export default function BaseSettings({
  id,
}: {
  id: string;
}) {
  const { config, updateConfig } = useContext(WidgetsContext);
  log.debug(
    { settings: config.get(id) },
    "creating layout for widget settings",
  );

  return config.get(id)?.markup(updateConfig);
}
