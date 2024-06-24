import { ReactNode, useContext, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Tabs as AntTabs, Modal } from "antd";
import { useTranslation } from "react-i18next";
import classes from "./AnimatedFontProperty.module.css";
import { ColorProperty } from "./ColorProperty";
import { FontProperty } from "./FontProperty";
import { NumberProperty } from "./NumberProperty";
import { WidgetsContext } from "../WidgetsContext";
import { produce } from "immer";
import FontImport from "../../FontImport/FontImport";
import { BooleanProperty } from "./BooleanProperty";
import { SingleChoiceProperty } from "./SingleChoiceProperty";

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

export class AnimatedFontProperty extends DefaultWidgetProperty {
  constructor(params: {
    widgetId: string;
    name: string;
    value?: any;
    tab?: string | undefined;
  }) {
    super(
      params.widgetId,
      params.name,
      "animatedfont",
      params.value ?? {
        family: "Roboto",
        size: 24,
        color: "#684aff",
        weight: false,
        italic: false,
        underline: false,
        shadowWidth: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "#000000",
        animation: "none",
        animationType: "entire",
      },
      "",
      params.tab,
    );
  }

  copy() {
    return new AnimatedFontProperty({
      widgetId: this.widgetId,
      name: this.name,
      value: this.value,
      tab: this.tab,
    });
  }

  calcClassName() {
    if (!this.value.animation) {
      return;
    }
    if (this.value.animation === "none") {
      return;
    }
    return `animate__animated animate__infinite animate__slower animate__${this.value.animation}`;
  }

  createFontImport() {
    return <FontImport font={this.value.family} />;
  }

  calcStyle() {
    return {
      color: this.value.color,
      fontSize: this.value.size,
      fontFamily: this.value.family,
      fontWeight: this.value.weight ? "bold" : "normal",
      textDecoration: this.value.underline ? "underline" : "none",
      fontStyle: this.value.italic ? "italic" : "normal",
      textShadow: `${this.value.shadowOffsetX}px ${this.value.shadowOffsetY}px ${this.value.shadowWidth}px ${this.value.shadowColor}`,
    };
  }

  button: React.FC = () => {
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
        {this.createFontImport()}
        <div className="widget-settings-item">
          <label className="widget-settings-name">
            {t("widget-font-label")}
          </label>
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
                className={`${classes.demo} ${this.calcClassName()}`}
                style={this.calcStyle()}
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
                        this.widgetId,
                        "font-family",
                        "font",
                        this.value.family,
                        "button-font",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
                            draft.family = value;
                          }),
                        );
                      })}
                      {new NumberProperty(
                        this.widgetId,
                        "font-size",
                        "number",
                        this.value.size,
                        "button-font-size",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
                            draft.size = value;
                          }),
                        );
                      })}
                      {new ColorProperty(
                        this.widgetId,
                        "color",
                        "color",
                        this.value.color,
                        "button-text-color",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
                            draft.color = value;
                          }),
                        );
                      })}
                      {new BooleanProperty(
                        this.widgetId,
                        "bold",
                        "boolean",
                        this.value.weight,
                        "widget-font-bold",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
                            draft.weight = value;
                          }),
                        );
                      })}
                      {new BooleanProperty(
                        this.widgetId,
                        "italic",
                        "boolean",
                        this.value.italic,
                        "widget-font-italic",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
                            draft.italic = value;
                          }),
                        );
                      })}
                      {new BooleanProperty(
                        this.widgetId,
                        "bold",
                        "boolean",
                        this.value.underline,
                        "widget-font-underline",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
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
                        this.widgetId,
                        "shadow-offset-x",
                        "number",
                        this.value.shadowOffsetX,
                        "button-shadow-offset-x",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
                            draft.shadowOffsetX = value;
                          }),
                        );
                      })}
                      {new NumberProperty(
                        this.widgetId,
                        "shadow-offset-y",
                        "number",
                        this.value.shadowOffsetY,
                        "button-shadow-offset-y",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
                            draft.shadowOffsetY = value;
                          }),
                        );
                      })}
                      {new NumberProperty(
                        this.widgetId,
                        "shadow-size",
                        "number",
                        this.value.shadowWidth,
                        "button-shadow-size",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
                            draft.shadowWidth = value;
                          }),
                        );
                      })}
                      {new ColorProperty(
                        this.widgetId,
                        "shadow-color",
                        "color",
                        this.value.shadowColor,
                        "button-shadow-color",
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
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
                        this.widgetId,
                        "font-animation",
                        "choice",
                        this.value.animation,
                        "widget-font-animation",
                        animations,
                      ).markup((p1, p2, value) => {
                        updateConfig(
                          this.widgetId,
                          this.name,
                          produce(this.value, (draft) => {
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
  };

  markup(): ReactNode {
    return <>{this.button({})}</>;
  }
}
