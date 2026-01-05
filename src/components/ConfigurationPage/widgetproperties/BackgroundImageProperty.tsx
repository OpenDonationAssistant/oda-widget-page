import {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
import SecondaryButton from "../../Button/SecondaryButton";
import { CatalogItem, CatalogStoreContext } from "../../../stores/CatalogStore";
import {
  ModalStateContext,
  Panel,
  Overlay,
  Title,
  ModalState,
} from "../../Overlay/Overlay";
import { Card, CardList } from "../../Cards/CardsComponent";
import PrimaryButton from "../../Button/PrimaryButton";

export interface ImagePropertyValue {
  name: string | null;
  url: string | null;
  size: string;
  repeat: boolean;
  opacity: number;
}

const CatalogBrowse = ({
  onChange,
}: {
  onChange: (item: CatalogItem) => void;
}) => {
  const catalog = useContext(CatalogStoreContext);
  const [page, setPage] = useState<number>(0);
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const modalState = useContext(ModalStateContext);

  useEffect(() => {
    catalog.loadPage(page);
  }, [page]);

  return (
    <Overlay>
      <Panel>
        <Title>Галерея</Title>
        <CardList className={`${classes.fontlist} withscroll`}>
          {catalog.items.slice(0, page * 12 + 12).map((item) => (
            <Card
              selected={item.id === selected?.id}
              className={`${classes.fontpreview}`}
              key={item.id}
              onClick={() => {
                setSelected(item);
              }}
            >
              <img src={item.url} alt="" />
            </Card>
          ))}
        </CardList>
        <Flex className={`${classes.browsebuttons}`} justify="space-between">
          <SecondaryButton
            onClick={() => {
              setPage(0);
              setSelected(null);
              modalState.show = false;
            }}
          >
            Отменить
          </SecondaryButton>
          <SecondaryButton onClick={() => setPage((old) => old + 1)}>
            Показать ещё
          </SecondaryButton>
          <PrimaryButton
            disabled={!selected}
            onClick={() => {
              setPage(0);
              modalState.show = false;
              if (selected) {
                onChange(selected);
              }
            }}
          >
            Принять
          </PrimaryButton>
        </Flex>
      </Panel>
    </Overlay>
  );
};

export const DEFAULT_IMAGE_PROPERTY_VALUE = {
  name: null,
  url: null,
  size: "auto",
  repeat: false,
  opacity: 1,
};

export interface ImagePropertyComponentOptions {
  showOpacity?: boolean;
  showSize?: boolean;
  showRepeat?: boolean;
}

export const ImagePropertyComponent = observer(
  ({
    value,
    displayName,
    onChange,
    options,
  }: {
    value: ImagePropertyValue;
    displayName: string;
    onChange?: (value: ImagePropertyValue) => void;
    options?: ImagePropertyComponentOptions;
  }) => {
    const [image, setImage] = useState<string>(value.url ?? "");
    const parentModalState = useContext(ModalStateContext);
    const [modalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    useEffect(() => {
      fullUri(value.url).then(setImage);
    }, [value.url]);

    const showOpacity = options?.showOpacity ?? true;
    const showSize = options?.showSize ?? true;
    const showRepeat = options?.showRepeat ?? true;

    return (
      <ModalStateContext.Provider value={modalState}>
        <CatalogBrowse
          onChange={(item) => {
            value.url = item.url;
            value.name = "Системное изображение";
            onChange?.(value);
          }}
        />
        <LabeledContainer displayName={displayName}>
          {!value.url && (
            <Flex gap={6} className="full-width">
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
              <SecondaryButton
                onClick={() => {
                  modalState.show = true;
                }}
              >
                <span className="material-symbols-sharp">folder</span>
                <Trans i18nKey="button-browse" />
              </SecondaryButton>
            </Flex>
          )}
          {value.url && (
            <Flex vertical={true} className="full-width" justify="space-around">
              <SmallLabeledContainer displayName="Изображение">
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
              </SmallLabeledContainer>
              <Flex gap={6} align="bottom">
                {showOpacity && (
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
                )}
                {showSize && (
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
                )}
                {showRepeat && (
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
                )}
              </Flex>
            </Flex>
          )}
        </LabeledContainer>
      </ModalStateContext.Provider>
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
