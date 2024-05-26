import React from "react";
import classes from "./BooleanPropertyInput.module.css";

export default function BooleanPropertyInput({
  prop,
  onChange,
}: {
  onChange: Function;
  prop: {
    type: string;
    name: string;
    value: any;
  };
}) {
  return (
    <>
      <div className={classes.checkboxwrapper}>
        <input
          type="checkbox"
          checked={true === prop.value}
          onChange={(e) => onChange(e)}
        />
      </div>
    </>
  );
}
