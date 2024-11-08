import { Flex } from "antd";
import React, { ReactNode } from "react";
import { InputNumber as AndInputNumber } from "antd";
import classes from "./InputNumber.module.css";

export default function InputNumber({
  value,
  onChange,
  addon,
  increment,
}: {
  value: number;
  onChange: (value: number) => void;
  addon?: ReactNode;
  increment?: number;
}) {
  return (
    <>
      <Flex vertical={false} gap={5} className={`${classes.inputcontainer}`}>
        <button
          className={classes.button}
          onClick={() => onChange(value - 1 + 1 + (increment ? increment : 1))}
        >
          <span className="material-symbols-sharp">add</span>
        </button>
        <AndInputNumber
          value={value}
          addonAfter={addon}
          className={`${classes.value} ${
            addon ? classes.valuewithaddon : classes.valuewithoutaddon
          }`}
          onChange={(newValue) => {
            if (newValue === null) return;
            onChange(newValue);
          }}
        />
        <button
          className={classes.button}
          onClick={() => onChange(value - (increment ? increment : 1))}
        >
          <span className="material-symbols-sharp">remove</span>
        </button>
      </Flex>
    </>
  );
}
