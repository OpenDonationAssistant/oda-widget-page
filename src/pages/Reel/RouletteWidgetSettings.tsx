import React, { useContext, useEffect, useState } from "react";
import BaseSettings from "../../components/ConfigurationPage/settings/BaseSettings";
import { WidgetsContext } from "../../components/ConfigurationPage/WidgetsContext";
import { log } from "../../logging";
import classes from "./RouletteWidgetSettings.module.css";

export default function RouletteWidgetSettings({
  id,
  onChange,
}: {
  id: string;
  onChange: Function;
}) {
  const { config, setConfig } = useContext(WidgetsContext);
  const [optionList, setOptionList] = useState<string[]>([]);

  function update(key: string, value: string) {
    setConfig((oldConfig) => {
      let updatedProperties = oldConfig.get(id)?.properties.map((it) => {
        if (it.name === key) {
          it.value = value;
        }
        return it;
      });
      return new Map(oldConfig).set(id, { properties: updatedProperties });
    });
    onChange.call({});
  }

  useEffect(() => {
    log.debug(`running effect for updating option list`);
    setOptionList((oldList) => {
      const newList = config
        .get(id)
        ?.properties.find((prop) => prop.name === "optionList")?.value;
      log.debug(`updating option list to ${JSON.stringify(newList)}`);
      return newList;
    });
  }, [config]);

  return (
    <>
      <BaseSettings id={id} onChange={onChange} />
      <div className="widget-settings-item">
        <label className="widget-settings-name">Призы</label>
        <div className={classes.optionscontainer}>
          {optionList &&
            optionList.map((option, number) => (
              <textarea
                key={number}
                value={option}
                className="widget-settings-value"
              />
            ))}
          <div className={classes.addbuttoncontainer}>
          <button className={classes.addoptionsbutton}>
            <span className="material-symbols-sharp">add</span>
          </button>
          </div>
        </div>
      </div>
    </>
  );
}
