import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { WidgetsContext } from "../WidgetsContext";
import { Tabs as AntTabs, Modal } from "antd";
import { FontProperty } from "./FontProperty";
import { NumberProperty } from "./NumberProperty";
import { ColorProperty } from "./ColorProperty";
import { BooleanProperty } from "./BooleanProperty";
import { produce } from "immer";
import { SingleChoiceProperty } from "./SingleChoiceProperty";
import { AnimatedFontProperty } from "./AnimatedFontProperty";
import classes from "./AnimatedFontComponent.module.css";

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
  const [showModal, setShowModal] = useState<boolean>();
  const { t } = useTranslation();
  const { updateConfig } = useContext(WidgetsContext);

  function toggleModal() {
    const classList = document.getElementById("root")?.classList;
    if (classList?.contains("blured")) {
      classList.remove("blured");
    } else {
      classList?.add("blured");
    }
    setShowModal((old) => !old);
  }

  return (
    <>
      {property.createFontImport()}
      <div className="widget-settings-item">
        <label className="widget-settings-name">{t(property._label)}</label>
        <button
          className={`${classes.button} oda-btn-default`}
          onClick={toggleModal}
        >
          {t("button-settings")}
        </button>
        <Modal
          title="Настройки шрифта"
          open={showModal}
          onCancel={toggleModal}
          onClose={toggleModal}
          onOk={toggleModal}
        >
          <div className={`${classes.democontainer}`}>
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
                    {new FontProperty(
                      property.widgetId,
                      "font-family",
                      "font",
                      property.value.family,
                      "button-font",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.family = value;
                        }),
                      );
                    })}
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
                    {new ColorProperty(
                      property.widgetId,
                      "color",
                      "color",
                      property.value.color,
                      "button-text-color",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.color = value;
                        }),
                      );
                    })}
                    {new BooleanProperty(
                      property.widgetId,
                      "bold",
                      "boolean",
                      property.value.weight,
                      "widget-font-bold",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.weight = value;
                        }),
                      );
                    })}
                    {new BooleanProperty(
                      property.widgetId,
                      "italic",
                      "boolean",
                      property.value.italic,
                      "widget-font-italic",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.italic = value;
                        }),
                      );
                    })}
                    {new BooleanProperty(
                      property.widgetId,
                      "bold",
                      "boolean",
                      property.value.underline,
                      "widget-font-underline",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.underline = value;
                        }),
                      );
                    })}
                  </>
                ),
              },
              {
                label: t("widget-font-shadowtablabel"),
                key: "shadow",
                children: (
                  <>
                    {new NumberProperty(
                      property.widgetId,
                      "shadow-offset-x",
                      "number",
                      property.value.shadowOffsetX,
                      "button-shadow-offset-x",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.shadowOffsetX = value;
                        }),
                      );
                    })}
                    {new NumberProperty(
                      property.widgetId,
                      "shadow-offset-y",
                      "number",
                      property.value.shadowOffsetY,
                      "button-shadow-offset-y",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.shadowOffsetY = value;
                        }),
                      );
                    })}
                    {new NumberProperty(
                      property.widgetId,
                      "shadow-size",
                      "number",
                      property.value.shadowWidth,
                      "button-shadow-size",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.shadowWidth = value;
                        }),
                      );
                    })}
                    {new ColorProperty(
                      property.widgetId,
                      "shadow-color",
                      "color",
                      property.value.shadowColor,
                      "button-shadow-color",
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.shadowColor = value;
                        }),
                      );
                    })}
                  </>
                ),
              },
              {
                label: t("widget-font-animationtablabel"),
                key: "animation",
                children: (
                  <>
                    {new SingleChoiceProperty(
                      property.widgetId,
                      "font-animation",
                      "choice",
                      property.value.animation,
                      "widget-font-animation",
                      animations,
                    ).markup((p1, p2, value) => {
                      updateConfig(
                        property.widgetId,
                        property.name,
                        produce(property.value, (draft) => {
                          draft.animation = value;
                        }),
                      );
                    })}
                  </>
                ),
              },
            ]}
          />
        </Modal>
      </div>
    </>
  );
}
