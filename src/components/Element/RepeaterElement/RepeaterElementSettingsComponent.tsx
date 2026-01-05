import { observer } from "mobx-react-lite";
import { Element, ElementContainer, ElementData } from "../Element";
import { useContext } from "react";
import { AdvancedSettingsStoreContext } from "../../../stores/AdvancedSettingsStore";
import { RepeaterElementSettings } from "./RepeaterElement";
import { ElementList } from "../ContainerElement/ContainerElementSettingsComponent";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { Flex, Select } from "antd";
import { VariableStoreContext } from "../../../stores/VariableStore";
import { VariableScope } from "../../ConfigurationPage/widgetsettings/VariableScope";
import { log } from "../../../logging";

export const RepeaterElementSettingsComponent = observer(
  ({
    data,
    nested,
    container,
  }: {
    data: ElementData<RepeaterElementSettings>;
    nested: Element<any>[];
    container: ElementContainer;
  }) => {
    const advanced = useContext(AdvancedSettingsStoreContext).enabled;
    const variables = useContext(VariableStoreContext);

    if (!advanced) {
      return <></>;
    }

    const flatten =
      variables.templating.variables.find(
        (variable) => variable.name === data.settings.target,
      )?.nested ?? [];
    log.debug({ variables: variables.templating.variables, flaten: flatten });
    flatten.forEach((variable) => {
      variables.addVariableDescription(variable);
    });

    return (
      <Flex gap={6} vertical>
        <ElementList
          elementId={data.id}
          nested={nested}
          container={container}
        />
        <LabeledContainer displayName="Повторять для элементов из списка">
          <Select
            className="full-width"
            value={data.settings.target}
            options={variables.templating.variables
              .filter((variable) => variable.type === "matrix")
              .map((variable) => {
                return {
                  value: variable.name,
                  label: variable.name,
                };
              })}
            onChange={(value) => {
              data.settings.target = value;
            }}
          />
        </LabeledContainer>
      </Flex>
    );
  },
);
