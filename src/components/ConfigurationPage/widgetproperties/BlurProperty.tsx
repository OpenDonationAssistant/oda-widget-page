import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import InputNumber from "../components/InputNumber";
import { produce } from "immer";
import { toJS } from "mobx";
import { Flex, Switch } from "antd";

interface BlurPropertyValue {
  enabled: boolean;
  blur: number;
}

export class BlurProperty extends DefaultWidgetProperty<BlurPropertyValue> {
  constructor(params: {
    name: string;
    value?: BlurPropertyValue;
    displayName?: string;
    help?: string;
  }) {
    super({
      name: params.name,
      value: params.value ?? {
        enabled: false,
        blur: 0,
      },
      displayName: params.displayName ?? "blur",
      help: params.help,
    });
  }

  public calcCss(): CSSProperties {
    if (this.value.enabled) {
      return { filter: `blur(${this.value.blur}px)` };
    }
    return { filter: "none" };
  }

  BlurPropertyComponent = observer(() => {
    return (
      <LabeledContainer help={this.help} displayName={this.displayName}>
        <Flex justify="flex-start" align="center" gap={50}>
          <Flex align="center" justify="center" gap={5}>
            <Switch
              value={this.value.enabled}
              onChange={(value) =>
                (this.value = produce(toJS(this.value), (draft) => {
                  draft.enabled = value;
                }))
              }
            />
            <span>{this.value.enabled ? "Enabled" : "Disabled"}</span>
          </Flex>
          <InputNumber
            value={this.value.blur}
            addon="px"
            onChange={(value) =>
              (this.value = produce(toJS(this.value), (draft) => {
                draft.blur = value;
              }))
            }
          />
        </Flex>
      </LabeledContainer>
    );
  });

  copy() {
    return new BlurProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      displayName: this.displayName,
      help: this.help,
    });
  }

  markup(): ReactNode {
    return <this.BlurPropertyComponent />;
  }
}
