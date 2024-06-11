import React, { useState } from "react";
import classes from "./PopupComponent.module.css";

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
        {buttonText}
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
