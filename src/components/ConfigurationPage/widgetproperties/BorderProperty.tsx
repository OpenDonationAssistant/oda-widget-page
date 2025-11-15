import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorPicker, Flex, Segmented, Select } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { produce } from "immer";
import InputNumber from "../components/InputNumber";
import { Color } from "antd/es/color-picker";
import { log } from "../../../logging";
import classes from "./BorderProperty.module.css";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";

export interface Border {
  width: number;
  type: string;
  color: string;
}

export const DEFAULT_BORDER = {
  width: 1,
  type: "solid",
  color: "#000000",
};

export interface BorderPropertyValue {
  isSame: boolean | null;
  bottom: Border;
  top: Border;
  left: Border;
  right: Border;
}

export const DEFAULT_BORDER_PROPERTY_VALUE: BorderPropertyValue = {
  isSame: null,
  bottom: DEFAULT_BORDER,
  top: DEFAULT_BORDER,
  left: DEFAULT_BORDER,
  right: DEFAULT_BORDER,
};

export const BorderPropertyComponent = observer(
  ({
    help,
    displayName,
    value,
  }: {
    help: string;
    displayName: string;
    value: BorderPropertyValue;
  }) => {
    return (
      <Flex vertical={true} gap={10}>
        <LabeledContainer help={help} displayName={displayName}>
          <Segmented
            block
            className="full-width"
            options={[
              {
                value: null,
                label: "Отсутствует",
              },
              {
                value: true,
                label: "Общая",
              },
              {
                value: false,
                label: "По сторонам",
              },
            ]}
            value={value.isSame}
            onChange={(checked) => {
              value.isSame = checked;
            }}
          />
        </LabeledContainer>
        {value.isSame === true && (
          <BorderSideComponent
            type={value.top.type}
            onTypeChange={(updated) => {
              value.top.type = updated;
              value.right.type = updated;
              value.bottom.type = updated;
              value.left.type = updated;
            }}
            color={value.top.color}
            onColorChange={(updated) => {
              value.top.color = updated.toRgbString();
              value.right.color = updated.toRgbString();
              value.bottom.color = updated.toRgbString();
              value.left.color = updated.toRgbString();
            }}
            width={value.top.width}
            onWidthChange={(updated) => {
              if (updated === undefined || updated === null) {
                return;
              }
              value.top.width = updated;
              value.right.width = updated;
              value.left.width = updated;
              value.bottom.width = updated;
            }}
          />
        )}
        {value.isSame === false && (
          <Flex vertical={true} gap={5} className="full-width">
            <SmallLabeledContainer displayName="borderproperty-label-top">
              <BorderSideComponent
                type={value.top.type}
                onTypeChange={(updated) => {
                  value.top.type = updated;
                }}
                color={value.top.color}
                onColorChange={(updated) => {
                  value.top.color = updated.toRgbString();
                }}
                width={value.top.width}
                onWidthChange={(updated) => {
                  if (updated === undefined || updated === null) {
                    return;
                  }
                  value.top.width = updated;
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="borderproperty-label-right">
              <BorderSideComponent
                type={value.right.type}
                onTypeChange={(updated) => {
                  value.right.type = updated;
                }}
                color={value.right.color}
                onColorChange={(updated) => {
                  value.right.color = updated.toRgbString();
                }}
                width={value.right.width}
                onWidthChange={(updated) => {
                  if (updated === undefined || updated === null) {
                    return;
                  }
                  value.right.width = updated;
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="borderproperty-label-bottom">
              <BorderSideComponent
                type={value.bottom.type}
                onTypeChange={(updated) => {
                  value.bottom.type = updated;
                }}
                color={value.bottom.color}
                onColorChange={(updated) => {
                  value.bottom.color = updated.toRgbString();
                }}
                width={value.bottom.width}
                onWidthChange={(updated) => {
                  if (updated === undefined || updated === null) {
                    return;
                  }
                  value.bottom.width = updated;
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="borderproperty-label-left">
              <BorderSideComponent
                type={value.left.type}
                onTypeChange={(updated) => {
                  value.left.type = updated;
                }}
                color={value.left.color}
                onColorChange={(updated) => {
                    value.left.color = updated.toRgbString();
                }}
                width={value.left.width}
                onWidthChange={(updated) => {
                  if (updated === undefined || updated === null) {
                    return;
                  }
                  value.left.width = updated;
                }}
              />
            </SmallLabeledContainer>
          </Flex>
        )}
      </Flex>
    );
  },
);

const BorderSideComponent = ({
  type,
  onTypeChange,
  color,
  onColorChange,
  width,
  onWidthChange,
}: {
  type: string;
  onTypeChange: (value: string) => void;
  color: string;
  onColorChange: (value: Color) => void;
  width: number;
  onWidthChange: (value: number) => void;
}) => {
  return (
    <Flex gap={9} className="full-width">
      <Select
        className={`${classes.select}`}
        value={type}
        onChange={onTypeChange}
        options={[
          {
            value: "solid",
            label: "solid",
          },
          {
            value: "dotted",
            label: "dotted",
          },
          {
            value: "dashed",
            label: "dashed",
          },
          {
            value: "double",
            label: "double",
          },
          {
            value: "groove",
            label: "groove",
          },
          {
            value: "ridge",
            label: "ridge",
          },
          {
            value: "inset",
            label: "inset",
          },
          {
            value: "outset",
            label: "outset",
          },
        ]}
      />
      <InputNumber value={width} addon="px" onChange={onWidthChange} />
      <Flex className={`${classes.colorpicker}`}>
        <ColorPicker showText value={color} onChange={onColorChange} />
      </Flex>
    </Flex>
  );
};

export class BorderProperty extends DefaultWidgetProperty<BorderPropertyValue> {
  constructor(params: {
    name: string;
    value?: BorderPropertyValue;
    displayName?: string;
    help?: string;
  }) {
    super({
      name: params.name,
      value: params.value ?? DEFAULT_BORDER_PROPERTY_VALUE,
      displayName: params.displayName ?? "border",
      help: params.help,
    });
  }

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    style.borderTop = "none";
    style.borderRight = "none";
    style.borderLeft = "none";
    style.borderBottom = "none";
    if (this.value.isSame === true) {
      const rule = this.createRule(this.value.top);
      style.borderTop = rule;
      style.borderRight = rule;
      style.borderLeft = rule;
      style.borderBottom = rule;
    }
    if (this.value.isSame === false) {
      style.borderTop = this.createRule(this.value.top);
      style.borderRight = this.createRule(this.value.right);
      style.borderLeft = this.createRule(this.value.left);
      style.borderBottom = this.createRule(this.value.bottom);
    }
    return style;
  }

  private createRule(border: Border) {
    log.debug({ borderProperty: border }, "create css for border");
    return `${border.width}px ${border.type} ${border.color}`;
  }

  copy() {
    return new BorderProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      displayName: this.displayName,
      help: this.help,
    });
  }

  markup(): ReactNode {
    return (
      <BorderPropertyComponent
        value={this.value}
        help={this.help ?? ""}
        displayName={this.displayName}
      />
    );
  }
}
