import axios from "axios";
import { log } from "./logging";

export default async function auth() {
  // const token = localStorage.getItem('access-token');
  // const headers = token ? { Authorization: `Bearer ${token}`} : {};
  const sessionInfo = await axios
    .get(`${process.env.REACT_APP_RECIPIENT_API_ENDPOINT}/session`)
    .then((json) => {
			log.debug(`login info: ${JSON.stringify(json.data)}`)
      return json.data;
    });

  if (window.location.href.endsWith("login")) {
  } else {
    if (!sessionInfo.logged || !localStorage.getItem('access-token')) {
			log.debug(`return to login page`)
      window.location.replace(`/login?page=${window.location.href}`);
    }
  }

  let recipientId = "unknown";
  if (sessionInfo.logged) {
    log.debug(`sessionInfo: ${JSON.stringify(sessionInfo)}`);
    recipientId = sessionInfo.id;
		axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access-token')}`;
  }

  return recipientId;
}
