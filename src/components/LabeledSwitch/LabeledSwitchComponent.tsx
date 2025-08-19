import { Flex, Switch } from "antd";
import classes from "./LabeledSwitchComponent.module.css";
import { useTranslation } from "react-i18next";

function BaseLabeledSwitchComponent({
  label,
  value,
  onChange,
  containerClass,
}: {
  label: string;
  value: boolean;
  onChange: (update: boolean) => void;
  containerClass: string;
}) {
  const { t } = useTranslation();

  return (
    <Flex
      className={`${containerClass} ${value ? classes.selected : ""}`}
      justify="space-between"
      align="center"
    >
      <div>{t(label)}</div>
      <Switch value={value} onChange={onChange} />
    </Flex>
  );
}

export function LabeledSwitchComponent({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (update: boolean) => void;
}) {
  return (
    <BaseLabeledSwitchComponent
      value={value}
      label={label}
      onChange={onChange}
      containerClass={`${classes.container}`}
    />
  );
}

export function LightLabeledSwitchComponent({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (update: boolean) => void;
}) {
  return (
    <BaseLabeledSwitchComponent
      value={value}
      label={label}
      onChange={onChange}
      containerClass={`${classes.lightcontainer}`}
    />
  );
}
