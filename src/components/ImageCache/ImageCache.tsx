import React, { useEffect, useState } from "react";

export default function ImageCache({
  imageProvider,
}: {
  imageProvider: IImageProvider;
}) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    imageProvider.addImageLoader({
      addImage: (image) => {
        fetch(`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${image}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        })
          .then((res) => res.blob())
          .then((blob) => URL.createObjectURL(blob))
          .then((url) => {
            setImages((oldImages) => {
              return Array.from(new Set(oldImages).add(url));
            });
          });
      },
    });
  }, [imageProvider]);

  return (
    <>
      {images
        .filter((image) => image)
        .map((image) => (
          <img key={image} style={{ display: "none" }} src={image} />
        ))}
    </>
  );
}
