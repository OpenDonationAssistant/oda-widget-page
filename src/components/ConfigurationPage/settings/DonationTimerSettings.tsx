import { useContext } from "react";
import BaseSettings from "./BaseSettings";
import { WidgetsContext } from "../WidgetsContext";

export default function DonationTimerSettings({
  id,
  onChange,
}: {
  id: string;
  onChange: Function;
}) {
  const { updateConfig } = useContext(WidgetsContext);

  function timerModeToggler(prop) {
    return (
      <>
        {prop.name === "resetOnLoad" && (
          <>
            <input
							type="checkbox"
              className="widget-settings-value"
              checked={true === prop.value}
              onChange={(e) => {
                updateConfig(id, prop.name, !prop.value);
                onChange.apply({});
              }}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <BaseSettings
        id={id}
        onChange={onChange}
        customHandler={timerModeToggler}
      />
    </>
  );
}
