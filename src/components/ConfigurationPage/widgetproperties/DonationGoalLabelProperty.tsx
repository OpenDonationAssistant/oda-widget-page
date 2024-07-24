import { ReactNode, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Flex, Select } from "antd";
import ModalButton from "../../ModalButton/ModalButton";

const DonationGoalPropertyComponent = ({
  displayName,
  value,
  onChange,
}: {
  displayName: string;
  value: string;
  onChange: (value: string) => {};
}) => {
  const [template, setTemplate] = useState<string | null>(
    "<collected> / <required> <currency>",
  );
  return (
    <ModalButton
      label={displayName}
      buttonLabel="button-settings"
      modalTitle={displayName}
    >
      <Flex justify="space-between">
        <span>Готовый шаблон:</span>
        <Select
          value={template}
          style={{ minWidth: "400px" }}
          onChange={(selected) => {
            setTemplate(selected);
            if (selected !== null) {
              onChange(selected);
            }
          }}
          options={[
            {
              value: "<required> <currency>",
              label: "требуемая сумма",
            },
            {
              value: "<collected> <currency>",
              label: "собранная сумма",
            },
            {
              value: "<proportion>%",
              label: "собранная сумма в процентах",
            },
            {
              value: "<collected> / <required> <currency>",
              label: "собранная сумма/требуемая сумма",
            },
            {
              value: null,
              label: "custom",
            },
          ]}
        />
      </Flex>
      <div className="textarea-container">
        <textarea
          className="widget-settings-value"
          value={value}
          onChange={(e) => {
            setTemplate(null);
            onChange(e.target.value);
          }}
        />
      </div>
    </ModalButton>
  );
};

export class DonationGoalLabelProperty extends DefaultWidgetProperty {
  constructor(widgetId: string, value?: string) {
    super(
      widgetId,
      "labelTemplate",
      "predefined",
      value ?? "<collected> / <required> <currency>",
      "widget-donationgoal-label-template",
      "progressbar",
    );
  }

  copy() {
    return new DonationGoalLabelProperty(this.widgetId, this.value);
  }

  // todo локализовать
  markup(updateConfig: Function): ReactNode {
    return (
      <DonationGoalPropertyComponent
        displayName={this.displayName}
        value={this.value}
        onChange={(text) => updateConfig(this.widgetId, this.name, text)}
      />
    );
  }
}
