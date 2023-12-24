import React, { ChangeEvent, useState } from "react";
import Toolbar, { Page } from "../ConfigurationPage/Toolbar";
import classes from "./PaymentPageConfig.module.css";
import { useLoaderData, useNavigate } from "react-router";
import axios from "axios";

const backgroundColor = (
  <style
    dangerouslySetInnerHTML={{
      __html: `html, body {background-color: #0c122e; height: 100%;}`,
    }}
  />
);

function uploadFile(file, name) {
  return axios.put(
    `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}?public=true`,
    { file: file },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export default function PaymentPageConfigComponent({}: {}) {
  const { recipientId } = useLoaderData();
  const navigate = useNavigate();
  const [isRequestsEnabled, setRequestsEnabled] = useState(false);
  const handleBackUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log(file);
      uploadFile(file, `back-${recipientId}.jpg`).then(() => navigate(0));
    }
  };
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log(file);
      uploadFile(file, `logo-${recipientId}.png`).then(() => navigate(0));
    }
  };

  const handleTogglingRequests = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setRequestsEnabled(e.target.value === "enabled");
    }
  };

  return (
    <div className={classes.paymentpage}>
      {backgroundColor}
      <Toolbar page={Page.PAYMENTPAGE} />
      <div className={classes.paymentpageconfig}>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>Фоновое изображение</div>
          <label className="upload-button">
            <input type="file" onChange={handleBackUpload} />
            <img
              className={classes.backgroundimage}
              src={`${
                process.env.REACT_APP_CDN_ENDPOINT
              }/back-${recipientId}.jpg?random=${Date.now()}`}
            />
          </label>
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>Логотип канала</div>
          <label className="upload-button">
            <input type="file" onChange={handleLogoUpload} />
            <img
              className={classes.backgroundimage}
              src={`${
                process.env.REACT_APP_CDN_ENDPOINT
              }/logo-${recipientId}.png?random=${Date.now()}`}
            />
          </label>
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>
            Реквесты музыки/видео
          </div>
          <select
            value={isRequestsEnabled ? "enabled" : "disabled"}
            className="widget-settings-value select"
            style={{ width: "120px" }}
            onChange={handleTogglingRequests}
          >
            <option key="enabled">enabled</option>
            <option key="disabled">disabled</option>
          </select>
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>
            Стоимость реквестов (за одно видео, в рублях)
          </div>
          <input
            type="number"
            className={classes.widgetsettingsvalue}
          />
        </div>
      </div>
    </div>
  );
}
