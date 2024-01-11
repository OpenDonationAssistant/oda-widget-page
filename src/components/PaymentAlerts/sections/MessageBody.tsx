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

  useEffect(() => {
    alertController.addMessageRenderer({
      setMessage: setMessage,
      setStyle: setMessageStyle,
    });
  }, [alertController]);

  return (
    <>
      <div style={messageStyle} className={classes.messagebody}>
        {message != undefined && message != null ? message : null}
      </div>
    </>
  );
}
