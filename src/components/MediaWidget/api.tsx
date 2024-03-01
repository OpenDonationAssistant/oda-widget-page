import axios from "axios";

export function markListened(id: string) {
  try {
    axios
      .patch(
        `${process.env.REACT_APP_MEDIA_API_ENDPOINT}/media/video/${id}`,
        {},
      )
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}
