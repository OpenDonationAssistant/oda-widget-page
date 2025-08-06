import { useContext, useEffect, useRef, useState } from "react";

import "./css/Widget.css";
import "./css/WidgetButton.css";
import "./css/WidgetSettings.css";
import html2canvas from "@html2canvas/html2canvas";

import { socket } from "../../socket";
import { Flex, Modal as AntModal, notification, Switch } from "antd";
import { Trans, useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import classes from "./WidgetConfiguration.module.css";
import { observer } from "mobx-react-lite";
import { Widget } from "../../types/Widget";
import { reaction } from "mobx";
import WidgetUrlModal from "./WidgetUrlModal";
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
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import LinkIcon from "../../icons/LinkIcon";
import HelpIcon from "../../icons/HelpIcon";
import CopyIcon from "../../icons/CopyIcon";
import { EditableString } from "../RenamableLabel/EditableString";
import { Card } from "../Cards/CardsComponent";
import axios from "axios";
import SubActionButton from "../SubActionButton/SubActionButton";

interface WidgetConfigurationProps {
  widget: Widget;
  asCards: boolean;
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

function uploadBlob(data: Blob, name: string) {
  return axios.put(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`,
    { file: data },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

const NameComponent = observer(
  ({ widget, asCards }: { widget: Widget; asCards: boolean }) => {
    const parentModalState = useContext(ModalStateContext);
    const [modalState] = useState<ModalState>(() => new ModalState(parentModalState));
    const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
    const preview = useRef<HTMLElement | null>(null);

    function convert(): Promise<string | void> {
      if (!preview.current) {
        return Promise.resolve();
      }
      return html2canvas(preview.current).then((canvas) =>
        canvas.toBlob((it) => {
          it && uploadBlob(it, "test.png");
        }),
      );
    }

    return (
      <ModalStateContext.Provider value={modalState}>
        <Flex
          align="baseline"
          className="widget-header-toogler"
          onClick={(e) => {
            console.log(e.target);
            if (
              e.target === e.currentTarget ||
              (e.target as Element).className === "widget-title" ||
              e.target instanceof SVGElement
            ) {
              modalState.show = true;
            }
          }}
          justify={asCards ? "space-between" : "flex-start"}
          gap={12}
        >
          <Flex align="center" gap={12}>
            {widget.icon}
            <div className="widget-title">{widget.name}</div>
          </Flex>
          <Switch value={widget.enabled} onChange={() => widget.toggle()} />
        </Flex>
        <Overlay>
          <Panel>
            <Title>
              <Flex justify="space-between" gap={51}>
                <Flex justify="flex-start" align="baseline" gap={18}>
                  <EditableString
                    label={widget.name}
                    onChange={(value) => widget.rename(value)}
                    className={`${classes.widgetname}`}
                  />
                  <Switch
                    value={widget.enabled}
                    onChange={() => widget.toggle()}
                  />
                </Flex>
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
              <Flex vertical gap={9}>
                {false && (
                  <Flex
                    justify="flex-start"
                    className={`${classes.previewcontainer}`}
                  >
                    <SubActionButton
                      onClick={() =>
                        convert().then((url) => widget.config.makePreset(url))
                      }
                    >
                      Создать шаблон
                    </SubActionButton>
                  </Flex>
                )}
                <Flex
                  ref={preview}
                  justify="space-around"
                  className={`${classes.preview}`}
                >
                  <ResizableBox
                    height={250}
                    className={`${classes.resizable}`}
                    axis="y"
                    minConstraints={[650, 100]}
                  >
                    <div style={{ maxWidth: "100%" }}>
                      {widget.config.demo()}
                    </div>
                  </ResizableBox>
                </Flex>
              </Flex>
            )}
            {widget.config.markup()}
          </Panel>
        </Overlay>
      </ModalStateContext.Provider>
    );
  },
);

export const WidgetConfiguration = observer(
  ({ widget, asCards }: WidgetConfigurationProps) => {
    const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
    const [api, context] = notification.useNotification();
    const parentModalState = useContext(ModalStateContext);
    const [deleteDialogState] = useState<ModalState>(
      new ModalState(parentModalState),
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
        {context}
        <ModalStateContext.Provider value={deleteDialogState}>
          <Overlay>
            <Warning action={() => widget.delete()}>
              Вы действительно хотите удалить виджет?
            </Warning>
          </Overlay>
        </ModalStateContext.Provider>
        {!asCards && (
          <div className={`widget collapsed`}>
            <div className="widget-header">
              <NameComponent asCards={asCards} widget={widget} />
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
        )}
        {asCards && (
          <Card onClick={() => {}}>
            <Flex vertical className="full-width" justify="space-between">
              <NameComponent asCards={asCards} widget={widget} />
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
            </Flex>
          </Card>
        )}
      </WidgetSettingsContext.Provider>
    );
  },
);
