import axios from "axios";
import { log } from "./logging";
import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";

interface LogLevel {
  name: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE" | "DISABLED";
}

interface Session {
  logged: boolean;
  id?: string;
  features: {
    name: string;
    state: "ENABLED" | "DISABLED";
  }[];
  logLevels: LogLevel[];
}

async function loadSession(): Promise<Session> {
  const accessToken = localStorage.getItem("access-token");
  if (!accessToken) {
    return Promise.resolve({ logged: false, features: [], logLevels: [] });
  }
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return RecipientService(
    undefined,
    process.env.REACT_APP_RECIPIENT_API_ENDPOINT,
  )
    .getSettings()
    .then((response) => ({
      logged: true,
      id: response.data.recipientId,
      features: response.data.features?.map(
        (feature) =>
          ({
            name: feature.name,
            state: feature.status,
          }) ?? [],
      ),
      logLevels: response.data.logLevels,
    }))
    .catch((error) => {
      log.debug({ error: error }, `error: ${JSON.stringify(error)}`);
      return Promise.resolve({ logged: false, features: [], logLevels: [] });
    });
}

async function exchangeOtp(otp: string): Promise<string> {
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
export default async function auth(): Promise<Session> {
  let sessionInfo = await loadSession();
  if (window.location.href.endsWith("login")) {
  } else {
    if (!sessionInfo.logged || !localStorage.getItem("access-token")) {
      let refreshToken = new URLSearchParams(window.location.search).get(
        "refresh-token",
      );
      const otp = new URLSearchParams(window.location.search).get("otp");
      if (!refreshToken && otp) {
        refreshToken = await exchangeOtp(otp);
      }
      const page = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      log.debug(
        { session: sessionInfo, page: page },
        `return to login page before page`,
      );
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
  if (sessionInfo.logged && sessionInfo.id) {
    log.debug(`sessionInfo: ${JSON.stringify(sessionInfo)}`);
    recipientId = sessionInfo.id;
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${localStorage.getItem("access-token")}`;
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "USER_AUTHORIZED",
        recipientId: recipientId,
        features: sessionInfo.features,
      });
    } else if (navigator.serviceWorker) {
      // ensure active SW and then notify
      navigator.serviceWorker.ready.then((reg) => {
        reg.active &&
          reg.active.postMessage({
            type: "USER_AUTHORIZED",
            payload: {
              recipientId: recipientId,
              features: sessionInfo.features,
            },
          });
      });
    }
  }

  return sessionInfo;
}
