import React, { useState } from "react";
import { Tokens, tokenRequest } from "../Login/Login";
import { useRequest } from "ahooks";
import { Button, Flex, Input, Modal, QRCode, Spin } from "antd";
import classes from "./WidgetUrlModal.module.css";
import axios from "axios";

async function createOtp(id: string) {
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

export default function WidgetUrlModal({
  open,
  type,
  id,
  onClose
}: {
  open: boolean;
  type: string;
  id: string;
  onClose: Function
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
      <Modal
        open={open}
        title="URL виджета"
        rootClassName={classes.window}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        onClose={() => onClose()}
        onCancel={() => onClose()}
        destroyOnClose={true}
      >
        {loading && <Spin />}
        {data && (
          <Flex vertical gap={20} className={`${classes.modal}`}>
            <Flex justify="center">
              <QRCode size={320} value={data} />
            </Flex>
            <Flex gap={5}>
              <Input value={data} />
              <Button className="oda-btn-default" onClick={() => copyUrl(data)}>
                <span className="material-symbols-sharp">content_copy</span>
              </Button>
              <Button
                className="oda-btn-default"
                onClick={() => openUrl(data)}
              >
                <span className="material-symbols-sharp">open_in_new</span>
              </Button>
            </Flex>
          </Flex>
        )}
      </Modal>
    </>
  );
}
