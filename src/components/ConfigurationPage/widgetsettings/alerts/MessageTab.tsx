import { observer } from "mobx-react-lite";
import { AnimatedFontComponent } from "../../widgetproperties/AnimatedFontComponent";
import { AnimatedFontProperty } from "../../widgetproperties/AnimatedFontProperty";
import { BooleanProperty } from "../../widgetproperties/BooleanProperty";
import { ColorProperty } from "../../widgetproperties/ColorProperty";
import { BackgroundImageProperty } from "../../widgetproperties/BackgroundImageProperty";
import { WidthProperty } from "../../widgetproperties/WidthProperty";
import { HeightProperty } from "../../widgetproperties/HeightProperty";
import { SingleChoiceProperty } from "../../widgetproperties/SingleChoiceProperty";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { Alert } from "./Alerts";
import { NumberProperty } from "../../widgetproperties/NumberProperty";
import { AnimationProperty } from "../../widgetproperties/AnimationProperty";
import { DurationProperty } from "./DurationProperty";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import TextPropertyModal from "../../widgetproperties/TextPropertyModal";
import TextArea from "antd/es/input/TextArea";

export const MessageTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <>
      <div className="settings-item">
        {(alert.get("showMessage") as BooleanProperty).markup()}
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-title-template">
          <TextPropertyModal title="widget-alert-title-template">
            <TextArea
              className="full-width"
              value={alert.property("messageTemplate")}
              onChange={(text) =>
                alert.update("messageTemplate", text.target.value)
              }
            />
          </TextPropertyModal>
        </LabeledContainer>
      </div>

      <div className="settings-item">
        <AnimatedFontComponent
          property={
            new AnimatedFontProperty({
              name: "font",
              value: alert.properties.find((prop) => prop.name === "font")
                ?.value,
              label: "widget-alert-message-font-family",
            })
          }
          onChange={(prop) => {
            alert.update("font", prop.value);
          }}
        />
      </div>
      <div className="settings-item">
        {(alert.get("messageAppearanceDelay") as NumberProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageDuration") as DurationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageAppearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageAnimation") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageDisappearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageBackgroundColor") as ColorProperty).markup()}
      </div>
      <div className="settings-item">
        {(
          alert.get("messageBackgroundImage") as BackgroundImageProperty
        ).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageWidth") as WidthProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageHeight") as HeightProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageAlignment") as SingleChoiceProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageBorder") as BorderProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageRounding") as RoundingProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messagePadding") as PaddingProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("messageBoxShadow") as BoxShadowProperty).markup()}
      </div>
    </>
  );
});
