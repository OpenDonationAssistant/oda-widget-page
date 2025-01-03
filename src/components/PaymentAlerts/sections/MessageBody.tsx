import React, { useEffect, useState } from "react";
import { AlertController } from "../../../logic/alert/AlertController";
import classes from "./MessageBody.module.css";
import Typed from "typed.js";

export default function MessageBody({
  alertController,
}: {
  alertController: AlertController;
}) {
  const [message, setMessage] = useState<string>("");
  const [messageStyle, setMessageStyle] = useState<any>({});
  const [className, setClassName] = useState<string>("");
  const el = React.useRef(null);

  useEffect(() => {
    alertController.addMessageRenderer({
      setMessage: setMessage,
      setClassName: setClassName,
      setStyle: setMessageStyle,
    });
  }, [alertController]);

  // useEffect(() => {
  //   const typed = new Typed(el.current, {
  //     strings: [message],
  //     typeSpeed: 120,
  //   });
  //
  //   return () => {
  //     typed.destroy();
  //   };
  // }, [message]);

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
