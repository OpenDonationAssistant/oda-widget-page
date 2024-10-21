import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Col, Flex, InputNumber, Row, Segmented } from "antd";
import { produce } from "immer";
import { Trans } from "react-i18next";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

export interface PaddingPropertyValue {
  isSame: boolean | null;
  bottom: number;
  top: number;
  left: number;
  right: number;
}

export const DEFAULT_PADDING_PROPERTY_VALUE = {
  isSame: true,
  bottom: 5,
  top: 5,
  left: 5,
  right: 5,
};

const PaddingPropertyComponent = observer(
  ({ property }: { property: PaddingProperty }) => {
    return (
      <Flex vertical={true} gap={10}>
        <LabeledContainer displayName={property.name}>
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
                label: "Стороны",
              },
            ]}
            value={property.value.isSame}
            onChange={(checked) => {
              const updated = produce(
                toJS(property.value),
                (draft: PaddingPropertyValue) => {
                  draft.isSame = checked;
                },
              );
              property.value = updated;
            }}
          />
        </LabeledContainer>
        {property.value.isSame === true && (
          <Row align="middle">
            <Col span={2} offset={8}>
              Отступ:
            </Col>
            <Col span={3}>
              <InputNumber
                value={property.value.top}
                addonAfter="px"
                onChange={(value) => {
                  if (!value) {
                    return;
                  }
                  const updated = produce(
                    property.value,
                    (draft: PaddingPropertyValue) => {
                      draft.top = value;
                      draft.right = value;
                      draft.left = value;
                      draft.bottom = value;
                    },
                  );
                  property.value = updated;
                }}
              />
            </Col>
          </Row>
        )}
        {property.value.isSame === false && (
          <Row align="middle">
            <Col span={2} offset={1}>
              <Trans i18nKey="paddingproperty-label-top" />
            </Col>
            <Col span={3}>
              <InputNumber
                value={property.value.top}
                addonAfter="px"
                onChange={(value) => {
                  if (!value) {
                    return;
                  }
                  const updated = produce(
                    toJS(property.value),
                    (draft: PaddingPropertyValue) => {
                      draft.top = value;
                    },
                  );
                  property.value = updated;
                }}
              />
            </Col>
            <Col span={2} offset={1}>
              <Trans i18nKey="paddingproperty-label-right" />
            </Col>
            <Col span={3}>
              <InputNumber
                value={property.value.right}
                addonAfter="px"
                onChange={(value) => {
                  if (!value) {
                    return;
                  }
                  const updated = produce(
                    toJS(property.value),
                    (draft: PaddingPropertyValue) => {
                      draft.right = value;
                    },
                  );
                  property.value = updated;
                }}
              />
            </Col>
            <Col span={2} offset={1}>
              <Trans i18nKey="paddingproperty-label-bottom" />
            </Col>
            <Col span={3}>
              <InputNumber
                value={property.value.bottom}
                addonAfter="px"
                onChange={(value) => {
                  if (!value) {
                    return;
                  }
                  const updated = produce(
                    toJS(property.value),
                    (draft: PaddingPropertyValue) => {
                      draft.bottom = value;
                    },
                  );
                  property.value = updated;
                }}
              />
            </Col>
            <Col span={2} offset={1}>
              <Trans i18nKey="paddingproperty-label-left" />
            </Col>
            <Col span={3}>
              <InputNumber
                value={property.value.left}
                addonAfter="px"
                onChange={(value) => {
                  if (!value) {
                    return;
                  }
                  const updated = produce(
                    toJS(property.value),
                    (draft: PaddingPropertyValue) => {
                      draft.left = value;
                    },
                  );
                  property.value = updated;
                }}
              />
            </Col>
          </Row>
        )}
      </Flex>
    );
  },
);

export class PaddingProperty extends DefaultWidgetProperty<PaddingPropertyValue> {
  constructor({
    name,
    value,
    displayName,
  }: {
    name: string;
    value?: PaddingPropertyValue;
    displayName?: string;
  }) {
    super({
      name: name,
      value: value ?? DEFAULT_PADDING_PROPERTY_VALUE,
      displayName: displayName ?? "padding",
    });
  }

  calcCss(): CSSProperties {
    const style: CSSProperties = {};
    if (this.value.isSame === true) {
      style.padding = `${this.value.top}px`;
    }
    if (this.value.isSame === false) {
      style.paddingTop = `${this.value.top}px`;
      style.paddingRight = `${this.value.right}px`;
      style.paddingLeft = `${this.value.left}px`;
      style.paddingBottom = `${this.value.bottom}px`;
    }
    return style;
  }

  markup(): ReactNode {
    return <PaddingPropertyComponent property={this} />;
  }
}
