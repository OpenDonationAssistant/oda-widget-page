import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import BaseSettings from "../../components/ConfigurationPage/settings/BaseSettings";
import { WidgetsContext } from "../../components/ConfigurationPage/WidgetsContext";
import { log } from "../../logging";
import classes from "./ReelWidgetSettings.module.css";
import { useLoaderData } from "react-router";
import { publish } from "../../socket";
import axios from "axios";
import { WidgetData } from "../../types/WidgetData";

export default function ReelWidgetSettings({
  id,
  onChange,
}: {
  id: string;
  onChange: Function;
}) {
  const { config, updateConfig } = useContext(WidgetsContext);
  const [optionList, setOptionList] = useState<string[]>([]);
  const { conf } = useLoaderData() as WidgetData;
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
      log.debug({options: newList}, `updating option list`);
      return newList;
    });
  }, [config]);

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
      <BaseSettings id={id}/>
    </>
  );
}
