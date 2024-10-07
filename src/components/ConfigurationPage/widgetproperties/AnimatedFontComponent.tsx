import React, { useContext, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { WidgetsContext } from "../WidgetsContext";
import {
  Tabs as AntTabs,
  ColorPicker,
  Flex,
  InputNumber,
  Modal,
  Switch,
} from "antd";
import { FontProperty } from "./FontProperty";
import { NumberProperty } from "./NumberProperty";
import { produce } from "immer";
import { SingleChoiceProperty } from "./SingleChoiceProperty";
import { AnimatedFontProperty } from "./AnimatedFontProperty";
import classes from "./AnimatedFontComponent.module.css";
import ModalButton from "../../ModalButton/ModalButton";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorProperty, ColorPropertyTarget } from "./ColorProperty";

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

export default function AnimatedFontComponent({
  property,
}: {
  property: AnimatedFontProperty;
}) {
  const { t } = useTranslation();
  const { updateConfig } = useContext(WidgetsContext);

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
                    {new FontProperty({
                      name: "font-family",
                      value: property.value.family,
                      displayName: "button-font",
                      notifier: { notify: () => {}}, // TODO: add notifier
                    }).markup()}
                  </div>
                  <div className="settings-item">
                    {new NumberProperty(
                      property.widgetId,
                      "font-size",
                      "number",
                      property.value.size,
                      "button-font-size",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.size = value;
                        }),
                      );
                    })}
                  </div>
                  <div className="settings-item">
                    {new ColorProperty({
                      widgetId: property.widgetId,
                      name: "color",
                      value: property.value.color,
                      displayName: "button-text-color",
                      target: ColorPropertyTarget.TEXT
                    }).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.color = value;
                        }),
                      );
                    })}
                  </div>
                  <div className="settings-item">
                    <Flex justify="space-around" align="center">
                      <Flex gap={5}>
                        <Trans i18nKey="widget-font-bold" />
                        <Switch
                          value={property.value.weight}
                          onChange={(checked) => {
                            updateConfig(
                              property.widgetId,
                              property.name,
                              produce(property.value, (draft) => {
                                draft.weight = checked;
                              }),
                            );
                          }}
                        />
                      </Flex>
                      <Flex gap={5}>
                        <Trans i18nKey="widget-font-italic" />
                        <Switch
                          value={property.value.italic}
                          onChange={(checked) => {
                            updateConfig(
                              property.widgetId,
                              property.name,
                              produce(property.value, (draft) => {
                                draft.italic = checked;
                              }),
                            );
                          }}
                        />
                      </Flex>
                    </Flex>
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
                        className="full-width"
                        addonAfter="px"
                        onChange={(value) => {
                          updateConfig(
                            property.widgetId,
                            property.name,
                            produce(property.value, (draft) => {
                              draft.shadowOffsetX = value;
                            }),
                          );
                        }}
                      />
                    </LabeledContainer>
                  </div>
                  <div className="settings-item">
                    <LabeledContainer displayName="button-shadow-offset-y">
                      <InputNumber
                        value={property.value.shadowOffsetY}
                        className="full-width"
                        addonAfter="px"
                        onChange={(value) => {
                          updateConfig(
                            property.widgetId,
                            property.name,
                            produce(property.value, (draft) => {
                              draft.shadowOffsetY = value;
                            }),
                          );
                        }}
                      />
                    </LabeledContainer>
                  </div>
                  <div className="settings-item">
                    <LabeledContainer displayName="button-shadow-size">
                      <InputNumber
                        value={property.value.shadowWidth}
                        addonAfter="px"
                        className="full-width"
                        onChange={(value) => {
                          updateConfig(
                            property.widgetId,
                            property.name,
                            produce(property.value, (draft) => {
                              draft.shadowWidth = value;
                            }),
                          );
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
                          updateConfig(
                            property.widgetId,
                            property.name,
                            produce(property.value, (draft) => {
                              draft.shadowColor = color;
                            }),
                          );
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
                    {new SingleChoiceProperty({
                      widgetId: property.widgetId,
                      name: "font-animation",
                      value: property.value.animation,
                      displayName: "widget-font-animation",
                      options: animations,
                    }).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.animation = value;
                        }),
                      );
                    })}
                  </div>
                </>
              ),
            },
          ]}
        />
      </ModalButton>
    </>
  );
}
