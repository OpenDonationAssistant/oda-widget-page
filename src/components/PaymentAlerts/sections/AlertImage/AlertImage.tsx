import React, { useEffect, useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement|null>(null);

  useEffect(() => {
    alertController.addAlertImageRenderer({
      setVideo: setVideo,
      setImage: setImage,
      setStyle: setStyle,
    });
  }, [alertController]);

  useEffect(() => {
    if (!videoRef.current){
      return;
    }
    videoRef.current.addEventListener("ended", () => setVideo(null));
  },[videoRef]);

  log.debug({image: image, video: video}, "updated alert component");

  return (
    <>
      {video && (
        <video ref={videoRef} autoPlay={true} src={video} style={style} className={classes.alertimage} />
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
