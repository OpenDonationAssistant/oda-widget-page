import React from "react";
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
import { Fonts } from "../settings/FontSelect";
import { ColorPropertyComponent } from "./ColorPropertyComponent";
import { log } from "../../../logging";
import InputNumber from "../components/InputNumber";

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

    return (
      <>
        <ModalButton
          label={t(property.label)}
          buttonLabel={"button-settings"}
          modalTitle="widget-font-settings"
        >
          <div className={`${classes.democontainer}`}>
            {property.createFontImport()}
            <div
              className={`${classes.demo} ${property.calcClassName()}`}
              style={property.calcStyle()}
            >
              Это текст для демонстрации
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
                      <LabeledContainer displayName="button-font">
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
                          options={Fonts.sort().map((font) => {
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
                            if (!value) {
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
