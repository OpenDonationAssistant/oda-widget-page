import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorPicker, Flex, InputNumber, Switch } from "antd";
import { produce } from "immer";
import ModalButton from "../../ModalButton/ModalButton";
import classes from "./BorderProperty.module.css";

export interface Border {
  width: number;
  color: string;
  type: string;
}

export interface BorderPropertyValue {
  isSame: boolean;
  bottom: Border;
  top: Border;
  left: Border;
  right: Border;
}

const DEFAULT_BORDER_VALUE = {
  width: 0,
  color: "#FFFFFF",
  type: "solid",
};

export const DEFAULT_BORDER_PROPERTY_VALUE: BorderPropertyValue = {
  isSame: true,
  bottom: DEFAULT_BORDER_VALUE,
  top: DEFAULT_BORDER_VALUE,
  left: DEFAULT_BORDER_VALUE,
  right: DEFAULT_BORDER_VALUE,
};

export class BorderProperty extends DefaultWidgetProperty {
  constructor({
    widgetId,
    name,
    value,
    tab,
  }: {
    widgetId: string;
    name: string;
    value?: BorderPropertyValue;
    tab?: string;
  }) {
    super(
      widgetId,
      name,
      "predefined",
      value ?? DEFAULT_BORDER_PROPERTY_VALUE,
      "",
      tab,
    );
  }

  copy(): BorderProperty {
    return new BorderProperty({
      widgetId: this.widgetId,
      name: this.name,
      value: this.value,
      tab: this.tab,
    });
  }

  comp = (updateConfig: Function) => {
    return (
      <>
        <ModalButton
          label={this.name}
          buttonLabel="button-settings"
          modalTitle="borderproperty-modal-title"
        >
          <Flex justify="center">
            <div className={`${classes.demo}`} style={this.calcCss()} />
          </Flex>
          <LabeledContainer displayName="borderproperty-label-same">
            <Switch
              checked={this.value.isSame}
              onChange={(checked) => {
                const updated = produce(
                  this.value,
                  (draft: BorderPropertyValue) => {
                    draft.isSame = checked;
                  },
                );
                updateConfig(this.widgetId, this.name, updated);
              }}
            />
          </LabeledContainer>
          {this.value.isSame && (
            <>
              <LabeledContainer displayName="borderproperty-label-borders">
                <Flex gap={2}>
                  <ColorPicker
                    showText
                    value={this.value.top.color}
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.top.color = value.toRgbString();
                          draft.right.color = value.toRgbString();
                          draft.bottom.color = value.toRgbString();
                          draft.left.color = value.toRgbString();
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                  <InputNumber
                    value={this.value.top.width}
                    addonAfter="px"
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.top.width = value;
                          draft.right.width = value;
                          draft.left.width = value;
                          draft.bottom.width = value;
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                </Flex>
              </LabeledContainer>
            </>
          )}
          {!this.value.isSame && (
            <>
              <LabeledContainer displayName="borderproperty-label-top">
                <Flex gap={2}>
                  <ColorPicker
                    showText
                    value={this.value.top.color}
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.top.color = value.toRgbString();
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                  <InputNumber
                    value={this.value.top.width}
                    addonAfter="px"
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.top.width = value;
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                </Flex>
              </LabeledContainer>
              <LabeledContainer displayName="borderproperty-label-right">
                <Flex gap={2}>
                  <ColorPicker
                    showText
                    value={this.value.right.color}
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.right.color = value.toRgbString();
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                  <InputNumber
                    value={this.value.right.width}
                    addonAfter="px"
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.right.width = value;
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                </Flex>
              </LabeledContainer>
              <LabeledContainer displayName="borderproperty-label-bottom">
                <Flex gap={2}>
                  <ColorPicker
                    showText
                    value={this.value.bottom.color}
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.bottom.color = value.toRgbString();
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                  <InputNumber
                    value={this.value.bottom.width}
                    addonAfter="px"
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.bottom.width = value;
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                </Flex>
              </LabeledContainer>
              <LabeledContainer displayName="borderproperty-label-left">
                <Flex gap={2}>
                  <ColorPicker
                    showText
                    value={this.value.left.color}
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.left.color = value.toRgbString();
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                  <InputNumber
                    value={this.value.left.width}
                    addonAfter="px"
                    onChange={(value) => {
                      const updated = produce(
                        this.value,
                        (draft: BorderPropertyValue) => {
                          draft.left.width = value;
                        },
                      );
                      updateConfig(this.widgetId, this.name, updated);
                    }}
                  />
                </Flex>
              </LabeledContainer>
            </>
          )}
        </ModalButton>
      </>
    );
  };

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame) {
      style.border = this.createRule(this.value.top);
    } else {
      style.borderTop = this.createRule(this.value.top);
      style.borderRight = this.createRule(this.value.right);
      style.borderLeft = this.createRule(this.value.left);
      style.borderBottom = this.createRule(this.value.bottom);
    }
    return style;
  }

  private createRule(border: Border) {
    return `${border.width}px ${border.type} ${border.color}`;
  }

  markup(updateConfig: Function): ReactNode {
    return this.comp(updateConfig);
  }
}
