import axios from "axios";
import { log } from "./logging";

async function loadSession(){
  const sessionInfo = await axios
    .get(`${process.env.REACT_APP_RECIPIENT_API_ENDPOINT}/session`)
    .then((json) => {
			log.debug(`login info: ${JSON.stringify(json.data)}`)
      return json.data;
    });
  return sessionInfo;
}

export default async function auth() {
  let sessionInfo = await loadSession();

  if (window.location.href.endsWith("login")) {
  } else {
    if (!sessionInfo.logged || !localStorage.getItem('access-token')) {
      const refreshToken = new URLSearchParams(window.location.search).get("refresh-token");
      const page = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
			log.debug(`return to login page before page: ${page}`);
      if (refreshToken){
        window.location.replace(`/login?refresh-token=${refreshToken}&page=${page}`);
      } else {
        window.location.replace(`/login?page=${page}`);
      }
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
