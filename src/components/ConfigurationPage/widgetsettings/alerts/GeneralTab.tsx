import { Alert } from "./Alerts";
import { observer } from "mobx-react-lite";
import { Flex, Select } from "antd";
import CollapseLikeButton from "../../../Button/CollapseLikeButton";
import classes from "./GeneralTab.module.css";
import { NotBorderedIconButton } from "../../../IconButton/IconButton";
import CloseIcon from "../../../../icons/CloseIcon";
import { Trigger } from "./triggers/AlertTriggerInterface";
import { UnknownTrigger } from "./triggers/UnknownTrigger";
import { useContext } from "react";
import { TriggersStoreContext } from "./triggers/TriggersStore";
import { FixedDonationAmountTrigger } from "./triggers/FixedDonationAmountTrigger";
import { RangeDonationAmountTrigger } from "./triggers/RangeDonationAmountTrigger";
import { SystemTrigger } from "./triggers/SystemTrigger";
import { LessThanDonationAmountTrigger } from "./triggers/LessThanDonationAmountTrigger";
import { log } from "../../../../logging";

const TriggerComponent = observer(
  ({
    trigger,
    onChange,
  }: {
    trigger:
      | LessThanDonationAmountTrigger
      | FixedDonationAmountTrigger
      | RangeDonationAmountTrigger
      | SystemTrigger
      | UnknownTrigger;
    onChange: (trigger: Trigger) => void;
  }) => {
    const triggersStore = useContext(TriggersStoreContext);

    const options = [
      ...triggersStore.available,
      ...[triggersStore.getType(trigger.type)],
    ].map((t) => {
      return {
        value: t?.type,
        label: t?.description,
      };
    });

    log.info({ options: options, value: trigger.type }, "loaded options");

    return (
      <Flex gap={6} justify="space-around" className="full-width">
        <Flex className={`${classes.triggersection}`}>
          <Select
            className="full-width"
            onChange={(e) => {
              onChange(triggersStore.createTrigger(e));
            }}
            options={options}
            value={trigger.type}
          />
        </Flex>
        {trigger.markup()}
      </Flex>
    );
  },
);

const AlertPropertyComponent = ({
  alert,
  property,
}: {
  alert: Alert;
  property: string;
}) => {
  return <div className="settings-item">{alert.get(property)?.markup()}</div>;
};

const GeneralTab = observer(({ alert }: { alert: Alert }) => {
  return (
    <>
      <div className="settings-item">
        <div style={{ fontSize: "21px" }}>Срабатывает когда</div>
        <Flex vertical gap={6}>
          {alert.triggers.map((trigger, index) => (
            <Flex
              gap={6}
              className="full-width"
              align="center"
              justify="center"
            >
              <TriggerComponent
                key={index}
                trigger={trigger}
                onChange={(newTrigger) => {
                  alert.triggers[index] = newTrigger;
                }}
              />
              <NotBorderedIconButton
                onClick={() => alert.triggers.splice(index, 1)}
                className={`${classes.deletetriggerbutton}`}
              >
                <CloseIcon color="#FF8888" />
              </NotBorderedIconButton>
            </Flex>
          ))}
        </Flex>
        <Flex className={`${classes.addtriggerbuttoncontainer}`}>
          {alert.triggers.filter((trigger) => trigger.type.type === "never")
            .length === 0 && (
            <CollapseLikeButton
              onClick={() => {
                alert.triggers.push(new UnknownTrigger());
              }}
            >
              Добавить условие
            </CollapseLikeButton>
          )}
        </Flex>
      </div>
      <AlertPropertyComponent alert={alert} property="duration" />
      <AlertPropertyComponent alert={alert} property="totalAppearance" />
      <AlertPropertyComponent alert={alert} property="totalAnimation" />
      <AlertPropertyComponent alert={alert} property="totalDisappearance" />
      <AlertPropertyComponent alert={alert} property="totalWidth" />
      <AlertPropertyComponent alert={alert} property="totalHeight" />
      <AlertPropertyComponent alert={alert} property="totalBackgroundColor" />
      <AlertPropertyComponent alert={alert} property="totalBackgroundImage" />
      <AlertPropertyComponent alert={alert} property="totalBorder" />
      <AlertPropertyComponent alert={alert} property="totalRounding" />
      <AlertPropertyComponent alert={alert} property="totalPadding" />
      <AlertPropertyComponent alert={alert} property="totalShadow" />
    </>
  );
});

export default GeneralTab;
