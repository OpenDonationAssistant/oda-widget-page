import {
  Alert,
} from "./Alerts";
import { observer } from "mobx-react-lite";
import { PresetProperty } from "../../widgetproperties/PresetProperty";

const PresetTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <div className="settings-item">
      {(alert.get("preset") as PresetProperty).markup()}
    </div>
  );
});

export default PresetTab;
