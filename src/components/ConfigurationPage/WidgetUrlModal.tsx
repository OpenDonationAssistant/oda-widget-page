import { useRequest } from "ahooks";
import { Flex, Input, QRCode, Spin } from "antd";
import classes from "./WidgetUrlModal.module.css";
import axios from "axios";
import { Tokens, tokenRequest } from "../../pages/Login/Login";
import { useContext, useState } from "react";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../Overlay/Overlay";
import { BorderedIconButton } from "../IconButton/IconButton";
import LinkIcon from "../../icons/LinkIcon";
import CopyIcon from "../../icons/CopyIcon";
import SubActionButton from "../Button/SubActionButton";
import { log } from "../../logging";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

async function createOtp(id: string) {
  log.debug("creating otp");
  const token = (await getToken()).refreshToken;
  const response = await axios.post(
    `${process.env.REACT_APP_AUTH_API_ENDPOINT}/otp/create`,
    {
      widgetId: id,
      refreshToken: token,
    },
  );
  return response.data.otp;
}

async function getToken(): Promise<Tokens> {
  return await tokenRequest({
    refreshToken: localStorage.getItem("refresh-token") ?? "",
  });
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(url);
}

function openUrl(url: string) {
  window.open(url);
}

function url(type: string, id: string, otp: string): string {
  return `${process.env.REACT_APP_ENDPOINT}/${type}/${id}?otp=${otp}`;
}

export const WidgetUrlModal = observer(
  ({ type, id }: { type: string; id: string }) => {
    const { t } = useTranslation();
    const parentModalState = useContext(ModalStateContext);
    const [dialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const { data, loading } = useRequest(
      async () => {
        if (dialogState.show) {
          const data = await createOtp(id);
          return url(type, id, data);
        }
        return Promise.reject();
      },
      {
        refreshDeps: [dialogState.show],
      },
    );

    return (
      <>
        <ModalStateContext.Provider value={dialogState}>
          <Overlay>
            <Panel>
              <Title>{t("widget-url-title")}</Title>
              {loading && (
                <Flex
                  className={`${classes.spin} full-width`}
                  justify="center"
                  align="center"
                >
                  <Spin size="large" />
                </Flex>
              )}
              {data && (
                <Flex vertical gap={20} className={`${classes.modal}`}>
                  <div>
                    {t("widget-url-description")}
                  </div>
                  <Flex vertical gap={3}>
                    <Input className={`${classes.url}`} value={data} />
                    <Flex gap={3} justify="flex-end" className="full-width">
                      <SubActionButton
                        onClick={() => copyUrl(data)}
                        icon={<CopyIcon />}
                      >
                        <span>{t("widget-url-copy")}</span>
                      </SubActionButton>
                      <SubActionButton
                        onClick={() => openUrl(data)}
                        icon={
                          <span
                            className="material-symbols-sharp"
                            style={{ color: "var(--oda-color-950)" }}
                          >
                            open_in_new
                          </span>
                        }
                      >
                        <span>{t("common-open")}</span>
                      </SubActionButton>
                    </Flex>
                  </Flex>
                  <div className={`${classes.qrcodedescription}`}>
                    {t("widget-url-qr-description")}
                  </div>
                  <Flex justify="center">
                    <QRCode size={320} value={data} />
                  </Flex>
                </Flex>
              )}
            </Panel>
          </Overlay>
          <BorderedIconButton onClick={() => (dialogState.show = true)}>
            <LinkIcon />
          </BorderedIconButton>
        </ModalStateContext.Provider>
      </>
    );
  },
);
