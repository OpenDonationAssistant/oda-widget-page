import { observer } from "mobx-react-lite";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { Alert } from "./Alerts";
import TextPropertyModal from "../../widgetproperties/TextPropertyModal";
import TextArea from "antd/es/input/TextArea";
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

export const HeaderTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <Flex vertical>
      <div className="settings-item">
        {(alert.property("showHeader") as BooleanProperty).markup()}
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-title-template">
          <TextPropertyModal title="widget-alert-title-template">
            <TextArea
              className="full-width"
              value={alert.property("nicknameTextTemplate")}
              onChange={(text) =>
                alert.update("nicknameTextTemplate", text.target.value)
              }
            />
          </TextPropertyModal>
        </LabeledContainer>
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
      {(alert.property("headerBackgroundColor") as ColorProperty).markup()}
      </div>
      <div className="settings-item">
      {(
        alert.property("headerBackgroundImage") as BackgroundImageProperty
      ).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("headerWidth") as WidthProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("headerHeight") as HeightProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("headerAlignment") as SingleChoiceProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("headerBorder") as BorderProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("headerRounding") as RoundingProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("headerPadding") as PaddingProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("headerBoxShadow") as BoxShadowProperty).markup()}
      </div>
    </Flex>
  );
});
