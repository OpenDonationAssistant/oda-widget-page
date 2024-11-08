import React from "react";
import classes from "./BooleanPropertyInput.module.css";
import { Switch } from "antd";

export default function BooleanPropertyInput({
  prop,
  onChange,
}: {
  onChange: (value: boolean) => void;
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
