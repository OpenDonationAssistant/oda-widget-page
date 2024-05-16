import React, { useContext, useState } from "react";
import { WidgetsContext } from "../WidgetsContext";
import BaseSettings from "./BaseSettings";

export default function DonatersTopListSettings({ id }: { id: string }) {
  const { config, updateConfig } = useContext(WidgetsContext);
  const [tab, setTab] = useState<string>("");

  return (
    <>
      <BaseSettings id={id} propertyFilter={(prop) => true} />
      {config
        .get(id)
        ?.properties
        ?.map((prop) => {
          if (prop.name === "layout") {
          }
        })}
    </>
  );
}
