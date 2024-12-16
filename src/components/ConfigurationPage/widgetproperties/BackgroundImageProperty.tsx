import { CSSProperties, ChangeEvent, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import axios from "axios";
import { Trans } from "react-i18next";
import { Button, Flex, Image, Select, Switch, Upload } from "antd";
import classes from "./BackgroundImageProperty.module.css";
import InputNumber from "../components/InputNumber";

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
  const name = file.name.replace(/[^0-9a-z\.]/gi, "");
  return uploadFile(file, name).then((ignore: any) => {
    return name;
  });
};

export interface ImagePropertyValue {
  url: string | null;
  size: string;
  repeat: boolean;
  opacity: number;
}

const ImagePropertyComponent = observer(
  ({ property }: { property: BackgroundImageProperty }) => {
    return (
      <>
        <LabeledContainer displayName={property.displayName}>
          {!property.value.url && (
            <label
              className={`oda-btn-default ${classes.upload}`}
              style={{ marginRight: "10px" }}
            >
              <input
                type="file"
                onChange={(e) =>
                  handleFileUpload(e).then((name) => {
                    property.value = { ...property.value, ...{ url: name } };
                  })
                }
              />
              <span className="material-symbols-sharp">upload</span>
              <Trans i18nKey="button-upload" />
            </label>
          )}
          {property.value.url && (
            <Flex gap={10}>
              <Flex vertical={true} justify="space-around">
                <Flex gap={10} align="center">
                  <span>Прозрачность</span>
                  <InputNumber
                    value={property.value.opacity}
                    onChange={(value) => {
                      if (value === null || value === undefined) {
                        return;
                      }
                      property.value = { ...property.value, opacity: value };
                    }}
                  />
                </Flex>
                <Flex gap={10} align="center">
                  <span>Размер</span>
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
                    }}
                  />
                </Flex>
                <Flex gap={10} align="center">
                  <span>Повтор</span>
                  <Switch
                    checked={property.value.repeat}
                    onChange={(checked) => {
                      property.value = {
                        ...property.value,
                        repeat: checked,
                      };
                    }}
                  />
                </Flex>
              </Flex>
              <Image.PreviewGroup>
                <Image
                  width={200}
                  height={120}
                  className={`${classes.preview}`}
                  src={`${property.fullUri()}`}
                />
              </Image.PreviewGroup>
              <Flex vertical={true} justify="flex-start" align="flex-start">
                <Button
                  className={`${classes.deletebutton}`}
                  onClick={() =>
                    (property.value = {
                      url: null,
                      size: "auto",
                      repeat: false,
                    })
                  }
                >
                  <span className="material-symbols-sharp">delete</span>
                </Button>
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

  public fullUri(): string | null {
    if (!this.value.url) {
      return null;
    }
    if (this.value.url && this.value.url.startsWith("http")) {
      return this.value.url;
    }
    if (this.value.url && !this.value.url.startsWith("http")) {
      return `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${this.value.url}`;
    }
    return null;
  }

  public calcCss(): CSSProperties {
    if (this.value.url) {
      return {
        backgroundImage: `url(${this.fullUri()})`,
        backgroundSize: this.value.size,
        backgroundRepeat: this.value.repeat ? "repeat" : "no-repeat",
        opacity: this.value.opacity,
      };
    }
    return {};
  }

  markup(): ReactNode {
    return <ImagePropertyComponent property={this} />;
  }
}
