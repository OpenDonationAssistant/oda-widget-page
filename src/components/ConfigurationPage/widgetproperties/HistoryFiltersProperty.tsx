import { ReactNode } from "react";
import { Flex, Segmented, Select } from "antd";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { LabeledSwitchComponent } from "../../LabeledSwitch/LabeledSwitchComponent";
import {
  defaultHistoryFilters,
  HISTORY_FILTER_GROUPS,
  HISTORY_FILTER_DEFINITIONS,
  HISTORY_PERIOD_OPTIONS,
  HISTORY_PERIOD_UNIT_OPTIONS,
  HistoryCustomPeriod,
  HistoryFilterFlag,
  HistoryFilters,
  HistoryPeriod,
  HistoryPeriodUnit,
} from "../../../stores/history";
import { DefaultWidgetProperty } from "./WidgetProperty";
import InputNumber from "../components/InputNumber";

const HistoryFiltersPropertyComponent = observer(
  ({ property }: { property: HistoryFiltersProperty }) => {
    const filters = property.value;
    const customPeriod = filters.customPeriod ?? {
      amount: 1,
      unit: "day" as HistoryPeriodUnit,
    };

    const updateFlag = (key: HistoryFilterFlag, value: boolean) => {
      property.value = { ...filters, [key]: value } as HistoryFilters;
    };

    const updateCustomPeriod = (update: Partial<HistoryCustomPeriod>) => {
      property.value = {
        ...filters,
        customPeriod: { ...customPeriod, ...update },
      } as HistoryFilters;
    };

    return (
      <Flex vertical gap={18}>
        <LabeledContainer displayName="Период">
          <Flex vertical gap={8} style={{ width: "100%" }}>
            <Segmented
              block
              className="full-width"
              value={filters.period}
              options={HISTORY_PERIOD_OPTIONS}
              onChange={(value) => {
                property.value = {
                  ...filters,
                  period: value as HistoryPeriod,
                } as HistoryFilters;
              }}
            />
            {filters.period === "custom" && (
              <Flex gap={8} align="center">
                <InputNumber
                  min={1}
                  precision={0}
                  value={customPeriod.amount}
                  onChange={(value) =>
                    updateCustomPeriod({ amount: value ?? 1 })
                  }
                />
                <Select
                  style={{ width: "160px" }}
                  value={customPeriod.unit}
                  options={HISTORY_PERIOD_UNIT_OPTIONS}
                  onChange={(value) =>
                    updateCustomPeriod({
                      unit: value as HistoryPeriodUnit,
                    })
                  }
                />
              </Flex>
            )}
          </Flex>
        </LabeledContainer>
        {HISTORY_FILTER_GROUPS.map((group) => {
          const definitions = HISTORY_FILTER_DEFINITIONS.filter(
            (definition) => definition.group === group.key,
          );
          if (definitions.length === 0) {
            return null;
          }
          return (
            <LabeledContainer key={group.key} displayName={group.title}>
              <Flex vertical gap={4} className="full-width">
                {definitions.map((definition) => (
                  <LabeledSwitchComponent
                    key={definition.key}
                    label={definition.label}
                    value={filters[definition.key]}
                    onChange={(value) => updateFlag(definition.key, value)}
                  />
                ))}
              </Flex>
            </LabeledContainer>
          );
        })}
      </Flex>
    );
  },
);

export class HistoryFiltersProperty extends DefaultWidgetProperty<HistoryFilters> {
  constructor(params?: {
    name?: string;
    displayName?: string;
    value?: Partial<HistoryFilters>;
  }) {
    super({
      name: params?.name ?? "historyFilters",
      displayName: params?.displayName ?? "События для отображения",
      value: { ...defaultHistoryFilters(), ...params?.value },
    });
  }

  public copy(): HistoryFiltersProperty {
    return new HistoryFiltersProperty({
      name: this.name,
      displayName: this.displayName,
      value: toJS(this.value),
    });
  }

  markup(): ReactNode {
    return <HistoryFiltersPropertyComponent property={this} />;
  }
}
