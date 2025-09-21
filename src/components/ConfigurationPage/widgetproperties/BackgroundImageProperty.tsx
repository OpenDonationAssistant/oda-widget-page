import {
  CSSProperties,
  ChangeEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import axios from "axios";
import { Trans } from "react-i18next";
import { Button, Flex, Image, Select, Switch, Upload } from "antd";
import classes from "./BackgroundImageProperty.module.css";
import InputNumber from "../components/InputNumber";
import { produce } from "immer";
import { toJS } from "mobx";
import { uuidv7 } from "uuidv7";
import CloseIcon from "../../../icons/CloseIcon";
import SubActionButton from "../../SubActionButton/SubActionButton";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";
import { LightLabeledSwitchComponent } from "../../LabeledSwitch/LabeledSwitchComponent";
import { fullUri } from "../../../utils";

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
  return uploadFile(file, name).then((ignore: any) => {
    return { name: file.name, url: name };
  });
};

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
    property,
    onChange,
  }: {
    property: { value: ImagePropertyValue; displayName: string };
    onChange?: (value: ImagePropertyValue) => void;
  }) => {
    const [image, setImage] = useState<string>(property.value.url ?? "");

    useEffect(() => {
      fullUri(property.value.url).then(setImage);
    }, [property.value.url]);

    return (
      <>
        <LabeledContainer displayName={property.displayName}>
          {!property.value.url && (
            <label className={`${classes.upload}`}>
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((result) => {
                    property.value = {
                      ...property.value,
                      ...{ url: result.url, name: result.name },
                    };
                    onChange?.(property.value);
                  })
                }
              />
              <span className="material-symbols-sharp">upload</span>
              <Trans i18nKey="button-upload" />
            </label>
          )}
          {property.value.url && (
            <Flex vertical={true} className="full-width" justify="space-around">
              <Flex
                gap={10}
                align="center"
                className={`${classes.previewcontainer}`}
                justify="space-between"
              >
                <div>{property.value.name}</div>
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
                      property.value = {
                        name: null,
                        url: null,
                        size: "auto",
                        repeat: false,
                        opacity: 1,
                      };
                      onChange?.(property.value);
                    }}
                  >
                    <div>Загрузить</div>
                  </SubActionButton>
                  <SubActionButton
                    onClick={() => {
                      property.value = {
                        name: null,
                        url: null,
                        size: "auto",
                        repeat: false,
                        opacity: 1,
                      };
                      onChange?.(property.value);
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
                    value={property.value.opacity}
                    onChange={(value) => {
                      if (value === null || value === undefined) {
                        return;
                      }
                      property.value = { ...property.value, opacity: value };
                      onChange?.(property.value);
                    }}
                  />
                </SmallLabeledContainer>
                <SmallLabeledContainer displayName="Размер">
                  <Select
                    className={`${classes.size}`}
                    value={property.value.size}
                    options={[
                      { label: "original", value: "auto" },
                      { label: "cover", value: "cover" },
                      { label: "contain", value: "contain" },
                      { label: "fit", value: "100% 100%" },
                    ]}
                    onChange={(value) => {
                      property.value = { ...property.value, size: value };
                      onChange?.(property.value);
                    }}
                  />
                </SmallLabeledContainer>
                <SmallLabeledContainer displayName="Если размер меньше виджета">
                  <Flex className={`${classes.repeatbutton}`} align="top">
                    <LightLabeledSwitchComponent
                      label="Повтор"
                      value={property.value.repeat}
                      onChange={(checked) => {
                        property.value = {
                          ...property.value,
                          repeat: checked,
                        };
                        onChange?.(property.value);
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
    return <ImagePropertyComponent property={this} />;
  }
}
