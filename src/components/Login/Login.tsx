import React, { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import { log } from "../../logging";
import { useSearchParams } from "react-router-dom";

async function loader({ params }) {
  log.debug(`auth for page settings for ${params.page}`);
  const page = params.page;

  return { page };
}

function tokenRequest(login: string, password: string): Promise<String> {
  console.log(`loging with login: ${login}, password: ${password}`);
  return axios
    .post(
      "https://auth.oda.digital/realms/ODA/protocol/openid-connect/token",
      {
        client_id: "oda-console",
        client_secret: "TYaqCopUUsx2Jmakif55qBquZSUXOGhL",
        grant_type: "password",
        username: login,
        password: password,
        scope: "openid audience profile",
      },
      { headers: { "content-type": "application/x-www-form-urlencoded" } },
    )
    .then((data) => data.data.id_token);
}

async function getToken(page: string, login: string, password: string) {
  await tokenRequest(login, password)
    .then((token) => {
      document.cookie = `JWT=${token}`;
      localStorage.setItem("login", login);
      localStorage.setItem("password", password);
			log.debug(`access-token: ${token.toString()}`);
      localStorage.setItem("access-token", token.toString());
			axios.defaults.headers.common['Authorization'] = `Bearer ${token.toString()}`;
      window.location.replace(page ? page : "/");
    })
    .catch((error) => {
      alert("Incorrect login/password");
    });
}

export default function Login({}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const savedLogin = localStorage.getItem("login");
  const savedPassword = localStorage.getItem("password");

  const [params] = useSearchParams();
  log.debug(`params: ${params}`);
  log.debug(`page: ${params.get("page")}`);

  tokenRequest(savedLogin, savedPassword)
    .then((token) => {
			log.debug("Getting token by saved credentials");
      document.cookie = `JWT=${token}`;
			log.debug(`access-token: ${token.toString()}`);
      localStorage.setItem("access-token", token.toString());
			axios.defaults.headers.common['Authorization'] = `Bearer ${token.toString()}`;
      window.location.replace(params.get("page") ? params.get("page") : "/");
    })
    .catch((error) => {
      localStorage.removeItem("login");
      localStorage.removeItem("password");
      localStorage.removeItem("access-token");
    });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%;}`,
        }}
      />
      <div className="login-page">
        <div className="login-form">
          <div className="login-container">
            <span>Login </span>
            <input
              value={login}
              type="text"
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="password-container">
            <span>Password </span>
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            id="login"
            onClick={() => getToken(params.get("page"), login, password)}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
