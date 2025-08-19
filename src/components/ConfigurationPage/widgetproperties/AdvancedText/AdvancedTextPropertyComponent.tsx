import { observer } from "mobx-react-lite";
import { AdvancedTextProperty } from "./AdvancedTextProperty";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { ImagePropertyComponent } from "../BackgroundImageProperty";
import classes from "./AdvancedTextPropertyComponent.module.css";
import { produce } from "immer";
import { toJS } from "mobx";
import { Tabs as AntTabs, ColorPicker, Flex, Select, Switch } from "antd";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
} from "../../../Overlay/Overlay";
import SecondaryButton from "../../../SecondaryButton/SecondaryButton";
import { Trans, useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import FontImport from "../../../FontImport/FontImport";
import { FontContext } from "../../../../stores/FontStore";
import InputNumber from "../../components/InputNumber";
import { ColorPropertyComponent } from "../ColorPropertyComponent";
import { ColorProperty, ColorPropertyTarget } from "../ColorProperty";
import { BorderedIconButton } from "../../../IconButton/IconButton";
import ArrowUp from "../../../../icons/ArrowUp";
import ArrowDown from "../../../../icons/ArrowDown";
import CloseIcon from "../../../../icons/CloseIcon";

const animations = [
  "none",
  "bounce",
  "flash",
  "pulse",
  "rubberBand",
  "shakeX",
  "shakeY",
  "headShake",
  "swing",
  "tada",
  "wobble",
  "jello",
  "heartBeat",
];

export const AdvancedTextPropertyComponent = observer(
  ({
    property,
    onChange,
  }: {
    property: AdvancedTextProperty;
    onChange?: (property: AdvancedTextProperty) => void;
  }) => {
    const { t } = useTranslation();
    const fonts = useContext(FontContext);
    const parentModalState = useContext(ModalStateContext);
    const [mainWindowModalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const [isOpen, setIsOpen] = useState<boolean>(() => false);

    return (
      <Flex vertical className={`${classes.container}`} gap={12}>
        <Flex align="center" gap={9} justify="space-between">
          <Flex align="center" gap={9}>
            <div className={`${classes.headertext}`}>
              {property.displayName}
            </div>
            <Switch
              value={property.text.showText}
              onChange={(checked) => {
                property.value = produce(toJS(property.value), (draft) => {
                  draft.text.showText = checked;
                });
              }}
            />
          </Flex>
          <Flex gap={9}>
            <BorderedIconButton onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ArrowUp /> : <ArrowDown />}
            </BorderedIconButton>
            <BorderedIconButton onClick={() => {}}>
              <CloseIcon color="#FF8888" />
            </BorderedIconButton>
          </Flex>
        </Flex>
        {isOpen && (
          <Flex vertical={true} gap={12} className="full-width">
            <Flex align="center" className="full-width" gap={9}>
              <ModalStateContext.Provider value={mainWindowModalState}>
                <SecondaryButton
                  onClick={() => {
                    mainWindowModalState.show = true;
                  }}
                >
                  Настройки шрифта
                </SecondaryButton>
                <Overlay>
                  <Panel>
                    <div className={`${classes.democontainer}`}>
                      <FontImport font={property.text.family} />;
                      <div
                        className={`${classes.demo} ${property.className}`}
                        style={property.css}
                      >
                        The quick brown fox jumps over the lazy dog
                      </div>
                      <div
                        className={`${classes.background}`}
                        style={{
                          background: `url(${process.env.PUBLIC_URL}/opacity.png)`,
                        }}
                      />
                    </div>
                    <AntTabs
                      type="card"
                      items={[
                        {
                          label: t("widget-font-fonttablabel"),
                          key: "font",
                          children: (
                            <>
                              <div className="settings-item">
                                <LabeledContainer
                                  displayName="button-font"
                                  help={<Trans i18nKey="font-select-help" />}
                                >
                                  <Select
                                    showSearch
                                    className="full-width"
                                    value={property.text.family}
                                    onChange={(selected) => {
                                      property.value = produce(
                                        toJS(property.value),
                                        (draft) => {
                                          draft.text.family = selected;
                                        },
                                      );
                                      if (onChange) onChange(property);
                                    }}
                                    options={fonts.all.sort().map((font) => {
                                      return {
                                        value: font.name,
                                        label: font.name,
                                      };
                                    })}
                                  />
                                </LabeledContainer>
                              </div>
                              <div className="settings-item">
                                <Flex justify="space-around" align="center">
                                  <Flex gap={5}>
                                    <Trans i18nKey="widget-font-bold" />
                                    <Switch
                                      value={property.text.weight}
                                      onChange={(checked) => {
                                        property.value = produce(
                                          toJS(property.value),
                                          (draft) => {
                                            draft.text.weight = checked;
                                          },
                                        );
                                        if (onChange) onChange(property);
                                      }}
                                    />
                                  </Flex>
                                  <Flex gap={5}>
                                    <Trans i18nKey="widget-font-italic" />
                                    <Switch
                                      value={property.text.italic}
                                      onChange={(checked) => {
                                        property.value = produce(
                                          toJS(property.value),
                                          (draft) => {
                                            draft.text.italic = checked;
                                          },
                                        );
                                        if (onChange) onChange(property);
                                      }}
                                    />
                                  </Flex>
                                </Flex>
                              </div>
                              <div className="settings-item">
                                <LabeledContainer displayName="button-font-size">
                                  <InputNumber
                                    value={property.text.size}
                                    addon="px"
                                    onChange={(value) => {
                                      if (
                                        value === null ||
                                        value === undefined
                                      ) {
                                        return;
                                      }
                                      property.value = produce(
                                        toJS(property.value),
                                        (draft) => {
                                          draft.text.size = value;
                                        },
                                      );
                                      if (onChange) onChange(property);
                                    }}
                                  />
                                </LabeledContainer>
                              </div>
                              <div className="settings-item">
                                <ColorPropertyComponent
                                  onChange={(value) => {
                                    property.value = produce(
                                      toJS(property.value),
                                      (draft) => {
                                        draft.text.color = value;
                                      },
                                    );
                                    if (onChange) onChange(property);
                                  }}
                                  property={
                                    new ColorProperty({
                                      name: "color",
                                      value: property.text.color,
                                      displayName: "button-text-color",
                                      target: ColorPropertyTarget.TEXT,
                                    })
                                  }
                                />
                              </div>
                              <div className="settings-item">
                                <LabeledContainer displayName="button-outline">
                                  <Flex align="center" gap={60}>
                                    <Flex gap={5}>
                                      <Switch
                                        value={property.text.outline.enabled}
                                        onChange={(checked) => {
                                          property.value = produce(
                                            toJS(property.value),
                                            (draft) => {
                                              draft.text.outline.enabled =
                                                checked;
                                            },
                                          );
                                        }}
                                      />
                                      <div>
                                        {property.text.outline.enabled
                                          ? "On"
                                          : "Off"}
                                      </div>
                                    </Flex>
                                    <Flex gap={5}>
                                      <InputNumber
                                        value={property.text.outline.width}
                                        addon="px"
                                        onChange={(value) => {
                                          if (
                                            value === null ||
                                            value === undefined
                                          ) {
                                            return;
                                          }
                                          property.value = produce(
                                            toJS(property.value),
                                            (draft) => {
                                              draft.text.outline.width = value;
                                            },
                                          );
                                          if (onChange) onChange(property);
                                        }}
                                      />
                                      <ColorPicker
                                        showText
                                        value={property.text.outline.color}
                                        onChange={(color) => {
                                          property.value = produce(
                                            toJS(property.value),
                                            (draft) => {
                                              draft.text.outline.color =
                                                color.toRgbString();
                                            },
                                          );
                                        }}
                                      />
                                    </Flex>
                                  </Flex>
                                </LabeledContainer>
                              </div>
                            </>
                          ),
                        },
                        {
                          label: t("widget-font-shadowtablabel"),
                          key: "shadow",
                          children: (
                            <>
                              <div className="settings-item">
                                <LabeledContainer displayName="button-shadow-offset-x">
                                  <InputNumber
                                    value={property.text.shadowOffsetX}
                                    addon="px"
                                    onChange={(value) => {
                                      if (
                                        value === undefined ||
                                        value === null
                                      ) {
                                        return;
                                      }
                                      property.value = produce(
                                        toJS(property.value),
                                        (draft) => {
                                          draft.text.shadowOffsetX = value;
                                        },
                                      );
                                      if (onChange) onChange(property);
                                    }}
                                  />
                                </LabeledContainer>
                              </div>
                              <div className="settings-item">
                                <LabeledContainer displayName="button-shadow-offset-y">
                                  <InputNumber
                                    value={property.text.shadowOffsetY}
                                    addon="px"
                                    onChange={(value) => {
                                      if (
                                        value === undefined ||
                                        value === null
                                      ) {
                                        return;
                                      }
                                      property.value = produce(
                                        toJS(property.value),
                                        (draft) => {
                                          draft.text.shadowOffsetY = value;
                                        },
                                      );
                                      if (onChange) onChange(property);
                                    }}
                                  />
                                </LabeledContainer>
                              </div>
                              <div className="settings-item">
                                <LabeledContainer displayName="button-shadow-size">
                                  <InputNumber
                                    value={property.text.shadowWidth}
                                    addon="px"
                                    onChange={(value) => {
                                      if (
                                        value === undefined ||
                                        value === null
                                      ) {
                                        return;
                                      }
                                      property.value = produce(
                                        toJS(property.value),
                                        (draft) => {
                                          draft.text.shadowWidth = value;
                                        },
                                      );
                                      if (onChange) onChange(property);
                                    }}
                                  />
                                </LabeledContainer>
                              </div>
                              <div className="settings-item">
                                <LabeledContainer
                                  displayName={"button-shadow-color"}
                                >
                                  <ColorPicker
                                    showText
                                    value={property.text.shadowColor}
                                    onChange={(color) => {
                                      property.value = produce(
                                        toJS(property.value),
                                        (draft) => {
                                          draft.text.shadowColor =
                                            color.toRgbString();
                                        },
                                      );
                                      if (onChange) onChange(property);
                                    }}
                                  />
                                </LabeledContainer>
                              </div>
                            </>
                          ),
                        },
                        {
                          label: t("widget-font-animationtablabel"),
                          key: "animation",
                          children: (
                            <>
                              <div className="settings-item">
                                <LabeledContainer displayName="widget-font-animation">
                                  <Select
                                    value={property.text.animation}
                                    className="full-width"
                                    onChange={(selected) => {
                                      property.value = produce(
                                        toJS(property.value),
                                        (draft) => {
                                          draft.text.animation = selected;
                                        },
                                      );
                                      if (onChange) onChange(property);
                                    }}
                                    options={animations.map((option) => {
                                      return {
                                        value: option,
                                        label: <Trans i18nKey={option} />,
                                      };
                                    })}
                                  />
                                </LabeledContainer>
                              </div>
                            </>
                          ),
                        },
                      ]}
                    />
                  </Panel>
                </Overlay>
              </ModalStateContext.Provider>
            </Flex>
            <Flex vertical className="full-width">
              <div className={`${classes.textlabel}`}>Текст</div>
              <textarea
                className={`${classes.text}`}
                value={property.text.value}
                onChange={(event) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.text.value = event.target.value;
                  });
                }}
              />
            </Flex>
            <Flex className="full-width">
              <ColorPropertyComponent
                property={{
                  value: property.value.background,
                  displayName: "Фон",
                }}
                onChange={(value) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.background = value;
                  });
                }}
              />
            </Flex>
            <Flex className="full-width">
              <ImagePropertyComponent
                property={{
                  value: property.value.backgroundImage,
                  displayName: "Фоновое изображение",
                }}
                onChange={(value) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.backgroundImage = value;
                  });
                }}
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    );
  },
);
