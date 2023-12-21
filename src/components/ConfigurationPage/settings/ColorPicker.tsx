import { useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorPicker({value, onChange}) {
  const [isOpen, toggle] = useState(false);
  return (
    <>
      <div
        className="color-value"
        style={{ backgroundColor: value }}
        onClick={() => toggle(!isOpen)}
      />
      {isOpen && (<HexColorPicker
        color={value}
        onChange={(newValue) => {
          onChange(newValue);
        }}
      />)}
    </>
  );
}
