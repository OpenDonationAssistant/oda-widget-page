import { Alert } from "./Alerts";
import { observer } from "mobx-react-lite";
import { AnimationProperty } from "../../widgetproperties/AnimationProperty";
import { DurationProperty } from "./DurationProperty";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { ColorProperty } from "../../widgetproperties/ColorProperty";
import { BackgroundImageProperty } from "../../widgetproperties/BackgroundImageProperty";
import { WidthProperty } from "../../widgetproperties/WidthProperty";

const GeneralTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <>
      <div className="settings-item">
        {(alert.get("duration") as DurationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalWidth") as WidthProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalHeight") as WidthProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalAppearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalAnimation") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalDisappearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalBackgroundColor") as ColorProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(
          alert.get("totalBackgroundImage") as BackgroundImageProperty
        )?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalBorder") as BorderProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalRounding") as RoundingProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalPadding") as PaddingProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("totalShadow") as BoxShadowProperty)?.markup()}
      </div>
    </>
  );
});

export default GeneralTab;
