import { ReactNode, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Flex, Select } from "antd";
import ModalButton from "../../ModalButton/ModalButton";
import { toJS } from "mobx";
import classes from "./DonationGoalLabelProperty.module.css";
import { useTranslation } from "react-i18next";

const DonationGoalPropertyComponent = ({
  displayName,
  value,
  onChange,
}: {
  displayName: string;
  value: string;
  onChange: (value: string) => {};
}) => {
  const { t } = useTranslation();
  const [template, setTemplate] = useState<string | null>(
    "<collected> / <required> <currency>",
  );

  return (
    <ModalButton
      label={displayName}
      buttonLabel="button-edit"
      modalTitle={displayName}
      icon="edit"
    >
      <Flex
        justify="space-between"
        gap={10}
        align="center"
        className={`${classes.template}`}
      >
        <span>{t("label-template-ready")}</span>
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
              label: t("donationgoal-template-required"),
            },
            {
              value: "<collected> <currency>",
              label: t("widget-goal-accumulated-amount"),
            },
            {
              value: "<proportion>%",
              label: t("donationgoal-template-collected-percent"),
            },
            {
              value: "<collected> / <required> <currency>",
              label: t("donationgoal-template-collected-required"),
            },
            {
              value: null,
              label: t("label-template-custom"),
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

export class DonationGoalLabelProperty extends DefaultWidgetProperty<string> {
  constructor() {
    super({
      name: "labelTemplate",
      value: "<collected> / <required> <currency>",
      displayName: "widget-donationgoal-label-template",
    });
  }

  copy() {
    const newCopy = new DonationGoalLabelProperty();
    newCopy.value = this.value;
    return newCopy;
  }

  markup(): ReactNode {
    return (
      <DonationGoalPropertyComponent
        displayName={this.displayName}
        value={this.value}
        onChange={(text) => (this.value = toJS(text))}
      />
    );
  }
}
