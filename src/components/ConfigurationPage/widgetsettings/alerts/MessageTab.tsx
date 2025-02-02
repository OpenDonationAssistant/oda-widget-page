import { Select } from "antd";
import { observer } from "mobx-react-lite";
import { AnimatedFontComponent } from "../../widgetproperties/AnimatedFontComponent";
import { AnimatedFontProperty } from "../../widgetproperties/AnimatedFontProperty";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { APPEARANCE_ANIMATIONS } from "./PaymentAlertsWidgetSettingsComponent";
import { Trans } from "react-i18next";
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

export const MessageTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <>
      <div className="settings-item">
        {(alert.property("showMessage") as BooleanProperty).markup()}
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
        <LabeledContainer displayName="alert-message-appearance-label">
          <Select
            value={alert.property("message-appearance")}
            className="full-width"
            onChange={(e) => {
              alert.update("message-appearance", e);
            }}
            options={[...APPEARANCE_ANIMATIONS, "random", "none"].map(
              (option) => {
                return {
                  value: option,
                  label: (
                    <>
                      <Trans i18nKey={option} />
                    </>
                  ),
                };
              },
            )}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
      {(alert.property("messageBackgroundColor") as ColorProperty).markup()}
      </div>
      <div className="settings-item">
      {(
        alert.property("messageBackgroundImage") as BackgroundImageProperty
      ).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("messageWidth") as WidthProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("messageHeight") as HeightProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("messageAlignment") as SingleChoiceProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("messageBorder") as BorderProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("messageRounding") as RoundingProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("messagePadding") as PaddingProperty).markup()}
      </div>
      <div className="settings-item">
      {(alert.property("messageBoxShadow") as BoxShadowProperty).markup()}
      </div>
    </>
  );
});
