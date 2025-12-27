import { observer } from "mobx-react-lite";
import { Element, ElementContainer, ElementData } from "../Element";
import { MarqueeElementSettings } from "./MarqueeElement";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Flex, Segmented } from "antd";
import { useContext } from "react";
import { AdvancedSettingsStoreContext } from "../../../stores/AdvancedSettingsStore";
import { ElementList } from "../ContainerElement/ContainerElementSettingsComponent";
import {
  LightLabeledSwitchComponent,
} from "../../LabeledSwitch/LabeledSwitchComponent";
import InputNumber from "../../ConfigurationPage/components/InputNumber";

export const MarqueeElementSettingsComponent = observer(
  ({
    data,
    nested,
    container,
  }: {
    data: ElementData<MarqueeElementSettings>;
    nested: Element<any>[];
    container: ElementContainer;
  }) => {
    return (
      <Flex vertical gap={18}>
        <ElementList
          elementId={data.id}
          nested={nested}
          container={container}
        />
        <LabeledContainer displayName="Скорость">
          <InputNumber
            value={data.settings.speed}
            onChange={(value) => {
              data.settings.speed = Number(value);
            }}
          />
        </LabeledContainer>
        <LabeledContainer displayName="Направление скролла">
          <Segmented
            value={data.settings.direction}
            className="full-width"
            options={[
              {
                value: "down",
                label: "Вниз",
              },
              {
                value: "left",
                label: "Налево",
              },
              {
                value: "right",
                label: "Направо",
              },
              {
                value: "up",
                label: "Вверх",
              },
            ]}
            onChange={(value) => {
              data.settings.direction = value as
                | "down"
                | "left"
                | "right"
                | "up";
            }}
          />
        </LabeledContainer>
        <LightLabeledSwitchComponent
          label="Заполнить полоску дубликатами"
          value={data.settings.autofill}
          onChange={(value) => {
            data.settings.autofill = value;
          }}
        />
      </Flex>
    );
  },
);
