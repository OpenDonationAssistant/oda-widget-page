import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Alert } from "./Alerts";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";
import { Button, Flex, Image, Switch } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { BorderProperty } from "../../widgetproperties/BorderProperty";
import { RoundingProperty } from "../../widgetproperties/RoundingProperty";
import { PaddingProperty } from "../../widgetproperties/PaddingProperty";
import { BoxShadowProperty } from "../../widgetproperties/BoxShadowProperty";
import { AnimationProperty } from "../../widgetproperties/AnimationProperty";
import { NumberProperty } from "../../widgetproperties/NumberProperty";
import { DurationProperty } from "./DurationProperty";
import classes from "./ImageTab.module.css";
import { BooleanProperty } from "../../widgetproperties/BooleanProperty";
import { VolumeProperty } from "../../widgetproperties/VolumeProperty";
import { uuidv7 } from "uuidv7";

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
  const name = uuidv7();
  return uploadFile(file, name).then((ignore) => {
    return name;
  });
};

async function fullUri(url: string | null): Promise<string> {
  if (!url) {
    return Promise.resolve("");
  }
  if (!url.startsWith("http")) {
    url = `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${url}`;
  }
  // TODO: вынести в общий модуль
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    },
  })
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));
}

const ImageTab = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  const [image, setImage] = useState<string>("");
  const [video, setVideo] = useState<string>("");

  useEffect(() => {
    if (alert.image) {
      fullUri(alert.image).then((url) => setImage(url));
    }
  }, [alert.image]);

  useEffect(() => {
    if (alert.video) {
      fullUri(alert.video).then((url) => setVideo(url));
    }
  }, [alert.video]);

  const limitImageSize =
    alert.property("imageWidth") > -1 || alert.property("imageHeight") > -1;

  return (
    <Flex vertical gap={10}>
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
      </div>
      {(alert.video || alert.image) && (
        <>
          <Flex
            gap={10}
            justify="center"
            className={`${classes.imagecontainer}`}
          >
            {alert.image && (
              <Image.PreviewGroup>
                <Image width={200} height={120} src={`${image}`} />
              </Image.PreviewGroup>
            )}
            {alert.video && (
              <video src={video} width="640" height="360" controls muted />
            )}
            <Flex vertical={true} justify="flex-start" align="flex-start">
              <Button
                onClick={() => {
                  alert.image = null;
                  alert.video = null;
                }}
              >
                <span className="material-symbols-sharp">delete</span>
              </Button>
            </Flex>
          </Flex>
          <div className="settings-item">
            <LabeledContainer displayName="widget-alert-limit-image-size">
              <Switch
                checked={limitImageSize}
                onChange={(checked) => {
                  alert.update("imageWidth", checked ? 0 : -1);
                  alert.update("imageHeight", checked ? 0 : -1);
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
                    addon="px"
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
                    addon="px"
                    onChange={(newValue) => {
                      alert.update("imageHeight", newValue);
                    }}
                  />
                </LabeledContainer>
              </div>
            </>
          )}
          <div className="settings-item">
            {(alert.get("imageBackgroundBlur") as BooleanProperty).markup()}
          </div>
          <div className="settings-item">
            {(alert.get("imageAppearanceDelay") as NumberProperty).markup()}
          </div>
          <div className="settings-item">
            {(alert.get("imageDuration") as DurationProperty).markup()}
          </div>
          {alert.video && (
            <div className="settings-item">
              {(alert.get("imageVolume") as VolumeProperty).markup()}
            </div>
          )}
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
        </>
      )}
    </Flex>
  );
});

export default ImageTab;
