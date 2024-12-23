import {
  Button,
  Col,
  ColorPicker,
  Flex,
  Row,
  Segmented,
  Select,
  Switch,
} from "antd";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import {
  COLOR_STOP_UNIT,
  ColorProperty,
  ColorPropertyValue,
  ColorStop,
  GRADIENT_TYPE,
} from "./ColorProperty";
import { produce } from "immer";
import { toJS } from "mobx";
import classes from "./ColorPropertyComponent.module.css";
import InputNumber from "../components/InputNumber";

const ColorStopComponent = observer(
  ({
    property,
    index,
    onChange,
  }: {
    property: ColorProperty;
    index: number;
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    const color = property.value.colors[index];

    return (
      <>
        {color.stop && (
          <Col span={7} offset={1}>
            <InputNumber
              value={color.stop.value}
              onChange={(value) => {
                if (value === undefined || value === null) return;
                const updated = produce(
                  toJS(property.value),
                  (draft: ColorPropertyValue) => {
                    const stop = draft.colors[index].stop;
                    if (stop) {
                      stop.value = value;
                    }
                  },
                );
                property.value = updated;
                {
                  onChange && onChange(updated);
                }
              }}
              addon={
                <Select
                  value={color.stop.unit}
                  className={`${classes.selectarrow}`}
                  options={[
                    {
                      value: COLOR_STOP_UNIT.PIXEL,
                      label: "px",
                    },
                    {
                      value: COLOR_STOP_UNIT.PERCENT,
                      label: "%",
                    },
                  ]}
                  onChange={(value) => {
                    const updated = produce(
                      toJS(property.value),
                      (draft: ColorPropertyValue) => {
                        const stop = draft.colors[index].stop;
                        if (stop) {
                          stop.unit = value;
                        }
                      },
                    );
                    property.value = updated;
                    {
                      onChange && onChange(updated);
                    }
                  }}
                />
              }
            />
          </Col>
        )}
      </>
    );
  },
);

const AddColorToGradient = observer(
  ({
    property,
    onChange,
  }: {
    property: ColorProperty;
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    return (
      <Flex justify="space-around" align="center">
        <Button
          className="oda-btn-default"
          onClick={() => {
            const updated = produce(
              toJS(property.value),
              (draft: ColorPropertyValue) => {
                draft.colors.push({ color: "#FFFFFF" });
              },
            );
            property.value = updated;
            {
              onChange && onChange(updated);
            }
          }}
        >
          <Flex>
            <span className={`material-symbols-sharp`}>add</span>Добавить цвет
          </Flex>
        </Button>
      </Flex>
    );
  },
);

const GradientSettings = observer(
  ({
    property,
    onChange,
  }: {
    property: ColorProperty;
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    return (
      <>
        <Row align={"middle"}>
          <Col span={22} offset={2}>
            <Flex align="center" justify="flex-start" gap={20}>
              <Flex align="center" gap={5}>
                <span>Градиент:</span>
                <Segmented
                  value={property.value.gradientType}
                  options={[
                    {
                      value: GRADIENT_TYPE.LINEAR,
                      label: "Линейный",
                    },
                    {
                      value: GRADIENT_TYPE.RADIAL,
                      label: "Круговой",
                    },
                    {
                      value: GRADIENT_TYPE.CONIC,
                      label: "Конический",
                    },
                  ]}
                  onChange={(value) => {
                    const updated = produce(
                      toJS(property.value),
                      (draft: ColorPropertyValue) => {
                        draft.gradientType = value;
                      },
                    );
                    property.value = updated;
                    {
                      onChange && onChange(updated);
                    }
                  }}
                />
              </Flex>
              {property.value.gradientType === GRADIENT_TYPE.LINEAR && (
                <Flex align="center" gap={5}>
                  <span>Наклон:</span>
                  <InputNumber
                    value={property.value.angle}
                    addon="deg"
                    onChange={(value) => {
                      if (value === null || value === undefined) {
                        return;
                      }
                      const updated = produce(
                        toJS(property.value),
                        (draft: ColorPropertyValue) => {
                          draft.angle = value;
                        },
                      );
                      property.value = updated;
                      {
                        onChange && onChange(updated);
                      }
                    }}
                  />
                </Flex>
              )}
            </Flex>
          </Col>
        </Row>
        <Row align={"middle"}>
          <Col span={22} offset={2}>
            <Flex align="center" gap={5}>
              <span>Повторять?</span>
              <Switch
                value={property.value.repeating}
                onChange={(value) => {
                  const updated = produce(
                    toJS(property.value),
                    (draft: ColorPropertyValue) => {
                      draft.repeating = value;
                    },
                  );
                  property.value = updated;
                  {
                    onChange && onChange(updated);
                  }
                }}
              />
            </Flex>
          </Col>
        </Row>
      </>
    );
  },
);

// TODO: localize
const GradientColors = observer(
  ({
    property,
    onChange,
  }: {
    property: ColorProperty;
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    return (
      <Flex vertical={true} className="full-width" gap={10}>
        <GradientSettings property={property} />
        {property.value.colors.map((color: ColorStop, index: number) => (
          <Row align="middle" className="full-width">
            <Col span={1} offset={2}>
              #{index + 1}
            </Col>
            <Col span={4} offset={1}>
              <ColorPicker
                key={index}
                showText
                value={color.color}
                onChange={(value) => {
                  const updated = produce(
                    toJS(property.value),
                    (draft: ColorPropertyValue) => {
                      draft.colors[index].color = value.toRgbString();
                    },
                  );
                  property.value = updated;
                  {
                    onChange && onChange(updated);
                  }
                }}
              />
            </Col>
            <Col span={3} offset={2}>
              <Flex gap={5} align="center">
                <Switch
                  value={color.stop !== undefined}
                  onChange={(value) => {
                    const updated = produce(
                      toJS(property.value),
                      (draft: ColorPropertyValue) => {
                        if (value) {
                          draft.colors[index].stop = {
                            value: 0,
                            unit: COLOR_STOP_UNIT.PIXEL,
                          };
                        } else {
                          draft.colors[index].stop = undefined;
                        }
                      },
                    );
                    property.value = updated;
                    {
                      onChange && onChange(updated);
                    }
                  }}
                />
                <span className={classes.colorStopLabel}>Color Stop</span>
              </Flex>
            </Col>
            <ColorStopComponent property={property} index={index} />
            {!color.stop && <Col span={8} />}
            <Col span={1} offset={1}>
              <span
                className={`material-symbols-sharp ${classes.deleteButton}`}
                onClick={() => {
                  const updated = produce(
                    toJS(property.value),
                    (draft: ColorPropertyValue) => {
                      draft.colors.splice(index, 1);
                    },
                  );
                  property.value = updated;
                  {
                    onChange && onChange(updated);
                  }
                }}
              >
                delete
              </span>
            </Col>
          </Row>
        ))}
      </Flex>
    );
  },
);

export const ColorPropertyComponent = observer(
  ({
    property,
    onChange,
  }: {
    property: ColorProperty;
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    return (
      <Flex gap={10} vertical={true}>
        <LabeledContainer displayName={property.displayName}>
          <Row align="middle" className="full-width">
            {!property.value.gradient && (
              <Col span={8} offset={4}>
                <ColorPicker
                  value={property.value.colors[0].color}
                  showText
                  onChange={(value) => {
                    const updated = produce(
                      toJS(property.value),
                      (draft: ColorPropertyValue) => {
                        draft.colors[0].color = value.toRgbString();
                      },
                    );
                    property.value = updated;
                    {
                      onChange && onChange(updated);
                    }
                  }}
                />
              </Col>
            )}
            <Col span={10} offset={property.value.gradient ? 12 : 0}>
              <Flex className="full-width" justify="center" gap={5}>
                <Switch
                  value={property.value.gradient}
                  onChange={(value) => {
                    const updated = produce(
                      toJS(property.value),
                      (draft: ColorPropertyValue) => {
                        draft.gradient = value;
                      },
                    );
                    property.value = updated;
                    {
                      onChange && onChange(updated);
                    }
                  }}
                />
                <span>Градиент</span>
              </Flex>
            </Col>
          </Row>
        </LabeledContainer>
        {property.value.gradient && (
          <>
            <GradientColors onChange={onChange} property={property} />
            <AddColorToGradient onChange={onChange} property={property} />
          </>
        )}
      </Flex>
    );
  },
);
