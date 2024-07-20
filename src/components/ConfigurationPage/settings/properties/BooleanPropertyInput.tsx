import React from "react";
import classes from "./BooleanPropertyInput.module.css";
import { Switch } from "antd";

export default function BooleanPropertyInput({
  prop,
  onChange,
}: {
  onChange: Function;
  prop: {
    value: any;
  };
}) {
  return (
    <div className={classes.checkboxwrapper}>
      <Switch checked={true === prop.value} onChange={(e) => onChange(e)} />
    </div>
  );
}
