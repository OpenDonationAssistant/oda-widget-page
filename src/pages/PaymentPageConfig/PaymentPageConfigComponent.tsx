import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import classes from "./PaymentPageConfig.module.css";
import { useLoaderData, useNavigate } from "react-router";
import axios from "axios";
import { WidgetData } from "../../types/WidgetData";
import { File } from "buffer";
import { Content } from "antd/es/layout/layout";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import { Flex, QRCode } from "antd";

function uploadFile(file: File, name: string) {
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
  const { recipientId } = useLoaderData() as WidgetData;
  const navigate = useNavigate();
  const paymentPageConfig = useRef<PaymentPageConfig | null>(null);
  const [isRequestsEnabled, setRequestsEnabled] = useState(false);
  const [requestCost, setRequestCost] = useState(100);
  const [minimalAmount, setMinimalAmount] = useState<Number>(40);
  const [email, setEmail] = useState("");
  const [fio, setFio] = useState("");
  const [inn, setInn] = useState("");
  const [arbitraryText, setArbitraryText] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [payButtonText, setPayButtonText] = useState<string | null>(null);
  const [hasCustomCss, setHasCustomCss] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<string>("");

  function listenPaymentPageConfigUpdated() {
    if (!paymentPageConfig.current) {
      return;
    }
    setMinimalAmount(paymentPageConfig.current.minimalAmount);
    setRequestCost(paymentPageConfig.current?.requestCost ?? 100);
    setRequestsEnabled(
      !paymentPageConfig.current?.requestsDisabledPermanently ?? false,
    );
    setEmail(paymentPageConfig.current?.email ?? "");
    setFio(paymentPageConfig.current?.fio ?? "");
    setInn(paymentPageConfig.current?.inn ?? "");
    setArbitraryText(paymentPageConfig.current?.arbitraryText ?? null);
    setPayButtonText(paymentPageConfig.current?.payButtonText ?? null);
    if (paymentPageConfig.current?.customCss) {
      setHasCustomCss(true);
    }
    setTooltip(paymentPageConfig.current?.tooltip ?? "");
  }

  const handleBackUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      uploadFile(file, `back-${recipientId}.jpg`).then(() => navigate(0));
    }
  };

  const handleCssUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (paymentPageConfig.current) {
        paymentPageConfig.current.customCss = `${process.env.REACT_APP_CDN_ENDPOINT}/css-${recipientId}.css`;
        paymentPageConfig.current.save();
      }
      uploadFile(file, `css-${recipientId}.css`);
    }
  };

  const deleteCustomCss = () => {
    if (paymentPageConfig.current) {
      paymentPageConfig.current.customCss = "";
      paymentPageConfig.current.save();
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
      if (!hasChanges) {
        setHasChanges(true);
      }
    }
  };

  useEffect(() => {
    paymentPageConfig.current = new PaymentPageConfig(recipientId);
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
    <Content>
      <div className={classes.paymentpageconfig}>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>Адрес страницы</div>
          <a
            href={`https://${recipientId}.oda.digital/`}
            className={classes.url}
          >
            https://{recipientId}.oda.digital/
          </a>
        </div>
        <Flex justify="flex-end">
          <QRCode size={320} value={`https://${recipientId}.oda.digital/`} />
        </Flex>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>ФИО</div>
          <input
            value={fio}
            className={classes.widgetsettingsvalue}
            style={{ width: "250px" }}
            onChange={(e) => {
              paymentPageConfig.current?.setFio(e.target.value);
              if (!hasChanges) {
                setHasChanges(true);
              }
            }}
          />
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>ИНН</div>
          <input
            value={inn}
            className={classes.widgetsettingsvalue}
            style={{ width: "250px" }}
            onChange={(e) => {
              paymentPageConfig.current?.setInn(e.target.value);
              if (!hasChanges) {
                setHasChanges(true);
              }
            }}
          />
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>Контактный e-mail</div>
          <input
            value={email}
            className={classes.widgetsettingsvalue}
            style={{ width: "250px" }}
            onChange={(e) => {
              paymentPageConfig.current?.setEmail(e.target.value);
              if (!hasChanges) {
                setHasChanges(true);
              }
            }}
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
        <div
          style={{ alignItems: "baseline" }}
          className={classes.widgetsettingsitem}
        >
          <div className={classes.widgetsettingsname}>Custom css</div>
          <label className="upload-button">
            <input type="file" onChange={handleCssUpload} />
            Загрузить
          </label>
          {hasCustomCss && (
            <button
              style={{ marginLeft: "10px" }}
              className="oda-button"
              onClick={() => {
                deleteCustomCss();
              }}
            >
              Удалить
            </button>
          )}
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>Текст на странице</div>
          <textarea
            value={arbitraryText ?? ""}
            className={classes.widgetsettingsvalue}
            style={{
              margin: "5px",
              width: "100%",
              textAlign: "left",
              minHeight: "250px",
            }}
            onChange={(e) => {
              paymentPageConfig.current?.setArbitraryText(e.target.value);
              if (!hasChanges) {
                setHasChanges(true);
              }
            }}
          />
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>
            Минимальная сумма доната
          </div>
          <input
            type="number"
            value={minimalAmount}
            className={classes.widgetsettingsvalue}
            onChange={(e) => {
              if (paymentPageConfig.current) {
                paymentPageConfig.current.minimalAmount = Number(
                  e.target.value,
                );
              }
              if (!hasChanges) {
                setHasChanges(true);
              }
            }}
          />
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>
            Реквесты музыки/видео
          </div>
          <select
            value={isRequestsEnabled ? "enabled" : "disabled"}
            className="widget-settings-value select"
            style={{ width: "120px", backgroundColor: "#0c122e" }}
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
            onChange={(e) => {
              paymentPageConfig.current?.setRequestsCost(
                Number(e.target.value),
              );
              if (!hasChanges) {
                setHasChanges(true);
              }
            }}
          />
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>
            Текст подсказки для заказа видео
          </div>
          <textarea
            value={tooltip ?? ""}
            className={classes.widgetsettingsvalue}
            style={{
              margin: "5px",
              width: "100%",
              textAlign: "left",
              minHeight: "250px",
            }}
            onChange={(e) => {
              if (paymentPageConfig.current) {
                paymentPageConfig.current.tooltip = e.target.value;
              }
              if (!hasChanges) {
                setHasChanges(true);
              }
            }}
          />
        </div>
        <div className={classes.widgetsettingsitem}>
          <div className={classes.widgetsettingsname}>
            Текст кнопки "Задонатить"
          </div>
          <input
            value={payButtonText ?? ""}
            className={classes.widgetsettingsvalue}
            style={{ width: "250px" }}
            onChange={(e) => {
              if (paymentPageConfig.current) {
                paymentPageConfig.current.payButtonText = e.target.value;
              }
              if (!hasChanges) {
                setHasChanges(true);
              }
            }}
          />
        </div>
        {hasChanges && (
          <div className={classes.buttons}>
            <button
              className={classes.cancelButton}
              onClick={() => {
                paymentPageConfig.current?.reloadConfig();
                setHasChanges(false);
              }}
            >
              Отменить
            </button>
            <button
              className={classes.saveButton}
              onClick={() => {
                paymentPageConfig.current?.save();
                setHasChanges(false);
              }}
            >
              Сохранить
            </button>
          </div>
        )}
      </div>
    </Content>
  );
}
