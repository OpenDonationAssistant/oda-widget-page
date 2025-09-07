import { observer } from "mobx-react-lite";
import { Alert } from "./Alerts";
import { AnimatedFontComponent } from "../../widgetproperties/AnimatedFontComponent";
import { AnimatedFontProperty } from "../../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../../widgetproperties/BooleanProperty";
import { WidthProperty } from "../../widgetproperties/WidthProperty";
import { HeightProperty } from "../../widgetproperties/HeightProperty";
import { SingleChoiceProperty } from "../../widgetproperties/SingleChoiceProperty";
import { ColorProperty } from "../../widgetproperties/ColorProperty";
import { BackgroundImageProperty } from "../../widgetproperties/BackgroundImageProperty";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { Flex } from "antd";
import { AnimationProperty } from "../../widgetproperties/AnimationProperty";
import { NumberProperty } from "../../widgetproperties/NumberProperty";
import { DurationProperty } from "./DurationProperty";
import { TextProperty } from "../../widgetproperties/TextProperty";

export const HeaderTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <Flex vertical>
      <div className="settings-item">
        {(alert.get("showHeader") as BooleanProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("nicknameTextTemplate") as TextProperty).markup()}
      </div>
      <div className="settings-item">
        <AnimatedFontComponent
          property={
            new AnimatedFontProperty({
              name: "headerFont",
              value: alert.property("headerFont"),
              label: "widget-alert-title-font-family",
            })
          }
          onChange={(prop) => {
            alert.update("headerFont", prop.value);
          }}
        />
      </div>
      <div className="settings-item">
        {(alert.get("headerAppearanceDelay") as NumberProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerDuration") as DurationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerAppearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerAnimation") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerDisappearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerWidth") as WidthProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerHeight") as HeightProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("titleBackgroundColor") as ColorProperty).markup()}
      </div>
      <div className="settings-item">
        {(
          alert.get("headerBackgroundImage") as BackgroundImageProperty
        ).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerAlignment") as SingleChoiceProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerBorder") as BorderProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerRounding") as RoundingProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerPadding") as PaddingProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("headerBoxShadow") as BoxShadowProperty).markup()}
      </div>
    </Flex>
  );
});
