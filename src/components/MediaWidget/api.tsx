import axios from "axios";
import { log } from "../../logging";

export function markListened(id: string) {
  try {
    log.debug(`marking ${id} as listened`);
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
