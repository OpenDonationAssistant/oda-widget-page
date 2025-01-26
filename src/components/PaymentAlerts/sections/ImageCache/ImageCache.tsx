import { useContext } from "react";
import { AlertStateContext } from "../../AlertState";
import { observer } from "mobx-react-lite";
import { log } from "../../../../logging";

export const ImageCache = observer(({}) => {
  const state = useContext(AlertStateContext);

  log.debug({ images: state.images }, "preloading images");

  return (
    <>
      {state.images
        .filter((image) => image)
        .map((image) => (
          <img
            key={image}
            style={{ display: "none" }}
            src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${image}`}
          />
        ))}
    </>
  );
});
