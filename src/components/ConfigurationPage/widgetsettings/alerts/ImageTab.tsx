import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Alert } from "./Alerts";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";
import { Flex, Switch } from "antd";
import { ChangeEvent } from "react";
import axios from "axios";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { AnimationProperty } from "../../widgetproperties/AnimationProperty";
import { NumberProperty } from "../../widgetproperties/NumberProperty";
import { DurationProperty } from "./DurationProperty";

function uploadFile(file: File, name: string) {
  return axios.put(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`,
    { file: file },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) {
    return Promise.reject();
  }
  const file = e.target.files[0];
  const name = encodeURIComponent(file.name);
  return uploadFile(file, name).then((ignore) => {
    return name;
  });
};

const ImageTab = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  const limitImageSize =
    alert.property("imageWidth") !== null &&
    alert.property("imageHeight") !== null;

  return (
    <Flex vertical gap={10}>
      <div className="settings-item">
        <LabeledContainer displayName="widget-alert-limit-image-size">
          <Switch
            checked={limitImageSize}
            onChange={(checked) => {
              alert.update("imageWidth", checked ? 0 : null);
              alert.update("imageHeight", checked ? 0 : null);
            }}
          />
        </LabeledContainer>
      </div>
      {limitImageSize && (
        <>
          <div className="settings-item">
            <LabeledContainer displayName="widget-alert-image-width">
              <InputNumber
                value={alert.property("imageWidth")}
                onChange={(newValue) => {
                  alert.update("imageWidth", newValue);
                }}
              />
            </LabeledContainer>
          </div>
          <div className="settings-item">
            <LabeledContainer displayName="widget-alert-image-height">
              <InputNumber
                value={alert.property("imageHeight")}
                onChange={(newValue) => {
                  alert.update("imageHeight", newValue);
                }}
              />
            </LabeledContainer>
          </div>
        </>
      )}
      <div className="settings-item">
        {(alert.get("imageAppearanceDelay") as NumberProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("imageDuration") as DurationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("imageAppearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("imageAnimation") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("imageDisappearance") as AnimationProperty).markup()}
      </div>
      <div className="settings-item">
        {(alert.get("imageBorder") as BorderProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("imageRounding") as RoundingProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("imagePadding") as PaddingProperty)?.markup()}
      </div>
      <div className="settings-item">
        {(alert.get("imageShadow") as BoxShadowProperty)?.markup()}
      </div>
      <div className="upload-button-container">
        {!alert.video && !alert.image && (
          <div
            style={{
              marginBottom: "10px",
              marginTop: "10px",
              marginRight: "10px",
            }}
          >
            <label className="oda-btn-default" style={{ marginRight: "10px" }}>
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((name) => {
                    alert.video = name;
                  })
                }
              />
              <Flex justify="center" align="center" gap={3}>
                <span className="material-symbols-sharp">upload</span>
                <div>{t("button-upload-video")}</div>
              </Flex>
            </label>
            <label className="oda-btn-default">
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((name) => {
                    alert.image = name;
                  })
                }
              />
              <Flex justify="center" align="center" gap={3}>
                <span className="material-symbols-sharp">upload</span>
                <div>{t("button-upload-image")}</div>
              </Flex>
            </label>
          </div>
        )}
        {(alert.video || alert.image) && (
          <div
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginRight: "40px",
            }}
          >
            <label
              className="oda-btn-default"
              onClick={() => {
                alert.image = null;
                alert.video = null;
              }}
            >
              <Flex justify="center" align="center" gap={3}>
                <span className="material-symbols-sharp">delete</span>
                <div>{t("button-delete")}</div>
              </Flex>
            </label>
          </div>
        )}
      </div>
    </Flex>
  );
});

export default ImageTab;
