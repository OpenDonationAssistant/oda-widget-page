import { observer } from "mobx-react-lite";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import BooleanPropertyInput from "../../components/BooleanPropertyInput";
import TextPropertyModal from "../../widgetproperties/TextPropertyModal";
import TextArea from "antd/es/input/TextArea";
import { Alert } from "./Alerts";
import { VolumeProperty } from "../../widgetproperties/VolumeProperty";
import { NumberProperty } from "../../widgetproperties/NumberProperty";

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
        <LabeledContainer displayName="widget-alert-voice-title-phrase">
          <TextPropertyModal title="widget-alert-voice-title-phrase">
            <TextArea
              className="full-width"
              value={alert.property("voiceTextTemplate")}
              onChange={(text) =>
                alert.update("voiceTextTemplate", text.target.value)
              }
            />
          </TextPropertyModal>
        </LabeledContainer>
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
        <LabeledContainer displayName="widget-alert-voice-empty-alert-phrase">
          <TextPropertyModal title="widget-alert-voice-empty-alert-phrase">
            <TextArea
              className="full-width"
              value={alert.property("voiceEmptyTextTemplates")}
              onChange={(text) =>
                alert.update("voiceEmptyTextTemplates", text.target.value)
              }
            />
          </TextPropertyModal>
        </LabeledContainer>
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
