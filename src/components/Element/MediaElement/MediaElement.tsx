import { ReactNode, useContext, useEffect, useState } from "react";
import { Element, ElementData } from "../Element";
import { Flex, Image } from "antd";
import {
  BoxShadowPropertyComponent,
  BoxShadowPropertyValue,
} from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import {
  BorderPropertyComponent,
  BorderPropertyValue,
  DEFAULT_BORDER_PROPERTY_VALUE,
} from "../../ConfigurationPage/widgetproperties/BorderProperty";
import {
  DEFAULT_ROUNDING_PROPERTY_VALUE,
  RoundingPropertyComponent,
  RoundingValue,
} from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import {
  DEFAULT_PADDING_PROPERTY_VALUE,
  PaddingPropertyComponent,
  PaddingPropertyValue,
} from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import {
  AnimationPropertyComponent,
  AnimationPropertyValue,
} from "../../ConfigurationPage/widgetproperties/AnimationProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { ModalState, ModalStateContext } from "../../Overlay/Overlay";
import classes from "./MediaElement.module.css";
import {
  WidthPropertyComponent,
  WidthPropertyValue,
} from "../../ConfigurationPage/widgetproperties/WidthProperty";
import {
  HeightPropertyComponent,
  HeightPropertyValue,
} from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { Trans } from "react-i18next";
import SecondaryButton from "../../Button/SecondaryButton";
import { fullUri, handleFileUpload } from "../../../utils";
import SubActionButton from "../../Button/SubActionButton";
import { ColorPropertyValue, DEFAULT_COLOR_PROPERTY_VALUE } from "../../ConfigurationPage/widgetproperties/ColorProperty";
import { ColorPropertyComponent } from "../../ConfigurationPage/widgetproperties/ColorPropertyComponent";

export interface MediaElementSettings {
  name: string | null;
  url: string | null;
  type: "image" | "video";
  opacity: number;
  border: BorderPropertyValue;
  padding: PaddingPropertyValue;
  rounding: RoundingValue;
  width: WidthPropertyValue;
  height: HeightPropertyValue;
  backgroundColor: ColorPropertyValue;
  shadow: BoxShadowPropertyValue;
  animation: AnimationPropertyValue;
}

export const DEFAULT_MEDIA_ELEMENT_SETTINGS = {
  border: DEFAULT_BORDER_PROPERTY_VALUE,
  padding: DEFAULT_PADDING_PROPERTY_VALUE,
  rounding: DEFAULT_ROUNDING_PROPERTY_VALUE,
  width: { type: "min", value: 100 },
  height: { type: "max", value: 100 },
  backgroundColor: DEFAULT_COLOR_PROPERTY_VALUE,
  shadow: { shadows: [] },
  animation: { animation: "none", duration: 0 },
};

const MediaElementSettingsComponent = observer(
  ({ settings: data }: { settings: ElementData<MediaElementSettings> }) => {
    const parentModalState = useContext(ModalStateContext);
    const [mainWindowModalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
      fullUri(data.settings.url).then((image) => setUrl(image));
    }, [data.settings.url]);

    return (
      <ModalStateContext.Provider value={mainWindowModalState}>
        <Flex vertical gap={18}>
          <LabeledContainer displayName={"Медиа"}>
            {!url && (
              <Flex gap={6} className="full-width">
                <label className={`${classes.upload}`}>
                  <input
                    type="file"
                    onChange={(e) => {
                      handleFileUpload(e).then((result) => {
                        data.settings.url = result.url;
                        data.settings.type = "image";
                        data.settings.name = result.originalName;
                      });
                    }}
                  />
                  <span className="material-symbols-sharp">upload</span>
                  <span>Изображение</span>
                </label>
                <label className={`${classes.upload}`}>
                  <input
                    type="file"
                    onChange={(e) => {
                      handleFileUpload(e).then((result) => {
                        data.settings.url = result.url;
                        data.settings.type = "video";
                        data.settings.name = result.originalName;
                      });
                    }}
                  />
                  <span className="material-symbols-sharp">upload</span>
                  <span>Видео</span>
                </label>
                <SecondaryButton onClick={() => {}}>
                  <span className="material-symbols-sharp">folder</span>
                  <Trans i18nKey="button-browse" />
                </SecondaryButton>
              </Flex>
            )}
            {url && (
              <Flex gap={6} className={`full-width ${classes.imagecontainer}`}>
                <div className={`${classes.imagename}`}>
                  {data.settings.name}
                </div>
                {data.settings.type === "image" && (
                  <div className={`${classes.image}`}>
                    <Image.PreviewGroup>
                      <Image src={`${url}`} className={`${classes.image}`} />
                    </Image.PreviewGroup>
                  </div>
                )}
                {data.settings.type === "video" && (
                  <div className={`${classes.video}`}>
                    <video src={url} className={`${classes.video}`} controls muted />
                  </div>
                )}
                <Flex vertical gap={6}>
                  <label className={`${classes.change}`}>
                    <input
                      type="file"
                      onChange={(e) => {
                        handleFileUpload(e).then((result) => {
                          data.settings.url = result.url;
                          data.settings.type = "image";
                          data.settings.name = result.originalName;
                        });
                      }}
                    />
                    <span className="material-symbols-sharp">upload</span>
                    <span>Изображение</span>
                  </label>
                  <label className={`${classes.change}`}>
                    <input
                      type="file"
                      onChange={(e) => {
                        handleFileUpload(e).then((result) => {
                          data.settings.url = result.url;
                          data.settings.type = "video";
                          data.settings.name = result.originalName;
                        });
                      }}
                    />
                    <span className="material-symbols-sharp">upload</span>
                    <span>Видео</span>
                  </label>
                  <SubActionButton
                    onClick={() => {
                      data.settings.url = "";
                    }}
                  >
                    <span
                      className="material-symbols-sharp"
                      style={{ color: "var(--oda-warning-color)" }}
                    >
                      delete
                    </span>
                    <Trans i18nKey="button-delete" />
                  </SubActionButton>
                </Flex>
              </Flex>
            )}
          </LabeledContainer>
          <ColorPropertyComponent
            property={{
              value: data.settings.backgroundColor,
              displayName: "Фон",
            }}
            onChange={(updated) => (data.settings.backgroundColor = updated)}
          />
          <WidthPropertyComponent property={data.settings.width} />
          <HeightPropertyComponent property={data.settings.height} />
          <BorderPropertyComponent
            help="Рамка"
            value={data.settings.border}
            displayName="Граница"
          />
          <PaddingPropertyComponent
            displayName="Отступ"
            value={data.settings.padding}
          />
          <RoundingPropertyComponent
            displayName="Скругление"
            value={data.settings.rounding}
          />
          <LabeledContainer displayName="Анимация">
            <Flex vertical className="full-width" gap={9}>
              <AnimationPropertyComponent value={data.settings.animation} />
            </Flex>
          </LabeledContainer>
          <BoxShadowPropertyComponent
            displayName="Тени"
            value={data.settings.shadow}
            buttonClassName={classes.addshadowbutton}
          />
        </Flex>
      </ModalStateContext.Provider>
    );
  },
);

export class MediaElement extends Element<MediaElementSettings> {
  markup(): ReactNode {
    return <MediaElementSettingsComponent settings={this.data} />;
  }
}
