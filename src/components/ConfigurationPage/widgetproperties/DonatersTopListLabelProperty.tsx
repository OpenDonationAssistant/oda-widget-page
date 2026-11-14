import { ReactNode, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Flex, Select } from "antd";
import ModalButton from "../../ModalButton/ModalButton";
import { toJS } from "mobx";
import classes from "./DonatersTopListLabelProperty.module.css";
import { useTranslation } from "react-i18next";

const DonatersTopListLabelPropertyComponent = ({
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
    "<nickname> - <amount> <currency>",
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
              value: "<nickname> - <amount> <currency>",
              label: t("donaterslist-template-nickname-amount"),
            },
            {
              value: "<nickname> <amount> <currency>",
              label: t("donaterslist-template-nickname-amount-space"),
            },
            {
              value: "<amount> <currency> - <nickname>",
              label: t("donaterslist-template-amount-nickname"),
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

export class DonatersTopListLabelProperty extends DefaultWidgetProperty<string> {
  constructor() {
    super({
      name: "labelTemplate",
      value: "<nickname> - <amount> <currency>",
      displayName: "widget-donaterslist-label-template",
    });
  }

  copy() {
    const newCopy = new DonatersTopListLabelProperty();
    newCopy.value = this.value;
    return newCopy;
  }

  markup(): ReactNode {
    return (
      <DonatersTopListLabelPropertyComponent
        displayName={this.displayName}
        value={this.value}
        onChange={(text) => (this.value = toJS(text))}
      />
    );
  }
}
