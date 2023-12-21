import axios from "axios";

export function markListened(id) {
  try {
    axios
      .patch(`${process.env.REACT_APP_API_ENDPOINT}/media/${id}`, {
        listened: true,
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}
