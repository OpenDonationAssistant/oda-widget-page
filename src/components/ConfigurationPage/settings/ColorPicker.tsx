import
{ ColorPicker as AntColorPicker }
from
"antd"
;
import classes from "./ColorPicker.module.css";

export default function ColorPicker({ value, onChange }) {
  return (
    <>
      <div className={`${classes.container}`}>
      <AntColorPicker value={value} showText
              onChange={(newValue) => {
                onChange(newValue.toRgbString());
              }}/>
      </div>
    </>
  );
}
