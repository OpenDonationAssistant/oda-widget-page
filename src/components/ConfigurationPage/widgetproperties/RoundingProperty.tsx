import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Col, Flex, Row, Segmented } from "antd";
import { produce } from "immer";
import classes from "./RoundingProperty.module.css";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import InputNumber from "../components/InputNumber";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";

export interface RoundingValue {
  isSame: boolean | null;
  bottomLeft: number;
  bottomRight: number;
  topLeft: number;
  topRight: number;
}

export const DEFAULT_ROUNDING_PROPERTY_VALUE: RoundingValue = {
  isSame: null,
  bottomLeft: 0,
  bottomRight: 0,
  topLeft: 0,
  topRight: 0,
};

const Comp = observer(({ property }: { property: RoundingProperty }) => {
  const { t } = useTranslation();
  return (
    <Flex vertical={true} gap={10}>
      <LabeledContainer displayName={property.displayName} help={property.help}>
        <Segmented
          block
          className="full-width"
          value={property.value.isSame}
          options={[
            { label: t("label-rounding-absent"), value: null },
            { label: t("label-rounding-same"), value: true },
            { label: t("label-rounding-different"), value: false },
          ]}
          onChange={(selected) => {
            const updated = produce(
              toJS(property.value),
              (draft: RoundingValue) => {
                draft.isSame = selected;
                if (draft.isSame) {
                  draft.topRight = draft.topLeft;
                  draft.bottomRight = draft.topLeft;
                  draft.bottomLeft = draft.topLeft;
                }
                if (draft.isSame === null) {
                  draft.topLeft = 0;
                  draft.topRight = 0;
                  draft.bottomRight = 0;
                  draft.bottomLeft = 0;
                }
              },
            );
            property.value = updated;
          }}
        />
      </LabeledContainer>
      {property.value.isSame === true && (
        <InputNumber
          value={property.value.topLeft}
          addon="px"
          onChange={(newValue) => {
            if (newValue === undefined || newValue === null) {
              return;
            }
            const updated = produce(
              toJS(property.value),
              (draft: RoundingValue) => {
                draft.topLeft = newValue;
                draft.topRight = newValue;
                draft.bottomLeft = newValue;
                draft.bottomRight = newValue;
              },
            );
            property.value = updated;
          }}
        />
      )}
      {property.value.isSame === false && (
        <Flex gap={10} vertical={true} className={`${classes.roundingvalues}`}>
          <Flex className="full-width" gap={9}>
            <SmallLabeledContainer displayName={"TopLeft"}>
              <InputNumber
                addon="px"
                value={property.value.topLeft}
                onChange={(newValue) => {
                  if (newValue === undefined || newValue === null) {
                    return;
                  }
                  const updated = produce(
                    toJS(property.value),
                    (draft: RoundingValue) => {
                      draft.topLeft = newValue;
                    },
                  );
                  property.value = updated;
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName={"TopRight"}>
              <InputNumber
                addon="px"
                value={property.value.topRight}
                onChange={(newValue) => {
                  if (newValue === undefined || newValue === null) {
                    return;
                  }
                  const updated = produce(
                    toJS(property.value),
                    (draft: RoundingValue) => {
                      draft.topRight = newValue;
                    },
                  );
                  property.value = updated;
                }}
              />
            </SmallLabeledContainer>
          </Flex>
          <Flex className="full-width" gap={9}>
            <SmallLabeledContainer displayName={"BottomLeft"}>
              <InputNumber
                addon="px"
                value={property.value.bottomLeft}
                onChange={(newValue) => {
                  if (newValue === undefined || newValue === null) {
                    return;
                  }
                  const updated = produce(
                    toJS(property.value),
                    (draft: RoundingValue) => {
                      draft.bottomLeft = newValue;
                    },
                  );
                  property.value = updated;
                }}
              />
            </SmallLabeledContainer>
            <SmallLabeledContainer displayName={"BottomRight"}>
              <InputNumber
                addon="px"
                value={property.value.bottomRight}
                onChange={(newValue) => {
                  if (newValue === undefined || newValue === null) {
                    return;
                  }
                  const updated = produce(
                    property.value,
                    (draft: RoundingValue) => {
                      draft.bottomRight = newValue;
                    },
                  );
                  property.value = updated;
                }}
              />
            </SmallLabeledContainer>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
});

export class RoundingProperty extends DefaultWidgetProperty<RoundingValue> {
  constructor({
    name,
    displayName,
    value,
    help,
  }: {
    name: string;
    displayName?: string;
    value?: RoundingValue;
    help?: string;
  }) {
    super({
      name: name,
      value: value ?? DEFAULT_ROUNDING_PROPERTY_VALUE,
      displayName: displayName ?? "rounding",
      help: help,
    });
  }

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame) {
      style.borderTopRightRadius = this.value.topLeft + "px";
      style.borderBottomRightRadius = this.value.topLeft + "px";
      style.borderBottomLeftRadius = this.value.topLeft + "px";
      style.borderTopLeftRadius = this.value.topLeft + "px";
    } else {
      style.borderTopRightRadius = this.value.topRight + "px";
      style.borderBottomRightRadius = this.value.bottomRight + "px";
      style.borderBottomLeftRadius = this.value.bottomLeft + "px";
      style.borderTopLeftRadius = this.value.topLeft + "px";
    }
    return style;
  }

  markup(): ReactNode {
    return <Comp property={this} />;
  }

  public copy() {
    return new RoundingProperty({
      name: this.name,
      displayName: this.displayName,
      value: produce(toJS(this.value), (draft) => draft),
      help: this.help,
    });
  }
}
