import { ReactNode, useContext, useEffect, useRef, useState } from "react";

import "./css/Widget.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";
import { snapdom } from "@zumer/snapdom";

import { Flex, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import classes from "./WidgetConfiguration.module.css";
import { observer } from "mobx-react-lite";
import { Widget, WidgetContext } from "../../types/Widget";
import { WidgetUrlModal } from "./WidgetUrlModal";
import {
  CloseOverlayButton,
  Dialog,
  FullscreenPanel,
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../Overlay/Overlay";
import { BorderedIconButton } from "../IconButton/IconButton";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import HelpIcon from "../../icons/HelpIcon";
import CopyIcon from "../../icons/CopyIcon";
import { EditableString } from "../RenamableLabel/EditableString";
import { Card } from "../Cards/CardsComponent";
import SubActionButton from "../Button/SubActionButton";
import PrimaryButton from "../Button/PrimaryButton";
import SecondaryButton from "../Button/SecondaryButton";
import { Preset } from "../../types/Preset";
import { PresetStoreContext } from "../../stores/PresetStore";
import { uuidv7 } from "uuidv7";
import { uploadBlob } from "../../utils";
import { PresetsComponent } from "./PresetsComponent";
import DeleteWidgetModal from "./DeleteWidgetModal";
import { ListItem } from "../List/List";

const SaveButtons = observer(({ widget }: { widget: Widget }) => {
  const { t } = useTranslation();
  const dialogState = useContext(ModalStateContext);

  return (
    <Flex className={`${classes.previewbuttons}`} justify="flex-end" gap={12}>
      <SecondaryButton
        onClick={() => {
          dialogState.show = false;
          widget.reload();
        }}
      >
        {t("button-cancel")}
      </SecondaryButton>
      <PrimaryButton
        disabled={!widget.config.unsaved}
        onClick={() => widget.save()}
      >
        {t("button-save")}
      </PrimaryButton>
    </Flex>
  );
});

const HelpButton = observer(({ widget }: { widget: Widget }) => {
  const parentModalState = useContext(ModalStateContext);
  const [modalState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );

  return (
    <>
      <ModalStateContext.Provider value={modalState}>
        <Overlay>
          <Panel>{widget.config.help()}</Panel>
        </Overlay>
      </ModalStateContext.Provider>
      <BorderedIconButton onClick={() => (modalState.show = true)}>
        <HelpIcon />
      </BorderedIconButton>
    </>
  );
});

const WidgetSettingsWindow = observer(
  ({ children, widget }: { children: ReactNode; widget: Widget }) => {
    return widget.config.hasDemo() ? (
      <FullscreenPanel>{children}</FullscreenPanel>
    ) : (
      <Dialog>{children}</Dialog>
    );
  },
);

const WidgetSettings = observer(({ widget }: { widget: Widget }) => {
  const preview = useRef<HTMLElement | null>(null);
  const presetStore = useContext(PresetStoreContext);

  async function savePreset(): Promise<string | void> {
    if (!preview.current) {
      return Promise.resolve();
    }
    const name = uuidv7();
    const canvas = await snapdom(preview.current);
    const blob = await canvas.toBlob({ type: "webp" });
    const url = (await uploadBlob(blob, `${name}.webp`)).url;
    const preset = new Preset({
      name: name,
      owner: widget.ownerId,
      showcase: url ?? "",
      properties: widget.config.prepareConfig(),
    });
    return presetStore.save(preset, widget.type);
  }

  return (
    <Overlay>
      <WidgetSettingsWindow widget={widget}>
        <Title showClose={false}>
          <Flex className="full-width" justify="space-between" gap={51}>
            <Flex justify="flex-start" align="baseline" gap={18}>
              <EditableString
                label={widget.name}
                onChange={(value) => widget.rename(value)}
                className={`${classes.widgetname}`}
              />
              <Switch value={widget.enabled} onChange={() => widget.toggle()} />
            </Flex>
            <Flex gap={9} align="bottom">
              <Flex>{widget.subactions}</Flex>
              <WidgetUrlModal type={widget.type} id={widget.id} />
              <BorderedIconButton
                onClick={() => {
                  if (widget.type !== "payment-alerts") {
                    widget.copy();
                  }
                }}
              >
                <CopyIcon />
              </BorderedIconButton>
              <HelpButton widget={widget} />
              <CloseOverlayButton />
            </Flex>
          </Flex>
        </Title>
        <WidgetContext.Provider value={widget}>
          <div
            className={`${classes.configcontainer} ${widget.config.hasDemo() ? classes.bigcontainer : classes.smallcontainer}`}
          >
            {widget.config.markup()}
            {widget.config.hasDemo() && (
              <Flex vertical gap={9} className={`${classes.previewcontainer}`}>
                <Flex
                  justify="flex-start"
                  gap={9}
                  className={`${classes.templatebuttons}`}
                >
                  <SubActionButton onClick={() => savePreset()}>
                    Создать шаблон
                  </SubActionButton>
                  <PresetsComponent presetStore={presetStore} target={widget} />
                </Flex>
                <Flex
                  ref={preview}
                  justify="space-around"
                  className={`${classes.preview}`}
                >
                  <ResizableBox
                    height={-1}
                    width={-1}
                    className={`${classes.resizable}`}
                    axis="both"
                    minConstraints={[400, 100]}
                  >
                    {widget.config.demo()}
                  </ResizableBox>
                </Flex>
                <SaveButtons widget={widget} />
              </Flex>
            )}
            {!widget.config.hasDemo() && <SaveButtons widget={widget} />}
          </div>
        </WidgetContext.Provider>
      </WidgetSettingsWindow>
    </Overlay>
  );
});

const WidgetActions = observer(({ widget }: { widget: Widget }) => {
  return (
    <Flex gap={9}>
      <WidgetUrlModal type={widget.type} id={widget.id} />
      <BorderedIconButton
        onClick={() => {
          if (widget.type !== "payment-alerts") {
            widget.copy();
          }
        }}
      >
        <CopyIcon />
      </BorderedIconButton>
      <HelpButton widget={widget} />
      <DeleteWidgetModal widget={widget} />
    </Flex>
  );
});

const WidgetAsList = observer(({ widget }: { widget: Widget }) => {
  const modalState = useContext(ModalStateContext);
  return (
    <ListItem
      first={
        <Flex align="center" gap={12}>
          {widget.icon}
          <div className="widget-title">{widget.name}</div>
          <Switch value={widget.enabled} onChange={() => widget.toggle()} />
        </Flex>
      }
      second={<WidgetActions widget={widget} />}
      onClick={() => (modalState.show = true)}
    />
  );
});

const WidgetAsCard = observer(({ widget }: { widget: Widget }) => {
  const modalState = useContext(ModalStateContext);
  return (
    <Card onClick={() => (modalState.show = true)}>
      <Flex align="top" justify={"space-between"} gap={12}>
        <Flex align="top" gap={12}>
          {widget.icon}
          <div className={`${classes.widgettitle}`}>{widget.name}</div>
        </Flex>
        <Switch value={widget.enabled} onChange={() => widget.toggle()} />
      </Flex>
      <WidgetActions widget={widget} />
    </Card>
  );
});

export const WidgetConfiguration = observer(
  ({
    widget,
    asCards,
    open,
  }: {
    widget: Widget;
    asCards: boolean;
    open?: boolean;
  }) => {
    const parentModalState = useContext(ModalStateContext);
    const [modalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    useEffect(() => {
      modalState.show = open ?? false;
    }, [open]);

    return (
      <WidgetSettingsContext.Provider
        value={{
          widgetId: widget.id,
          settings: widget,
          subscribe: (
            topic: string,
            onMessage: (message: { ack: () => void; body: string }) => void,
          ) => {},
          unsubscribe: (topic: string) => {},
          publish: (topic: string, payload: any) => {},
        }}
      >
        <ModalStateContext.Provider value={modalState}>
          {asCards && <WidgetAsCard widget={widget} />}
          {!asCards && <WidgetAsList widget={widget} />}
          <WidgetSettings widget={widget} />
        </ModalStateContext.Provider>
      </WidgetSettingsContext.Provider>
    );
  },
);
