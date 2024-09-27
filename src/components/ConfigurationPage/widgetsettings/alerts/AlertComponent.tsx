import { useContext } from "react";
import { Alert, AlertContext } from "./Alert";
import { useTranslation } from "react-i18next";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { Tabs as AntTabs, Input, Select, Slider } from "antd";
import ColorPicker from "../../settings/ColorPicker";
import TextPropertyModal from "../../widgetproperties/TextPropertyModal";
import BooleanPropertyInput from "../../settings/properties/BooleanPropertyInput";
import { PaymentAlertsWidgetSettings, PaymentAlertsWidgetSettingsContext } from "./PaymentAlertsWidgetSettings";
import { observer } from "mobx-react-lite";
import Tabs from "../../../Tabs/Tabs";

const tabs = () => {
  const tabs = new Map();
  tabs.set("trigger", "tab-alert-trigger");
  tabs.set("image", "tab-alert-image");
  tabs.set("audio", "tab-alert-audio");
  tabs.set("voice", "tab-alert-voice");
  tabs.set("title", "tab-alert-title");
  tabs.set("message", "tab-alert-message");
  return tabs;
}


export const AlertComponent = observer(() => {
  const alert = useContext(AlertContext);
  const settings = useContext(PaymentAlertsWidgetSettingsContext);
  const { t } = useTranslation();

  // const tabContent = (alert: Alert, selectedTab: string) =>
  //   alert?.properties
  //     .filter((it) => it.tab === selectedTab)
  //     .filter((it) => it.type !== "fontselect")
  //     .filter((it) => it.type !== "custom")
  //     .map((prop) => (
  //       <div className="settings-item">
  //         <LabeledContainer key={`${prop.name}`} displayName={prop.displayName}>
  //           {(!prop.type || prop.type == "string") && (
  //             <Input
  //               value={prop.value}
  //               onChange={(e) => {
  //                 // update(prop.name, e.target.value, index);
  //               }}
  //             />
  //           )}
  //           {prop.type === "color" && (
  //             <ColorPicker
  //               value={prop.value}
  //               onChange={(value: any) => {
  //                 // update(prop.name, value, index)
  //               }}
  //             />
  //           )}
  //           {prop.type === "text" && (
  //             <TextPropertyModal
  //               title={prop.displayName}
  //               className="textarea-popup-container"
  //             >
  //               <div className="textarea-container">
  //                 <textarea
  //                   style={{ height: "700px" }}
  //                   className="widget-settings-value"
  //                   value={prop.value}
  //                   // onChange={(e) => update(prop.name, e.target.value, index)}
  //                 />
  //               </div>
  //             </TextPropertyModal>
  //           )}
  //           {prop.type === "boolean" && (
  //             <BooleanPropertyInput
  //               prop={prop}
  //               // onChange={() => update(prop.name, !prop.value, index)}
  //             />
  //           )}
  //         </LabeledContainer>
  //       </div>
  //     ));

  // label: t("tab-alert-trigger"),
  // const tabs = (alert: Alert) => [
  //   {
  //     key: "image",
  //     label: t("tab-alert-image"),
  //     children: [
  //       <>
  //         {[
  //           ...tabContent(alert, "image", index),
  //           <div className="settings-item">
  //             <LabeledContainer displayName="alert-appearance-label">
  //               <Select
  //                 className="full-width"
  //                 value={
  //                   alert.properties.find((prop) => prop.name === "appearance")
  //                     ?.value
  //                 }
  //                 options={[...APPEARANCE_ANIMATIONS, "random", "none"].map(
  //                   (option) => {
  //                     return { label: t(option), value: option };
  //                   },
  //                 )}
  //                 onChange={(selected) => {
  //                   update("appearance", selected, index);
  //                 }}
  //               />
  //             </LabeledContainer>
  //           </div>,
  //           <div className="upload-button-container">
  //             {!alert.video && !alert.image && (
  //               <>
  //                 <div
  //                   style={{
  //                     marginBottom: "10px",
  //                     marginTop: "10px",
  //                     marginRight: "10px",
  //                   }}
  //                 >
  //                   <label
  //                     className="oda-btn-default"
  //                     style={{ marginRight: "10px" }}
  //                   >
  //                     <input
  //                       type="file"
  //                       onChange={(e) => handleVideoUpload(e, index)}
  //                     />
  //                     {t("button-upload-video")}
  //                   </label>
  //                   <label className="oda-btn-default">
  //                     <input
  //                       type="file"
  //                       onChange={(e) => handleFileChange(e, index)}
  //                     />
  //                     {t("button-upload-image")}
  //                   </label>
  //                 </div>
  //               </>
  //             )}
  //             {(alert.video || alert.image) && (
  //               <div
  //                 style={{
  //                   marginTop: "10px",
  //                   marginBottom: "10px",
  //                   marginRight: "40px",
  //                 }}
  //               >
  //                 <label
  //                   className="oda-btn-default"
  //                   onClick={() => deleteImage(index)}
  //                 >
  //                   {t("button-delete")}
  //                 </label>
  //               </div>
  //             )}
  //           </div>,
  //         ]}
  //       </>,
  //     ],
  //   },
  //   {
  //     key: "sound",
  //     label: t("tab-alert-audio"),
  //     children: [
  //       <>
  //         {[
  //           <div className="sound-container">
  //             {alert.audio && (
  //               <>
  //                 <div className="settings-item">
  //                   <LabeledContainer displayName="Файл">
  //                     <div className="current-sound">
  //                       <span className="audio-name">{alert.audio}</span>
  //                       <span
  //                         onClick={() => playAudio(alert.audio)}
  //                         className="material-symbols-sharp"
  //                       >
  //                         play_circle
  //                       </span>
  //                       <span
  //                         onClick={() => deleteAudio(index)}
  //                         className="material-symbols-sharp"
  //                       >
  //                         delete
  //                       </span>
  //                     </div>
  //                   </LabeledContainer>
  //                 </div>
  //                 <div className="settings-item full-width">
  //                   <LabeledContainer displayName="Громкость">
  //                     <Slider
  //                       min={1}
  //                       max={100}
  //                       defaultValue={100}
  //                       value={
  //                         alert.properties.find(
  //                           (prop) => prop.name === "audio-volume",
  //                         )?.value
  //                       }
  //                       onChange={(value) =>
  //                         update("audio-volume", value, index)
  //                       }
  //                     />
  //                   </LabeledContainer>
  //                 </div>
  //               </>
  //             )}
  //             <div className="audio-button-container">
  //               {!alert.audio && (
  //                 <div style={{ textAlign: "center", width: "100%" }}>
  //                   <label className="oda-btn-default">
  //                     <input
  //                       type="file"
  //                       onChange={(e) => handleAudioUpload(e, index)}
  //                     />
  //                     {t("button-upload-audio")}
  //                   </label>
  //                 </div>
  //               )}
  //             </div>
  //           </div>,
  //         ]}
  //       </>,
  //     ],
  //   },
  //   {
  //     key: "voice",
  //     label: t("tab-alert-voice"),
  //     children: [<>{tabContent(alert, "voice", index)}</>],
  //   },
  //   {
  //     key: "header",
  //     label: t("tab-alert-title"),
  //     children: [
  //       <>
  //         {[
  //           ...tabContent(alert, "header", index),
  //           <div className="settings-item">
  //             <WidgetsContext.Provider
  //               value={{
  //                 config: config,
  //                 setConfig: setConfig,
  //                 updateConfig: (widgetId, name, value) =>
  //                   update("headerFont", value, index),
  //               }}
  //             >
  //               <AnimatedFontComponent
  //                 property={
  //                   new AnimatedFontProperty({
  //                     widgetId: "widgetId",
  //                     name: "headerFont",
  //                     value: alert.properties.find(
  //                       (prop) => prop.name === "headerFont",
  //                     )?.value,
  //                     label: "widget-alert-title-font-family",
  //                   })
  //                 }
  //               />
  //             </WidgetsContext.Provider>
  //           </div>,
  //         ]}
  //       </>,
  //     ],
  //   },
  //   {
  //     key: "message",
  //     label: t("tab-alert-message"),
  //     children: [
  //       <>
  //         {[
  //           <div className="settings-item">
  //             <WidgetsContext.Provider
  //               value={{
  //                 config: config,
  //                 setConfig: setConfig,
  //                 updateConfig: (widgetId, name, value) =>
  //                   update("font", value, index),
  //               }}
  //             >
  //               <AnimatedFontComponent
  //                 property={
  //                   new AnimatedFontProperty({
  //                     widgetId: "widgetId",
  //                     name: "font",
  //                     value: alert.properties.find(
  //                       (prop) => prop.name === "font",
  //                     )?.value,
  //                     label: "widget-alert-message-font-family",
  //                   })
  //                 }
  //               />
  //             </WidgetsContext.Provider>
  //           </div>,
  //           <div className="settings-item">
  //             {new SingleChoiceProperty({
  //               widgetId: "widgetId",
  //               name: "message-appearance",
  //               value: alert.properties.find(
  //                 (prop) => prop.name === "message-appearance",
  //               )?.value,
  //               displayName: "alert-message-appearance-label",
  //               options: [...APPEARANCE_ANIMATIONS, "random", "none"],
  //             }).markup((widgetId, name, value) =>
  //               update("message-appearance", value, index),
  //             )}
  //           </div>,
  //         ]}
  //       </>,
  //     ],
  //   },
  // ];

  return (
    <div key={alert.id} className="payment-alerts-previews-item">
      <div className="image-preview-container">
        {alert.image && (
          <img
            className={`payment-alert-image-preview`}
            src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`}
          />
        )}
      </div>
      {alert.video && (
        <video
          className={`payment-alert-image-preview`}
          src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.video}`}
          muted={true}
        />
      )}
      {!alert.image && !alert.video && (
        <div className={`payment-alert-image-preview`}>
          <img className="alert-no-image" src={`/icons/picture.png`} />
        </div>
      )}
      <Tabs tabs={tabs()} properties={[]} />
      <div
        onClick={() => settings.deleteAlert(alert.id)}
        className="alert-delete-button"
      >
        <span className="material-symbols-sharp">delete</span>
      </div>
    </div>
  );
});
