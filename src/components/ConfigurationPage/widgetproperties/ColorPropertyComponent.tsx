import { Button, ColorPicker, Flex, Segmented, Select, Switch } from "antd";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import {
  COLOR_STOP_UNIT,
  ColorPropertyValue,
  ColorStop,
  GRADIENT_TYPE,
} from "./ColorProperty";
import { produce } from "immer";
import { toJS } from "mobx";
import classes from "./ColorPropertyComponent.module.css";
import InputNumber from "../components/InputNumber";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";
import { NotBorderedIconButton } from "../../IconButton/IconButton";
import CloseIcon from "../../../icons/CloseIcon";

const ColorStopComponent = observer(
  ({
    property,
    index,
    onChange,
  }: {
    property: { value: ColorPropertyValue };
    index: number;
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    const color = property.value.colors[index];

    return (
      <div className={`${classes.colorstopcontainer}`}>
        {color.stop && (
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
              onChange && onChange(updated);
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
                  onChange && onChange(updated);
                }}
              />
            }
          />
        )}
      </div>
    );
  },
);

const AddColorToGradient = observer(
  ({
    property,
    onChange,
  }: {
    property: { value: ColorPropertyValue };
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    return (
      <Button
        className={`${classes.addbutton}`}
        onClick={() => {
          const updated = produce(
            toJS(property.value),
            (draft: ColorPropertyValue) => {
              draft.colors.push({ color: "#FFFFFF" });
            },
          );
          property.value = updated;
          onChange && onChange(updated);
        }}
      >
        <Flex>
          <span className={`material-symbols-sharp`}>add</span>Добавить цвет
        </Flex>
      </Button>
    );
  },
);

const GradientSettings = observer(
  ({
    property,
    onChange,
  }: {
    property: { value: ColorPropertyValue };
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    return (
      <>
        <SmallLabeledContainer displayName="Тип градиента">
          <Segmented
            className="full-width"
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
          <Segmented
            className="full-width"
            value={property.value.repeating ? 1 : 0}
            options={[
              {
                value: 0,
                label: "Обычный",
              },
              {
                value: 1,
                label: "Повторяющийся",
              },
            ]}
            onChange={(value) => {
              const updated = produce(
                toJS(property.value),
                (draft: ColorPropertyValue) => {
                  draft.repeating = value === 1;
                },
              );
              property.value = updated;
              {
                onChange && onChange(updated);
              }
            }}
          />
        </SmallLabeledContainer>
        {property.value.gradientType === GRADIENT_TYPE.LINEAR && (
          <SmallLabeledContainer displayName="Наклон">
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
                onChange && onChange(updated);
              }}
            />
          </SmallLabeledContainer>
        )}
      </>
    );
  },
);

const GradientColors = observer(
  ({
    property,
    onChange,
  }: {
    property: { value: ColorPropertyValue };
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    return (
      <Flex vertical={true} className="full-width" gap={10}>
        <GradientSettings property={property} />
        <div className={`${classes.colorlabel}`}>Цвета</div>
        {property.value.colors.map((color: ColorStop, index: number) => (
          <Flex vertical gap={9}>
            <SmallLabeledContainer key={index} displayName="">
              <Flex className={`${classes.gradientcolor}`} gap={9}>
                <ColorPicker
                  className={`${classes.color}`}
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
                <Flex
                  gap={5}
                  align="center"
                  className={`${classes.colorstopcontainer}`}
                  justify="flex-end"
                >
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
                  <span className={classes.colorStopLabel}>
                    С точкой остановки
                  </span>
                </Flex>
                <NotBorderedIconButton
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
                  <CloseIcon color="#FF8888" />
                </NotBorderedIconButton>
              </Flex>
            </SmallLabeledContainer>
            {color.stop && (
              <SmallLabeledContainer
                displayName={`Точка остановки цвета #${index + 1}`}
              >
                <ColorStopComponent property={property} index={index} />
              </SmallLabeledContainer>
            )}
          </Flex>
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
    property: { value: ColorPropertyValue; displayName: string };
    onChange?: (value: ColorPropertyValue) => void;
  }) => {
    return (
      <Flex gap={10} vertical={true} className="full-width">
        <LabeledContainer displayName={property.displayName}>
          <Segmented
            block
            className="full-width"
            options={[
              {
                value: 2,
                label: "Однотонный",
              },
              {
                value: 3,
                label: "Градиент",
              },
            ]}
            value={property.value.gradient ? 3 : 2}
            onChange={(value) => {
              const updated = produce(
                toJS(property.value),
                (draft: ColorPropertyValue) => {
                  draft.gradient = value === 3;
                },
              );
              property.value = updated;
              {
                onChange && onChange(updated);
              }
            }}
          />
        </LabeledContainer>
        {!property.value.gradient && (
          <ColorPicker
            className={`${classes.colorpicker}`}
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
              onChange && onChange(updated);
            }}
          />
        )}
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
