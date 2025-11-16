import { observer } from "mobx-react-lite";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import BooleanPropertyInput from "../../components/BooleanPropertyInput";
import { Alert } from "./Alerts";
import { VolumeProperty } from "../../widgetproperties/VolumeProperty";
import { NumberProperty } from "../../widgetproperties/NumberProperty";
import { TextProperty } from "../../widgetproperties/TextProperty";

export const VoiceTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-voice-for-header">
          <BooleanPropertyInput
            prop={{ value: alert.property("enableVoiceForHeader") }}
            onChange={(e) => alert.update("enableVoiceForHeader", e)}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
        {(alert.get("headerVoiceDelay") as NumberProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("voiceTextTemplate") as TextProperty).markup()}
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-voice-if-empty">
          <BooleanPropertyInput
            prop={{ value: alert.property("enableVoiceWhenMessageIsEmpty") }}
            onChange={(e) => alert.update("enableVoiceWhenMessageIsEmpty", e)}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
        {(alert.get("voiceEmptyTextTemplates") as TextProperty).markup()}
      </div>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-voice-for-message">
          <BooleanPropertyInput
            prop={{ value: alert.property("enableVoiceForMessage") }}
            onChange={(e) => alert.update("enableVoiceForMessage", e)}
          />
        </LabeledContainer>
      </div>
      <div className="settings-item">
        {(alert.get("messageVoiceDelay") as NumberProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("voiceVolume") as VolumeProperty).markup()}
      </div>
    </>
  );
});
