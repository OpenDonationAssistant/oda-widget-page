import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { log } from "../../logging";
import { useSearchParams } from "react-router-dom";
import { Button } from "antd";

export interface Tokens {
  idToken: string;
  refreshToken: string;
}

async function tokenApiCall(credentials: any) {
  return axios.post(
    `${process.env.REACT_APP_AUTH_API_ENDPOINT}/realms/ODA/protocol/openid-connect/token`,
    {
      ...credentials,
      ...{
        client_id: "oda-console",
        client_secret: "TYaqCopUUsx2Jmakif55qBquZSUXOGhL",
        scope: "offline_access openid audience profile",
      },
    },
    { headers: { "content-type": "application/x-www-form-urlencoded" } },
  );
}

function parseTokens(response: any): Tokens {
  const idToken = response.data.id_token;
  const refreshToken = response.data.refresh_token;
  log.debug({ idToken: idToken, refreshToken: refreshToken });
  document.cookie = `JWT=${idToken}`;
  localStorage.setItem("access-token", idToken.toString());
  localStorage.setItem("refresh-token", refreshToken.toString());
  axios.defaults.headers.common["Authorization"] =
    `Bearer ${idToken.toString()}`;
  return {
    idToken: idToken,
    refreshToken: refreshToken,
  };
}

export async function tokenRequest({
  login,
  password,
  refreshToken,
}: {
  login?: string;
  password?: string;
  refreshToken?: string;
}): Promise<Tokens> {
  if (refreshToken) {
    try {
      const credentials = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      };
      const response = await tokenApiCall(credentials);
      return parseTokens(response);
    } catch (error) {}
  }
  if (login && password) {
    try {
      const credentials = {
        grant_type: "password",
        username: login,
        password: password,
      };
      const response = await tokenApiCall(credentials);
      return parseTokens(response);
    } catch (error) {}
  }
  return Promise.reject();
}

async function getToken(page: string | null, login: string, password: string) {
  await tokenRequest({ login: login, password: password })
    .then(() => {
      window.location.replace(page ? page : "/");
    })
    .catch(() => {
      alert("Incorrect login/password");
    });
}

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const savedRefreshToken = localStorage.getItem("refresh-token");
  const savedLogin = localStorage.getItem("login");
  const savedPassword = localStorage.getItem("password");

  const [params] = useSearchParams();
  log.debug(`params: ${params}`);
  log.debug(`page: ${params.get("page")}`);

  tokenRequest({
    login: savedLogin ?? undefined,
    password: savedPassword ?? undefined,
    refreshToken: savedRefreshToken ?? undefined,
  })
    .then(() => {
      window.location.replace(params.get("page") ?? "/");
    })
    .catch(() => {
      localStorage.removeItem("login");
      localStorage.removeItem("password");
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      const refreshToken = params.get("refresh-token");
      if (refreshToken) {
        tokenRequest({ refreshToken: refreshToken }).then(() => {
          window.location.replace(params.get("page") ?? "/");
        });
      }
    });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%; padding: 0px!important;}`,
        }}
      />
      <div className="login-page">
        <div className="login-form">
          <div className="login-container">
            <span>Login</span>
            <input
              value={login}
              type="text"
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="password-container">
            <span>Password</span>
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            id="login"
            onClick={() => getToken(params.get("page"), login, password)}
          >
            Login
          </Button>
        </div>
      </div>
    </>
  );
}
