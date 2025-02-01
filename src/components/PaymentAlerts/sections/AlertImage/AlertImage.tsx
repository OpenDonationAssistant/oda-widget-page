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
  const [className, setClassName] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // TODO: вынести в общий модуль fetch
  useEffect(() => {
    alertController.addAlertImageRenderer({
      setClassName: setClassName,
      setVideo: (video) => {
        if (!video) {
          setVideo((old) => null);
          return;
        }
        log.debug({ video: video }, "set video for alert");
        fetch(video, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        })
          .then((res) => res.blob())
          .then((blob) => URL.createObjectURL(blob))
          .then((url) => {
            setVideo((old) => url);
          });
      },
      setImage: (image) => {
        if (!image) {
          setImage((old) => null);
          return;
        }
        log.debug({ image: image }, "set image for alert");
        fetch(image, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        })
          .then((res) => res.blob())
          .then((blob) => URL.createObjectURL(blob))
          .then((url) => {
            setImage((old) => url);
          });
      },
      setStyle: setStyle,
    });
  }, [alertController]);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.addEventListener("ended", () => setVideo(null));
  }, [videoRef]);

  log.debug({ image: image, video: video }, "updated alert component");

  return (
    <>
      {video && (
        <video
          ref={videoRef}
          autoPlay={true}
          src={video}
          style={style}
          className={classes.alertimage}
        />
      )}
      {image && (
        <img
          src={image}
          style={style}
          className={`${classes.alertimage} ${className}`}
        />
      )}
      {!image && !video && (
        <div style={{ height: "40%", flex: "0 1 auto" }}></div>
      )}
    </>
  );
}
