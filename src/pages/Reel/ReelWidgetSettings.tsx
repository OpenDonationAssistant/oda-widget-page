import React, { useContext, useEffect, useState } from "react";
import BaseSettings from "../../components/ConfigurationPage/settings/BaseSettings";
import { WidgetsContext } from "../../components/ConfigurationPage/WidgetsContext";
import { log } from "../../logging";
import classes from "./ReelWidgetSettings.module.css";
import { useLoaderData } from "react-router";
import { publish } from "../../socket";

export default function ReelWidgetSettings({
  id,
  onChange,
}: {
  id: string;
  onChange: Function;
}) {
  const { config, setConfig } = useContext(WidgetsContext);
  const [optionList, setOptionList] = useState<string[]>([]);
  const { conf } = useLoaderData();

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

  function updateOption(index: number, value: string) {
    const updated = optionList.toSpliced(index, 1, value);
    update("optionList", updated);
  }

  function removeOption(index: number) {
    const updated = optionList.toSpliced(index, 1);
    update("optionList", updated);
  }

  function getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function runReel() {
    const choosenIndex = getRndInteger(0, optionList.length - 1);
    publish(conf.topic.reel, {
      type: "trigger",
      selection: optionList[choosenIndex],
      widgetId: id,
    });
  }

  return (
    <>
      <button
        className={`widget-button ${classes.testbutton}`}
        onClick={runReel}
      >
        Крутануть
      </button>
      <BaseSettings id={id} onChange={onChange} />
      <div className="widget-settings-item">
        <label className="widget-settings-name">Призы</label>
        <div className={classes.optionscontainer}>
          {optionList &&
            optionList.map((option, number) => (
              <>
                <div className={classes.option}>
                  <textarea
                    key={number}
                    value={option}
                    className="widget-settings-value"
                    style={{ width: "100%" }}
                    onChange={(e) => updateOption(number, e.target.value)}
                  />
                  <button
                    className="widget-button"
                    onClick={() => {
                      removeOption(number);
                    }}
                  >
                    <span className="material-symbols-sharp">delete</span>
                  </button>
                </div>
              </>
            ))}
          <div className={classes.addbuttoncontainer}>
            <button
              className="widget-button"
              style={{ width: "100%" }}
              onClick={() => {
                setOptionList((oldList) => {
                  oldList.push("");
                  return structuredClone(oldList);
                });
              }}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
