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
        setImages((oldImages) => {
          return Array.from(new Set(oldImages).add(image));
        });
      },
    });
  }, [imageProvider]);

  return (
    <>
      {images.map((image) => (
        <img
          key={image}
          style={{ display: "none" }}
          src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${image}`}
        />
      ))}
    </>
  );
}
