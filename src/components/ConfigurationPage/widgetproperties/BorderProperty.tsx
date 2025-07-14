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
//<Col span={4} offset={2}>
//  {label && <Trans i18nKey={label} />}
//</Col>

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

  Comp = observer(({}) => {
    return (
      <Flex vertical={true} gap={10}>
        <LabeledContainer help={this.help} displayName={this.displayName}>
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
            value={this.value.isSame}
            onChange={(checked) => {
              this.value.isSame = checked;
            }}
          />
        </LabeledContainer>
        {this.value.isSame === true && (
          <BorderSideComponent
            type={this.value.top.type}
            onTypeChange={(value) => {
              this.value = produce(toJS(this.value), (draft) => {
                draft.top.type = value;
                draft.right.type = value;
                draft.bottom.type = value;
                draft.left.type = value;
              });
            }}
            color={this.value.top.color}
            onColorChange={(value) => {
              this.value = produce(toJS(this.value), (draft) => {
                draft.top.color = value.toRgbString();
                draft.right.color = value.toRgbString();
                draft.bottom.color = value.toRgbString();
                draft.left.color = value.toRgbString();
              });
            }}
            width={this.value.top.width}
            onWidthChange={(value) => {
              if (value === undefined || value === null) {
                return;
              }
              this.value = produce(toJS(this.value), (draft) => {
                draft.top.width = value;
                draft.right.width = value;
                draft.left.width = value;
                draft.bottom.width = value;
              });
            }}
          />
        )}
        {this.value.isSame === false && (
          <Flex vertical={true} gap={5} className="full-width">
            <SmallLabeledContainer displayName="borderproperty-label-top">
              <BorderSideComponent
                type={this.value.top.type}
                onTypeChange={(value) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.top.type = value;
                  });
                }}
                color={this.value.top.color}
                onColorChange={(value) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.top.color = value.toRgbString();
                  });
                }}
                width={this.value.top.width}
                onWidthChange={(value) => {
                  if (value === undefined || value === null) {
                    return;
                  }
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.top.width = value;
                  });
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="borderproperty-label-right">
              <BorderSideComponent
                type={this.value.right.type}
                onTypeChange={(value) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.right.type = value;
                  });
                }}
                color={this.value.right.color}
                onColorChange={(value) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.right.color = value.toRgbString();
                  });
                }}
                width={this.value.right.width}
                onWidthChange={(value) => {
                  if (value === undefined || value === null) {
                    return;
                  }
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.right.width = value;
                  });
                }}
                label="borderproperty-label-right"
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="borderproperty-label-bottom">
              <BorderSideComponent
                type={this.value.bottom.type}
                onTypeChange={(value) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.bottom.type = value;
                  });
                }}
                color={this.value.bottom.color}
                onColorChange={(value) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.bottom.color = value.toRgbString();
                  });
                }}
                width={this.value.bottom.width}
                onWidthChange={(value) => {
                  if (value === undefined || value === null) {
                    return;
                  }
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.bottom.width = value;
                  });
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName="borderproperty-label-left">
              <BorderSideComponent
                type={this.value.left.type}
                onTypeChange={(value) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.left.type = value;
                  });
                }}
                color={this.value.left.color}
                onColorChange={(value) => {
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.left.color = value.toRgbString();
                  });
                }}
                width={this.value.left.width}
                onWidthChange={(value) => {
                  if (value === undefined || value === null) {
                    return;
                  }
                  this.value = produce(toJS(this.value), (draft) => {
                    draft.left.width = value;
                  });
                }}
              />
            </SmallLabeledContainer>
          </Flex>
        )}
      </Flex>
    );
  });

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
    return <this.Comp />;
  }
}
