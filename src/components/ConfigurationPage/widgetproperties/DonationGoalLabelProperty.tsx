import { ReactNode, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import TextPropertyModal from "./TextPropertyModal";
import { Flex, Select } from "antd";
import { Trans } from "react-i18next";

const DonationGoalPropertyComponent = ({
  displayName,
  value,
  onChange,
}: {
  displayName: string;
  value: string;
  onChange: Function;
}) => {
  const [template, setTemplate] = useState<string | null>(
    "<collected> / <required> <currency>",
  );
  return (
    <div className="widget-settings-item">
      <label className="widget-settings-name">
        <Trans i18nKey={displayName} />
      </label>
      <TextPropertyModal title={displayName}>
        <Flex justify="space-between">
          <span>Готовый шаблон:</span>
          <Select
            value={template}
            style={{minWidth: "400px"}}
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
      </TextPropertyModal>
    </div>
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
      "header",
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
