import React, { useEffect, useState } from "react";
import classes from "./AlertImage.module.css";
import { AlertController } from "../../../../logic/alert/AlertController";
import { log } from "../../../../logging";

export default function AlertImage({
  alertController,
}: {
  alertController: AlertController;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [style, setStyle] = useState<any>({});

  useEffect(() => {
    alertController.addAlertImageRenderer({
      setVideo: setVideo,
      setImage: setImage,
      setStyle: setStyle,
    });
  }, [alertController]);

  log.debug({image: image, video: video}, "updated alert component");

  return (
    <>
      {video && (
        <video src={video} style={style} className={classes.alertimage} />
      )}
      {image && (
        <img src={image} style={style} className={classes.alertimage} />
      )}
      {!image && !video && (
        <div style={{ height: "40%", flex: "0 1 auto"}}></div>
      )}
    </>
  );
}
