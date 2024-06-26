import React, { useEffect, useState } from "react";
import { AlertController } from "../../../logic/alert/AlertController";
import classes from "./MessageBody.module.css";

export default function MessageBody({
  alertController,
}: {
  alertController: AlertController;
}) {
  const [message, setMessage] = useState<string>("");
  const [messageStyle, setMessageStyle] = useState<any>({});
  const [className, setClassName] = useState<string>("");

  useEffect(() => {
    alertController.addMessageRenderer({
      setMessage: setMessage,
      setClassName: setClassName,
      setStyle: setMessageStyle,
    });
  }, [alertController]);

  return (
    <>
      <div
        style={messageStyle}
        className={`${classes.messagebody} ${className}`}
      >
        {message != undefined && message != null ? message : null}
      </div>
    </>
  );
}
