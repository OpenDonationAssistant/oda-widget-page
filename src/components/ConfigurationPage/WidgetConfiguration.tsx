import { useContext, useEffect, useState } from "react";

import "./css/Widget.css";
import "./css/WidgetList.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";

import { socket } from "../../socket";
import { Flex, Modal as AntModal, notification } from "antd";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Trans, useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import classes from "./WidgetConfiguration.module.css";
import { observer } from "mobx-react-lite";
import { Widget } from "../../types/Widget";
import { reaction } from "mobx";
import WidgetUrlModal from "./WidgetUrlModal";
import { SelectedIndexContext } from "../../stores/SelectedIndexStore";
import { WidgetStoreContext } from "../../stores/WidgetStore";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Subtitle,
  Title,
  Warning,
} from "../Overlay/Overlay";
import CloseIcon from "../../icons/CloseIcon";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../IconButton/IconButton";
import SubActionButton from "../SubActionButton/SubActionButton";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import LinkIcon from "../../icons/LinkIcon";
import HelpIcon from "../../icons/HelpIcon";
import CopyIcon from "../../icons/CopyIcon";

interface WidgetConfigurationProps {
  widget: Widget;
}

export const SaveButtons = observer(({ widget }: { widget: Widget }) => {
  const { t } = useTranslation();

  return (
    <>
      {widget.config.unsaved && (
        <>
          <button
            className="oda-btn-default widget-button-accept"
            onClick={() => {
              widget.save().then(() => {
                socket.publish({
                  destination: "/topic/commands",
                  body: JSON.stringify({
                    id: widget.id,
                    command: "reload",
                  }),
                });
              });
            }}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">save</span>
              <div className="blinker">{t("button-save")}</div>
            </Flex>
          </button>
          <button
            className="oda-btn-default widget-button-decline"
            onClick={() => {
              widget.reload();
            }}
          >
            <Flex justify="center" align="center" gap={3}>
              <span className="material-symbols-sharp">cancel</span>
              <div className="blinker">{t("button-cancel")}</div>
            </Flex>
          </button>
        </>
      )}
    </>
  );
});

export const HelpButton = observer(({ widget }: { widget: Widget }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleModal = () => {
    setShowModal((old) => !old);
  };

  return (
    <>
      <AntModal
        className={`${classes.helpmodal}`}
        title="Help"
        open={showModal}
        onCancel={toggleModal}
        onClose={toggleModal}
        onOk={toggleModal}
      >
        {widget.config.help()}
      </AntModal>
      <BorderedIconButton onClick={toggleModal}>
        <HelpIcon />
      </BorderedIconButton>
    </>
  );
});

const NameComponent = observer(({ widget }: { widget: Widget }) => {
  const parentModalState = useContext(ModalStateContext);
  const [modalState] = useState<ModalState>(
    new ModalState(parentModalState.level),
  );
  const [showUrlModal, setShowUrlModal] = useState<boolean>(false);

  return (
    <ModalStateContext.Provider value={modalState}>
      <div
        className="widget-header-toogler"
        onClick={() => {
          modalState.show = true;
        }}
      >
        <img className="widget-icon" src={`/icons/${widget.type}.png`} />
        <div className="widget-title">{widget.name}</div>
      </div>
      <Overlay>
        <Panel>
          <Title>
            <Flex justify="space-between" style={{ marginTop: "3px" }}>
              <div className={`${classes.settingstitle}`}>{widget.name}</div>
              <Flex gap={9} align="bottom">
                <Flex>{widget.subactions}</Flex>
                <WidgetUrlModal
                  open={showUrlModal}
                  type={widget.type}
                  id={widget.id}
                  onClose={() => setShowUrlModal(false)}
                />
                <BorderedIconButton onClick={() => setShowUrlModal(true)}>
                  <LinkIcon />
                </BorderedIconButton>
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
                <NotBorderedIconButton
                  onClick={() => {
                    modalState.show = false;
                  }}
                >
                  <CloseIcon color="var(--oda-color-1000)" />
                </NotBorderedIconButton>
              </Flex>
            </Flex>
          </Title>
          <Subtitle className={`${classes.settingssubtitle}`}>
            Настройки виджета
          </Subtitle>
          {widget.config.hasDemo() && (
            <Flex justify="space-around" className={`${classes.preview}`}>
              <ResizableBox
                height={250}
                className={`${classes.resizable}`}
                axis="both"
                minConstraints={[650, 100]}
              >
                <div style={{ maxWidth: "100%" }}>{widget.config.demo()}</div>
              </ResizableBox>
            </Flex>
          )}
          <Comp widget={widget} />
        </Panel>
      </Overlay>
    </ModalStateContext.Provider>
  );
});

const Comp = observer(({ widget }: { widget: Widget }) => (
  <> {widget.config.markup()} </>
));

export const WidgetConfiguration = observer(
  ({ widget }: WidgetConfigurationProps) => {
    const store = useContext(WidgetStoreContext);
    const selection = useContext(SelectedIndexContext);
    const { conf } = useLoaderData() as WidgetData;
    const { t } = useTranslation();
    const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
    const [api, context] = notification.useNotification();
    const parentModalState = useContext(ModalStateContext);
    const [deleteDialogState, setDeleteDialogState] = useState<ModalState>(
      new ModalState(parentModalState.level),
    );

    useEffect(() => {
      reaction(
        () => widget.config.unsaved,
        (unsaved) => {
          if (unsaved) {
            api.warning({
              key: widget.id,
              message: <Trans i18nKey="unsaved-notification-title" />,
              description: (
                <Flex vertical gap={15} className="full-width">
                  <div>
                    <Trans i18nKey="unsaved-notification-description" />
                    <span className={`${classes.widgetname}`}>
                      {widget.name}
                    </span>
                  </div>
                  <Flex>
                    <SaveButtons widget={widget} />
                  </Flex>
                </Flex>
              ),
              placement: "bottomRight",
              duration: 0,
            });
          } else {
            api.destroy();
          }
        },
      );
    }, [widget]);

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
        <div
          className={`widget ${selection.id === widget.id ? "extended" : "collapsed"}`}
        >
          {context}
          <div className="widget-header">
            <ModalStateContext.Provider value={deleteDialogState}>
              <Overlay>
                <Warning action={() => widget.delete()}>
                  Вы действительно хотите удалить виджет?
                </Warning>
              </Overlay>
            </ModalStateContext.Provider>
            <NameComponent widget={widget} />
            <Flex gap={9}>
              <div>{widget.subactions}</div>
              <WidgetUrlModal
                open={showUrlModal}
                type={widget.type}
                id={widget.id}
                onClose={() => setShowUrlModal(false)}
              />
              <BorderedIconButton onClick={() => setShowUrlModal(true)}>
                <LinkIcon />
              </BorderedIconButton>
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
              <BorderedIconButton
                onClick={() => (deleteDialogState.show = true)}
              >
                <CloseIcon color="#FF8888" />
              </BorderedIconButton>
            </Flex>
          </div>
        </div>
      </WidgetSettingsContext.Provider>
    );
  },
);
