import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorPicker, Flex, Segmented } from "antd";
import { produce } from "immer";
import { toJS } from "mobx";
import InputNumber from "../components/InputNumber";
import classes from "./BoxShadowProperty.module.css";
import { log } from "../../../logging";
import { t } from "i18next";
import CloseIcon from "../../../icons/CloseIcon";
import CopyIcon from "../../../icons/CopyIcon";
import SubActionButton from "../../Button/SubActionButton";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";
import AddIcon from "../../../icons/AddIcon";

interface BoxShadow {
  inset: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}

export interface BoxShadowPropertyValue {
  shadows: BoxShadow[];
}

export const DEFAULT_SHADOW = {
  inset: false,
  x: 0,
  y: 0,
  blur: 0,
  spread: 0,
  color: "#000000",
};

// TODO: 18n
export const BoxShadowPropertyComponent = observer(
  ({
    displayName,
    help,
    value,
    buttonClassName,
  }: {
    displayName?: string;
    help?: string;
    value: BoxShadowPropertyValue;
    buttonClassName?: string;
  }) => {
    return (
      <>
        <LabeledContainer help={help} displayName={displayName ?? ""}>
          <Flex vertical gap={12} className="full-width">
            {value.shadows.map((shadow, i) => (
              <Flex vertical gap={12} className={`${classes.shadowitem}`}>
                <Flex align="center" className="full-width" gap={12}>
                  <Segmented
                    className={`${classes.shadowtype}`}
                    value={shadow.inset}
                    options={[
                      { label: t("Inset"), value: true },
                      { label: t("Outset"), value: false },
                    ]}
                    onChange={(updated) => {
                      value.shadows[i].inset = updated;
                    }}
                  />
                  <div className={`${classes.colorcontainer}`}>
                    <ColorPicker
                      showText
                      className={`${classes.colorpicker}`}
                      value={shadow.color}
                      onChange={(updated) =>
                        (value.shadows[i].color = updated.toRgbString())
                      }
                    />
                  </div>
                </Flex>
                <Flex gap={9}>
                  <SmallLabeledContainer
                    className={classes.label}
                    displayName="Смещение по горизонтали"
                  >
                    <InputNumber
                      value={shadow.x}
                      addon="px"
                      onChange={(updated) => (value.shadows[i].x = updated)}
                    />
                  </SmallLabeledContainer>
                  <SmallLabeledContainer displayName="Смещение по вертикали">
                    <InputNumber
                      value={shadow.y}
                      addon="px"
                      onChange={(updated) => (value.shadows[i].y = updated)}
                    />
                  </SmallLabeledContainer>
                </Flex>
                <Flex gap={9}>
                  <SmallLabeledContainer displayName="Размытие">
                    <InputNumber
                      value={shadow.blur}
                      addon="px"
                      onChange={(updated) => (value.shadows[i].blur = updated)}
                    />
                  </SmallLabeledContainer>
                  <SmallLabeledContainer displayName="Растяжение">
                    <InputNumber
                      value={shadow.spread}
                      addon="px"
                      onChange={(updated) =>
                        (value.shadows[i].spread = updated)
                      }
                    />
                  </SmallLabeledContainer>
                </Flex>
                <Flex className="full-width" justify="flex-end" gap={12}>
                  <SubActionButton
                    onClick={() => {
                      const toCopy = value.shadows.at(i);
                      if (toCopy) {
                        value.shadows.splice(i, 0, toCopy);
                      }
                    }}
                  >
                    <CopyIcon />
                    <div>Копировать</div>
                  </SubActionButton>
                  <SubActionButton onClick={() => value.shadows.splice(i, 1)}>
                    <CloseIcon color="#FF8888" />
                    <div style={{ color: "#FF8888" }}>Удалить</div>
                  </SubActionButton>
                </Flex>
              </Flex>
            ))}
            <button
              className={`${classes.addbutton} ${buttonClassName}`}
              onClick={() => {
                value.shadows.push({
                  inset: false,
                  x: 0,
                  y: 0,
                  blur: 0,
                  spread: 0,
                  color: "#000000",
                });
              }}
            >
              <Flex justify="center" align="center" gap={3}>
                <AddIcon color="var(--oda-color-150)" />
                <div>Добавить тень</div>
              </Flex>
            </button>
          </Flex>
        </LabeledContainer>
      </>
    );
  },
);

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

  copy() {
    return new BoxShadowProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      displayName: this.displayName,
      help: this.help,
    });
  }

  markup(): ReactNode {
    return <BoxShadowPropertyComponent value={this.value} />;
  }
}
