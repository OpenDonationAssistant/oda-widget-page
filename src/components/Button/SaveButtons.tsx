import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { WidgetContext } from "../../types/Widget";
import { ModalStateContext } from "../Overlay/Overlay";
import { reaction } from "mobx";
import { log } from "../../logging";
import { Flex } from "antd";
import { useTranslation } from "react-i18next";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import classes from "./SaveButtons.module.css";

export const SaveButtons = observer(() => {
  const { t } = useTranslation();
  const widget = useContext(WidgetContext);
  const dialog = useContext(ModalStateContext);

  reaction(
    () => widget?.config.unsaved,
    () => {
      log.debug({ unsaved: widget?.config.unsaved }, "tracking unsaved");
    },
  );

  return (
    <Flex className="full-width" justify="flex-end" gap={9}>
      <SecondaryButton
        onClick={() => {
          widget?.reload();
          dialog.show = false;
        }}
      >
        {t("button-cancel")}
      </SecondaryButton>
      <PrimaryButton
        disabled={!widget?.config.unsaved}
        onClick={() => {
          widget?.save();
        }}
      >
        {t("button-save")}
      </PrimaryButton>
    </Flex>
  );
});

export interface Changeable {
  changed: boolean;
  save: () => void;
  reload: () => void;
}

export const SaveOrCancel = observer(
  ({
    changeable,
    saveLabel,
  }: {
    saveLabel?: string;
    changeable: { changed: boolean; save: () => void };
  }) => {
    const { t } = useTranslation();
    const parentModalState = useContext(ModalStateContext);

    return (
      <Flex
        align="center"
        justify="flex-end"
        gap={12}
        className={`${classes.buttons}`}
      >
        <SecondaryButton onClick={() => (parentModalState.show = false)}>
          {t("button-cancel")}
        </SecondaryButton>
        <PrimaryButton
          disabled={!changeable.changed}
          onClick={() => {
            changeable.save();
          }}
        >
          {saveLabel ?? t("button-save")}
        </PrimaryButton>
      </Flex>
    );
  },
);
