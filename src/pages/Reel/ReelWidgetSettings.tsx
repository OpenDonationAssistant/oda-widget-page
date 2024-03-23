import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import BaseSettings from "../../components/ConfigurationPage/settings/BaseSettings";
import { WidgetsContext } from "../../components/ConfigurationPage/WidgetsContext";
import { log } from "../../logging";
import classes from "./ReelWidgetSettings.module.css";
import { useLoaderData } from "react-router";
import { publish } from "../../socket";
import Tabs from "../../components/Tabs/Tabs";
import axios from "axios";

export default function ReelWidgetSettings({
  id,
  onChange,
}: {
  id: string;
  onChange: Function;
}) {
  const { config, updateConfig } = useContext(WidgetsContext);
  const [optionList, setOptionList] = useState<string[]>([]);
  const { conf } = useLoaderData();
  const [tab, setTab] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  function getProperty(name: string): any {
    return config.get(id)?.properties.find((prop) => prop.name === name)?.value;
  }

  useEffect(() => {
    setBackgroundImage(getProperty("backgroundImage") ?? "");
  }, [config]);

  useEffect(() => {
    log.debug(`running effect for updating option list`);
    setOptionList((oldList) => {
      const newList = getProperty("optionList");
      log.debug(`updating option list to ${JSON.stringify(newList)}`);
      return newList;
    });
  }, [config]);

  function updateOption(index: number, value: string) {
    const updated = optionList.toSpliced(index, 1, value);
    updateConfig(id, "optionList", updated);
  }

  function removeOption(index: number) {
    const updated = optionList.toSpliced(index, 1);
    updateConfig(id, "optionList", updated);
  }

  function getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function uploadFile(file) {
    return axios.put(
      `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${file.name}`,
      { file: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  const handleBackgroundImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      uploadFile(file).then((ignore) => {
        updateConfig(id, "backgroundImage", file.name);
      });
    }
  };

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
      <Tabs widgetId={id} onChange={(tab: string) => setTab(tab)} />
      <BaseSettings
        id={id}
        onChange={onChange}
        propertyFilter={(prop) => prop.tab === tab}
      />
      {tab === "prizes" && (
        <>
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
          <div className={`${classes.itembackcontainer}`}>
            <div className={`${classes.itembacklabel}`}>Фон карточек</div>
            <label className={`upload-button ${classes.itembackuploadbutton}`}>
              <input type="file" onChange={handleBackgroundImageChange} />
              Загрузить изображение
            </label>
          </div>
          {backgroundImage && (
            <img className={`${classes.backgroundimage}`}
              src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${backgroundImage}`}
            />
          )}
        </>
      )}
    </>
  );
}
