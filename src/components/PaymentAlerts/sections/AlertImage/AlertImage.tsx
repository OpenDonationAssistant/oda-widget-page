import React, { useEffect, useState } from "react";
import classes from "./AlertImage.module.css";
import { AlertController } from "../../../../logic/alert/AlertController";

export default function AlertImage({
  alertController,
}: {
  alertController: AlertController;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState<any>({});

  useEffect(() => {
    alertController.addAlertImageRenderer({
      setImage: setImage,
      setStyle: setStyle,
    });
  }, [alertController]);

  return (
    <>
      {image && (
        <img src={image} style={style} className={classes.alertimage} />
      )}
    </>
  );
}
