import { observer } from "mobx-react-lite";
import { Alert } from "./Alerts";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";
import { Button, Flex, Image, Switch } from "antd";
import { useEffect, useState } from "react";
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
import { fullUri, handleFileUpload } from "../../../../utils";

const ImageTab = observer(({ alert }: { alert: Alert }) => {
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
      {!alert.video && !alert.image && (
        <Flex
          vertical
          style={{
            marginBottom: "10px",
            marginTop: "10px",
            marginRight: "10px",
          }}
        >
          <LabeledContainer displayName="Изображение">
            <label className={`${classes.upload}`}>
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((result) => {
                    alert.image = result.name;
                  })
                }
              />
              <Flex justify="center" align="center" gap={3}>
                <span className="material-symbols-sharp">upload</span>
                <div>Загрузить</div>
              </Flex>
            </label>
          </LabeledContainer>
          <div
            style={{
              color: "var(--oda-color-650)",
              fontSize: "18px",
              marginTop: "24px",
              marginBottom: "24px",
            }}
          >
            или
          </div>
          <LabeledContainer displayName="Видео">
            <label
              className={`${classes.upload}`}
              style={{ marginRight: "10px" }}
            >
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((result) => {
                    alert.video = result.name;
                  })
                }
              />
              <Flex justify="center" align="center" gap={3}>
                <span className="material-symbols-sharp">upload</span>
                <div>Загрузить</div>
              </Flex>
            </label>
          </LabeledContainer>
        </Flex>
      )}
      {(alert.video || alert.image) && (
        <>
          <Flex
            gap={10}
            justify="center"
            className={`${classes.imagecontainer}`}
          >
            {alert.image && (
              <LabeledContainer displayName="Изображение">
                <Image.PreviewGroup>
                  <Image src={`${image}`} style={{ width: "100%" }} />
                </Image.PreviewGroup>
              </LabeledContainer>
            )}
            {alert.video && (
              <LabeledContainer displayName="Видео">
                <video src={video} style={{ width: "100%" }} controls muted />
              </LabeledContainer>
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
