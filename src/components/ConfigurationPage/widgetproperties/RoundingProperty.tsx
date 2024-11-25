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
      <LabeledContainer displayName={property.displayName}>
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
              },
            );
            property.value = updated;
          }}
        />
      </LabeledContainer>
      {property.value.isSame === true && (
        <Row align="middle">
          <Col span={2} offset={12}>
            <span>Радиус:</span>
          </Col>
          <Col span={6}>
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
                  },
                );
                property.value = updated;
              }}
            />
          </Col>
        </Row>
      )}
      {property.value.isSame === false && (
        <Flex gap={10} vertical={true} className={`${classes.roundingvalues}`}>
          <Row>
            <Col span={3} offset={2}>
              <span>TopLeft</span>
            </Col>
            <Col span={5}>
              <InputNumber
                addon="px"
                value={property.value.topLeft}
                onChange={(newValue) => {
                  if (!newValue) {
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
            </Col>
            <Col span={3} offset={2}>
              <span>TopRight</span>
            </Col>
            <Col span={5}>
              <InputNumber
                addon="px"
                value={property.value.topRight}
                onChange={(newValue) => {
                  if (!newValue) {
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
            </Col>
          </Row>
          <Row>
            <Col span={3} offset={2}>
              <span>BottomLeft</span>
            </Col>
            <Col span={5}>
              <InputNumber
                addon="px"
                value={property.value.bottomLeft}
                onChange={(newValue) => {
                  if (!newValue) {
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
            </Col>
            <Col span={3} offset={2}>
              <span>BottomRight</span>
            </Col>
            <Col span={5}>
              <InputNumber
                addon="px"
                value={property.value.bottomRight}
                onChange={(newValue) => {
                  if (!newValue) {
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
            </Col>
          </Row>
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
  }: {
    name: string;
    displayName?: string;
    value?: RoundingValue;
  }) {
    super({
      name: name,
      value: value ?? DEFAULT_ROUNDING_PROPERTY_VALUE,
      displayName: displayName ?? "rounding",
    });
  }

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame) {
      style.borderRadius = this.value.topLeft;
    } else {
      style.borderTopRightRadius = this.value.topRight;
      style.borderBottomRightRadius = this.value.bottomRight;
      style.borderBottomLeftRadius = this.value.bottomLeft;
      style.borderTopLeftRadius = this.value.topLeft;
    }
    return style;
  }

  markup(): ReactNode {
    return <Comp property={this} />;
  }
}
