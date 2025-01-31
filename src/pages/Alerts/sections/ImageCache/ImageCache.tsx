import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { AlertStateContext } from "../../AlertState";

export const ImageCache = observer(({}) => {
  const state = useContext(AlertStateContext);

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
