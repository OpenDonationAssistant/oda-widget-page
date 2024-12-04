import { CSSProperties, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Col, Flex, Row, Segmented } from "antd";
import { produce } from "immer";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import InputNumber from "../components/InputNumber";

export interface PaddingPropertyValue {
  isSame: boolean | null;
  bottom: number;
  top: number;
  left: number;
  right: number;
}

export const DEFAULT_PADDING_PROPERTY_VALUE: PaddingPropertyValue = {
  isSame: true,
  bottom: 0,
  top: 0,
  left: 0,
  right: 0,
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
            <Col span={6}>
              <InputNumber
                value={property.value.top}
                addon="px"
                onChange={(value) => {
                  if (value === null || value === undefined) {
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
          <div style={{ paddingLeft: "40px", paddingRight: "40px" }}>
            <LabeledContainer displayName="paddingproperty-label-top">
              <InputNumber
                value={property.value.top}
                addon="px"
                onChange={(value) => {
                  if (value === null || value === undefined) {
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
            </LabeledContainer>
            <LabeledContainer displayName="paddingproperty-label-right">
              <InputNumber
                value={property.value.right}
                addon="px"
                onChange={(value) => {
                  if (value === null || value === undefined) {
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
            </LabeledContainer>
            <LabeledContainer displayName="paddingproperty-label-bottom">
              <InputNumber
                value={property.value.bottom}
                addon="px"
                onChange={(value) => {
                  if (value === null || value === undefined) {
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
            </LabeledContainer>
            <LabeledContainer displayName="paddingproperty-label-left">
              <InputNumber
                value={property.value.left}
                addon="px"
                onChange={(value) => {
                  if (value === null || value === undefined) {
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
            </LabeledContainer>
          </div>
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
      style.paddingTop = `${this.value.top}px`;
      style.paddingRight = `${this.value.top}px`;
      style.paddingLeft = `${this.value.top}px`;
      style.paddingBottom = `${this.value.top}px`;
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
