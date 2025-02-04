import axios from "axios";
import { log } from "./logging";

async function loadSession() {
  const accessToken = localStorage.getItem("access-token");
  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
  const sessionInfo = await axios
    .get(`${process.env.REACT_APP_RECIPIENT_API_ENDPOINT}/session`)
    .then((json) => {
      return json.data;
    });
  return sessionInfo;
}

async function exchangeOtp(otp: string): Promise<string>{
  const response = await axios.post(
    `${process.env.REACT_APP_AUTH_API_ENDPOINT}/otp/exchange`,
    {
      otp: otp,
    },
  );
  return response.data.refreshToken;
}

// TODO: get access-token without redirecting to login page
// TODO: get recipient id lazily
export default async function auth() {
  let sessionInfo = await loadSession();
  if (window.location.href.endsWith("login")) {
  } else {
    if (!sessionInfo.logged || !localStorage.getItem("access-token")) {
      let refreshToken = new URLSearchParams(window.location.search).get(
        "refresh-token",
      );
      const otp = new URLSearchParams(window.location.search).get(
        "otp",
      );
      if (!refreshToken && otp){
        refreshToken = await exchangeOtp(otp);
      }
      const page = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      log.debug(`return to login page before page: ${page}`);
      if (refreshToken) {
        window.location.replace(
          `/login?refresh-token=${refreshToken}&page=${page}`,
        );
      } else {
        window.location.replace(`/login?page=${page}`);
      }
    }
  }

  let recipientId = "unknown";
  if (sessionInfo.logged) {
    log.debug(`sessionInfo: ${JSON.stringify(sessionInfo)}`);
    recipientId = sessionInfo.id;
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("access-token")}`;
  }

  return recipientId;
}
