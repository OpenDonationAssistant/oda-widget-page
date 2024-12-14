import React, { useState } from "react";
import classes from "./PopupComponent.module.css";
import { Flex } from "antd";

export default function PopupComponent({
  children,
  buttonText,
}: {
  children: React.ReactNode;
  buttonText: string;
}) {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  return (
    <>
      <button
        className={`oda-btn-default`}
        onClick={() => setShowPopup(!showPopup)}
      >
        <Flex justify="center" align="center" gap={3}>
          <span className="material-symbols-sharp">notifications_active</span>
          <div>{buttonText}</div>
        </Flex>
      </button>
      <div
        className={`${classes.popup} ${showPopup ? "" : "visually-hidden"}`}
        tabIndex={-1}
      >
        <button id="close-add-media-popup" onClick={() => setShowPopup(false)}>
          <span className="material-symbols-sharp">close</span>
        </button>
        {children}
      </div>
    </>
  );
}
