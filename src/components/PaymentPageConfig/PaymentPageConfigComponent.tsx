import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Toolbar, { Page } from "../ConfigurationPage/Toolbar";
import classes from "./PaymentPageConfig.module.css";
import { useLoaderData, useNavigate } from "react-router";
import axios from "axios";
import { PaymentPageConfig } from "../MediaWidget/PaymentPageConfig";

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
  const paymentPageConfig = useRef<PaymentPageConfig>(null);
  const [isRequestsEnabled, setRequestsEnabled] = useState(false);
  const [requestCost, setRequestCost] = useState(100);
  const [email, setEmail] = useState("");
	const [fio, setFio] = useState("");
	const [inn, setInn] = useState("");

  function listenPaymentPageConfigUpdated() {
    setRequestCost(paymentPageConfig.current?.requestCost ?? 100);
    setRequestsEnabled(
      !paymentPageConfig.current?.requestsDisabledPermanently ?? false,
    );
    setEmail(paymentPageConfig.current?.email ?? "");
		setFio(paymentPageConfig.current?.fio ?? "");
		setInn(paymentPageConfig.current?.inn ?? "");
  }

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
      paymentPageConfig.current?.toggleRequestsPermanently();
    }
  };

  useEffect(() => {
    paymentPageConfig.current = new PaymentPageConfig();
  }, [recipientId]);

  useEffect(() => {
    document.addEventListener(
      "paymentPageUpdated",
      listenPaymentPageConfigUpdated,
    );
    return () =>
      document.removeEventListener(
        "paymentPageUpdated",
        listenPaymentPageConfigUpdated,
      );
  }, [recipientId]);

  return (
    <div className={classes.paymentpage}>
      {backgroundColor}
      <Toolbar page={Page.PAYMENTPAGE} />
      <div className={classes.paymentpageconfig}>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>ФИО</div>
          <input
            value={fio}
            className={classes.widgetsettingsvalue}
            style={{ width: "250px" }}
            onChange={(e) =>
              paymentPageConfig.current?.setFio(e.target.value)
            }
          />
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>ИНН</div>
          <input
            value={inn}
            className={classes.widgetsettingsvalue}
            style={{ width: "250px" }}
            onChange={(e) =>
              paymentPageConfig.current?.setInn(e.target.value)
            }
          />
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>Контактный e-mail</div>
          <input
            value={email}
            className={classes.widgetsettingsvalue}
            style={{ width: "250px" }}
            onChange={(e) =>
              paymentPageConfig.current?.setEmail(e.target.value)
            }
          />
        </div>
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
              className={classes.logoimage}
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
            value={requestCost}
            className={classes.widgetsettingsvalue}
            onChange={(e) =>
              paymentPageConfig.current?.setRequestsCost(Number(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
}
