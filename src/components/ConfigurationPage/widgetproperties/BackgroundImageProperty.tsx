import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Trans } from "react-i18next";
import { Flex, Image, Select } from "antd";
import classes from "./BackgroundImageProperty.module.css";
import InputNumber from "../components/InputNumber";
import { produce } from "immer";
import { toJS } from "mobx";
import CloseIcon from "../../../icons/CloseIcon";
import SubActionButton from "../../Button/SubActionButton";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";
import { LightLabeledSwitchComponent } from "../../LabeledSwitch/LabeledSwitchComponent";
import { fullUri, handleFileUpload } from "../../../utils";

export interface ImagePropertyValue {
  name: string | null;
  url: string | null;
  size: string;
  repeat: boolean;
  opacity: number;
}

export const DEFAULT_IMAGE_PROPERTY_VALUE = {
  url: null,
  size: "auto",
  repeat: false,
  opacity: 1,
};

export const ImagePropertyComponent = observer(
  ({
    value,
    displayName,
    onChange,
  }: {
    value: ImagePropertyValue;
    displayName: string;
    onChange?: (value: ImagePropertyValue) => void;
  }) => {
    const [image, setImage] = useState<string>(value.url ?? "");

    useEffect(() => {
      fullUri(value.url).then(setImage);
    }, [value.url]);

    return (
      <>
        <LabeledContainer displayName={displayName}>
          {!value.url && (
            <label className={`${classes.upload}`}>
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((result) => {
                    value.url = result.url;
                    value.name = result.name;
                    onChange?.(value);
                  })
                }
              />
              <span className="material-symbols-sharp">upload</span>
              <Trans i18nKey="button-upload" />
            </label>
          )}
          {value.url && (
            <Flex vertical={true} className="full-width" justify="space-around">
              <Flex
                gap={10}
                align="center"
                className={`${classes.previewcontainer}`}
                justify="space-between"
              >
                <div>{value.name}</div>
                <Flex align="center" gap={6}>
                  <Image.PreviewGroup>
                    <Image
                      width={200}
                      height={28}
                      className={`${classes.preview}`}
                      src={`${image}`}
                    />
                  </Image.PreviewGroup>
                  <SubActionButton
                    onClick={() => {
                      value.name = null;
                      value.url = null;
                      value.size = "auto";
                      value.repeat = false;
                      value.opacity = 1;
                      onChange?.(value);
                    }}
                  >
                    <div>Загрузить</div>
                  </SubActionButton>
                  <SubActionButton
                    onClick={() => {
                      value.name = null;
                      value.url = null;
                      value.size = "auto";
                      value.repeat = false;
                      value.opacity = 1;
                      onChange?.(value);
                    }}
                  >
                    <CloseIcon color="#FF8888" />
                    <div>Удалить</div>
                  </SubActionButton>
                </Flex>
              </Flex>
              <Flex gap={6} align="bottom">
                <SmallLabeledContainer displayName="Прозрачность">
                  <InputNumber
                    value={value.opacity}
                    onChange={(updated) => {
                      if (updated === null || updated === undefined) {
                        return;
                      }
                      value.opacity = updated;
                      onChange?.(value);
                    }}
                  />
                </SmallLabeledContainer>
                <SmallLabeledContainer displayName="Размер">
                  <Select
                    className={`${classes.size}`}
                    value={value.size}
                    options={[
                      { label: "original", value: "auto" },
                      { label: "cover", value: "cover" },
                      { label: "contain", value: "contain" },
                      { label: "fit", value: "100% 100%" },
                    ]}
                    onChange={(updated) => {
                      value.size = updated;
                      onChange?.(value);
                    }}
                  />
                </SmallLabeledContainer>
                <SmallLabeledContainer displayName="Если размер меньше виджета">
                  <Flex className={`${classes.repeatbutton}`} align="top">
                    <LightLabeledSwitchComponent
                      label="Повтор"
                      value={value.repeat}
                      onChange={(checked) => {
                        value.repeat = checked;
                        onChange?.(value);
                      }}
                    />
                  </Flex>
                </SmallLabeledContainer>
              </Flex>
            </Flex>
          )}
        </LabeledContainer>
      </>
    );
  },
);

export class BackgroundImageProperty extends DefaultWidgetProperty<ImagePropertyValue> {
  constructor(params: {
    name: string;
    value?: ImagePropertyValue;
    displayName?: string;
    help?: string;
  }) {
    super({
      name: params.name,
      value: {
        ...{
          url: null,
          size: "auto",
          repeat: false,
          opacity: 1,
        },
        ...params.value,
      },
      displayName: params.displayName ?? "background-image",
      help: params.help,
    });
  }

  public async calcCss(): Promise<CSSProperties> {
    if (!this.value.url) {
      return Promise.resolve({});
    }
    return fullUri(this.value.url).then((url) => {
      return {
        backgroundImage: `url(${url})`,
        backgroundSize: this.value.size,
        backgroundRepeat: this.value.repeat ? "repeat" : "no-repeat",
        opacity: this.value.opacity,
      };
    });
  }

  copy() {
    return new BackgroundImageProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      displayName: this.displayName,
      help: this.help,
    });
  }

  markup(): ReactNode {
    return (
      <ImagePropertyComponent
        displayName={this.displayName}
        value={this.value}
      />
    );
  }
}
