import React from "react";
import { Tokens, tokenRequest } from "../Login/Login";
import { useRequest } from "ahooks";
import { Button, Flex, Input, Modal, QRCode, Spin } from "antd";
import classes from "./WidgetUrlModal.module.css";
import { DefaultApiFactory as WidgetService } from "@opendonationassistant/oda-widget-service-client";

async function createOtp(id: string) {
  const token = (await getToken()).refreshToken;
  const response = await WidgetService(
    undefined,
    process.env.REACT_APP_WIDGET_API_ENDPOINT,
  ).createOtp({
    widgetId: id,
    refreshToken: token,
  });
  return response.data.otp;
}

async function getToken(): Promise<Tokens> {
  return await tokenRequest({
    refreshToken: localStorage.getItem("refresh-token") ?? "",
  });
}

async function copyUrl(type: string, id: string) {
  const tokens = await tokenRequest({
    refreshToken: localStorage.getItem("refresh-token") ?? "",
  });
  navigator.clipboard.writeText(
    `${process.env.REACT_APP_ENDPOINT}/${type}/${id}?refresh-token=${tokens.refreshToken}`,
  );
}

function url(type: string, id: string, otp: string): string {
  return `${process.env.REACT_APP_ENDPOINT}/${type}/${id}?refresh-token=${otp}`;
}

export default function WidgetUrlModal({
  open,
  type,
  id,
}: {
  open: boolean;
  type: string;
  id: string;
}) {
  const { data, loading } = useRequest(
    () => {
      if (open) {
        return createOtp(id).then((data) => url(type, id, data));
      }
      return Promise.reject();
    },
    {
      refreshDeps: [open],
    },
  );
  return (
    <>
      <Modal open={open} title="URL виджета">
        {loading && <Spin />}
        <Flex vertical gap={10} className={`${classes.modal}`}>
          <Flex gap={5}>
            <Input value={data} />
            <Button
              className="oda-btn-default"
              onClick={() => copyUrl(type, id)}
            >
              <span className="material-symbols-sharp">content_copy</span>
            </Button>
          </Flex>
          {data && (
            <Flex justify="center">
              <QRCode
                size={320}
                value="https://widgets.oda.digital/once/stcarolas/9fa40c33-b25e-42d4-a889-d52a97429d9b/c6edd857-01e8-4e56-bb20-c5968b52024c"
              />
            </Flex>
          )}
        </Flex>
      </Modal>
    </>
  );
}
