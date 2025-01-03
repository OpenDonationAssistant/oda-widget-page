import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Button, ColorPicker, Flex, Segmented } from "antd";
import { produce } from "immer";
import { toJS } from "mobx";
import InputNumber from "../components/InputNumber";
import classes from "./BoxShadowProperty.module.css";
import { log } from "../../../logging";
import { t } from "i18next";

interface BoxShadow {
  inset: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}

interface BoxShadowPropertyValue {
  shadows: BoxShadow[];
}

export class BoxShadowProperty extends DefaultWidgetProperty<BoxShadowPropertyValue> {
  constructor(params: {
    name: string;
    value?: BoxShadowPropertyValue;
    displayName?: string;
    help?: string;
  }) {
    super({
      name: params.name,
      value: params.value ?? {
        shadows: [],
      },
      displayName: params.displayName ?? "box-shadow",
      help: params.help,
    });
  }

  public get requiredHeight(): number {
    log.debug(
      { shadows: toJS(this.value.shadows) },
      "calculating requiredHeight",
    );
    const heights = this.value.shadows.flatMap((shadow) => {
      return [
        Math.abs(shadow.y) + shadow.blur,
        Math.abs(shadow.y) + shadow.spread,
      ];
    });
    return heights.length === 0 ? 0 : Math.max(...heights);
  }

  public get requiredWidth(): number {
    log.debug(
      { shadows: toJS(this.value.shadows) },
      "calculating requiredWidth",
    );
    const widths = this.value.shadows.flatMap((shadow) => {
      return [
        Math.abs(shadow.x) + shadow.blur,
        Math.abs(shadow.x) + shadow.spread,
      ];
    });
    return widths.length === 0 ? 0 : Math.max(...widths);
  }

  private addShadow() {
    this.value = produce(toJS(this.value), (draft) => {
      draft.shadows.push({
        inset: false,
        x: 0,
        y: 0,
        blur: 0,
        spread: 0,
        color: "#000000",
      });
    });
  }

  // TODO: 18n
  BoxShadowPropertyComponent = observer(() => {
    return (
      <>
        <LabeledContainer help={this.help} displayName={this.displayName}>
          <Button className="oda-btn-default" onClick={() => this.addShadow()}>
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">add</span>
              <div>Добавить тень</div>
            </Flex>
          </Button>
        </LabeledContainer>
        <Flex vertical={true} gap={10}>
          {this.value.shadows.map((shadow, i) => (
            <Flex
              align="center"
              justify="center"
              gap={10}
              className={`${classes.shadowitem}`}
            >
              <Segmented
                value={shadow.inset}
                options={[
                  { label: t("Inset"), value: true },
                  { label: t("Outset"), value: false },
                ]}
                onChange={(value) =>
                  (this.value = produce(toJS(this.value), (draft) => {
                    draft.shadows[i].inset = value;
                  }))
                }
              />
              <ColorPicker
                showText
                className={`${classes.colorpicker}`}
                value={shadow.color}
                onChange={(value) =>
                  (this.value = produce(toJS(this.value), (draft) => {
                    draft.shadows[i].color = value.toRgbString();
                  }))
                }
              />
              <Flex vertical={true} gap={10}>
                <LabeledContainer
                  className={classes.label}
                  displayName="Смещение по горизонтали"
                >
                  <InputNumber
                    value={shadow.x}
                    addon="px"
                    onChange={(value) =>
                      (this.value = produce(toJS(this.value), (draft) => {
                        draft.shadows[i].x = value;
                      }))
                    }
                  />
                </LabeledContainer>
                <LabeledContainer displayName="Смещение по вертикали">
                  <InputNumber
                    value={shadow.y}
                    addon="px"
                    onChange={(value) =>
                      (this.value = produce(toJS(this.value), (draft) => {
                        draft.shadows[i].y = value;
                      }))
                    }
                  />
                </LabeledContainer>
                <LabeledContainer displayName="Размытие">
                  <InputNumber
                    value={shadow.blur}
                    addon="px"
                    onChange={(value) =>
                      (this.value = produce(toJS(this.value), (draft) => {
                        draft.shadows[i].blur = value;
                      }))
                    }
                  />
                </LabeledContainer>
                <LabeledContainer displayName="Растяжение">
                  <InputNumber
                    value={shadow.spread}
                    addon="px"
                    onChange={(value) =>
                      (this.value = produce(toJS(this.value), (draft) => {
                        draft.shadows[i].spread = value;
                      }))
                    }
                  />
                </LabeledContainer>
              </Flex>
              <Button
                className="oda-btn-default"
                onClick={() =>
                  (this.value = produce(toJS(this.value), (draft) => {
                    draft.shadows.splice(i, 1);
                  }))
                }
              >
                <Flex justify="center" align="center" gap={3}>
                  <span className="material-symbols-sharp">delete</span>
                  <div>Удалить тень</div>
                </Flex>
              </Button>
            </Flex>
          ))}
        </Flex>
      </>
    );
  });

  public calcCss(): CSSProperties {
    let result = "";
    this.value.shadows.forEach((shadow) => {
      if (result.length > 0) {
        result += ", ";
      }
      result += `${shadow.inset ? "inset " : ""}${shadow.x}px ${shadow.y}px ${
        shadow.blur
      }px ${shadow.spread}px ${shadow.color}`;
    });
    if (result.length === 0) {
      result = "none";
    }
    return { boxShadow: result };
  }

  markup(): ReactNode {
    return <this.BoxShadowPropertyComponent />;
  }
}
