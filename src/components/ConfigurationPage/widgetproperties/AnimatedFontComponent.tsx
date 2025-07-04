import { Trans, useTranslation } from "react-i18next";

import { Tabs as AntTabs, ColorPicker, Flex, Select, Switch } from "antd";

import { produce } from "immer";
import { AnimatedFontProperty } from "./AnimatedFontProperty";
import classes from "./AnimatedFontComponent.module.css";
import ModalButton from "../../ModalButton/ModalButton";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorProperty, ColorPropertyTarget } from "./ColorProperty";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { ColorPropertyComponent } from "./ColorPropertyComponent";
import { log } from "../../../logging";
import InputNumber from "../components/InputNumber";
import { FontContext } from "../../../stores/FontStore";
import { useContext, useEffect, useState } from "react";

const animationType = ["entire", "by words", "by symbols"];

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

export const AnimatedFontComponent = observer(
  ({
    property,
    onChange,
  }: {
    property: AnimatedFontProperty;
    onChange?: (property: AnimatedFontProperty) => void;
  }) => {
    const { t } = useTranslation();
    const fonts = useContext(FontContext);
    const [fontList, setFontList] = useState<string[]>([]);

    useEffect(() => {
      fonts.list().then((list) => setFontList(list));
    }, [fonts]);

    return (
      <>
        <ModalButton
          className={classes.modal}
          label={t(property.label)}
          buttonLabel={"button-settings"}
          modalTitle="widget-font-settings"
          icon="settings"
        >
          <div className={`${classes.democontainer}`}>
            {property.createFontImport()}
            <div
              className={`${classes.demo} ${property.calcClassName()}`}
              style={property.calcStyle()}
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
                          value={property.value.family}
                          onChange={(selected) => {
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.family = selected;
                              },
                            );
                            if (onChange) onChange(property);
                          }}
                          options={fontList.sort().map((font) => {
                            return { value: font, label: font };
                          })}
                        />
                      </LabeledContainer>
                    </div>
                    <div className="settings-item">
                      <Flex justify="space-around" align="center">
                        <Flex gap={5}>
                          <Trans i18nKey="widget-font-bold" />
                          <Switch
                            value={property.value.weight}
                            onChange={(checked) => {
                              property.value = produce(
                                toJS(property.value),
                                (draft) => {
                                  draft.weight = checked;
                                },
                              );
                              if (onChange) onChange(property);
                            }}
                          />
                        </Flex>
                        <Flex gap={5}>
                          <Trans i18nKey="widget-font-italic" />
                          <Switch
                            value={property.value.italic}
                            onChange={(checked) => {
                              property.value = produce(
                                toJS(property.value),
                                (draft) => {
                                  draft.italic = checked;
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
                          value={property.value.size}
                          addon="px"
                          onChange={(value) => {
                            if (value === null || value === undefined) {
                              return;
                            }
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.size = value;
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
                          log.debug({ newValue: value }, "changing color");
                          property.value = produce(
                            toJS(property.value),
                            (draft) => {
                              draft.color = value;
                            },
                          );
                          if (onChange) onChange(property);
                        }}
                        property={
                          new ColorProperty({
                            name: "color",
                            value: property.value.color,
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
                              value={property.value.outline.enabled}
                              onChange={(checked) => {
                                property.value = produce(
                                  toJS(property.value),
                                  (draft) => {
                                    draft.outline.enabled = checked;
                                  },
                                );
                              }}
                            />
                            <div>
                              {property.value.outline.enabled ? "On" : "Off"}
                            </div>
                          </Flex>
                          <Flex gap={5}>
                            <InputNumber
                              value={property.value.outline.width}
                              addon="px"
                              onChange={(value) => {
                                if (value === null || value === undefined) {
                                  return;
                                }
                                property.value = produce(
                                  toJS(property.value),
                                  (draft) => {
                                    draft.outline.width = value;
                                  },
                                );
                                if (onChange) onChange(property);
                              }}
                            />
                            <ColorPicker
                              showText
                              value={property.value.outline.color}
                              onChange={(color) => {
                                property.value = produce(
                                  toJS(property.value),
                                  (draft) => {
                                    draft.outline.color = color.toRgbString();
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
                          value={property.value.shadowOffsetX}
                          addon="px"
                          onChange={(value) => {
                            if (value === undefined || value === null) {
                              return;
                            }
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.shadowOffsetX = value;
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
                          value={property.value.shadowOffsetY}
                          addon="px"
                          onChange={(value) => {
                            if (value === undefined || value === null) {
                              return;
                            }
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.shadowOffsetY = value;
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
                          value={property.value.shadowWidth}
                          addon="px"
                          onChange={(value) => {
                            if (value === undefined || value === null) {
                              return;
                            }
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.shadowWidth = value;
                              },
                            );
                            if (onChange) onChange(property);
                          }}
                        />
                      </LabeledContainer>
                    </div>
                    <div className="settings-item">
                      <LabeledContainer displayName={"button-shadow-color"}>
                        <ColorPicker
                          showText
                          value={property.value.shadowColor}
                          onChange={(color) => {
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.shadowColor = color.toRgbString();
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
                          value={property.value.animation}
                          className="full-width"
                          onChange={(selected) => {
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.animation = selected;
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
        </ModalButton>
      </>
    );
  },
);
