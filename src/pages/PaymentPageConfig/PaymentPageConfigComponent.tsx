import { ChangeEvent, useEffect, useRef, useState } from "react";
import classes from "./PaymentPageConfig.module.css";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import { Flex, Input, QRCode } from "antd";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import PrimaryButton from "../../components/Button/PrimaryButton";
import UtilityButton from "../../components/Button/UtilityButton";
import { uploadBlob } from "../../utils";

export default function PaymentPageConfigComponent() {
  const { recipientId } = useLoaderData() as WidgetData;
  const navigate = useNavigate();
  const paymentPageConfig = useRef<PaymentPageConfig | null>(null);
  const [minimalAmount, setMinimalAmount] = useState<number>(40);
  const [email, setEmail] = useState("");
  const [fio, setFio] = useState("");
  const [inn, setInn] = useState("");
  const [arbitraryText, setArbitraryText] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [payButtonText, setPayButtonText] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(
    "https://api.oda.digital/public/commonlogo.png",
  );
  const [backUrl, setBackUrl] = useState<string>(
    "https://api.oda.digital/public/commonback.jpg",
  );

  useEffect(() => {
    const url = `${process.env.REACT_APP_CDN_ENDPOINT}/logo-${recipientId}.png?random=${Date.now()}`;
    fetch(url)
      .then((response) => {
        if (response.status !== 404) {
          setImageUrl(url);
        }
      })
      .catch((error) => {});
    const backUrl = `${process.env.REACT_APP_CDN_ENDPOINT}/back-${recipientId}.jpg?random=${Date.now()}`;
    fetch(backUrl)
      .then((response) => {
        if (response.status !== 404) {
          setBackUrl(backUrl);
        }
      })
      .catch((error) => {});
  }, [recipientId]);

  function listenPaymentPageConfigUpdated() {
    if (!paymentPageConfig.current) {
      return;
    }
    setMinimalAmount(paymentPageConfig.current.minimalAmount);
    setEmail(paymentPageConfig.current?.email ?? "");
    setFio(paymentPageConfig.current?.fio ?? "");
    setInn(paymentPageConfig.current?.inn ?? "");
    setArbitraryText(paymentPageConfig.current?.arbitraryText ?? null);
    setPayButtonText(paymentPageConfig.current?.payButtonText ?? null);
  }

  const handleBackUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const url = `${process.env.REACT_APP_CDN_ENDPOINT}/back-${recipientId}.jpg?random=${Date.now()}`;
      uploadBlob(file, `back-${recipientId}.jpg`, true).then(() =>
        setBackUrl(url),
      );
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log(file);
      const url = `${process.env.REACT_APP_CDN_ENDPOINT}/logo-${recipientId}.png?random=${Date.now()}`;
      uploadBlob(file, `logo-${recipientId}.png`, true).then(() =>
        setImageUrl(url),
      );
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
    <>
      <h1>Страница доната</h1>
      <div className={classes.paymentpageconfig}>
        <Flex className={`${classes.panel}`}>
          <Flex vertical style={{ flexGrow: 1 }}>
            <a
              href={`https://${paymentPageConfig.current?.url}`}
              className={classes.url}
            >
              {paymentPageConfig.current?.url}
            </a>
            <Flex
              justify="space-between"
              align="flex-end"
              style={{ alignItems: "stretch" }}
              gap={12}
            >
              <Flex vertical style={{ flexGrow: 1 }}>
                <Flex vertical style={{ height: "100%" }}>
                  <div
                    className={`${classes.fieldname}`}
                    style={{
                      marginTop: "30px",
                    }}
                  >
                    Текст на странице
                  </div>
                  <textarea
                    value={arbitraryText ?? ""}
                    className={classes.pagetext}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      height: "108px",
                    }}
                    onChange={(e) => {
                      paymentPageConfig.current?.setArbitraryText(
                        e.target.value,
                      );
                      if (!hasChanges) {
                        setHasChanges(true);
                      }
                    }}
                  />
                </Flex>
              </Flex>
              <Flex vertical style={{ justifyContent: "end" }}>
                <div className={`${classes.fieldname}`}>Аватарка</div>
                <label>
                  <input type="file" onChange={handleLogoUpload} />
                  <img className={classes.logoimage} src={imageUrl} />
                </label>
              </Flex>
              <Flex vertical style={{ justifyContent: "end" }}>
                <div className={`${classes.fieldname}`}>
                  Фоновое изображение
                </div>
                <label>
                  <input type="file" onChange={handleBackUpload} />
                  <img className={classes.backgroundimage} src={backUrl} />
                </label>
              </Flex>
            </Flex>
          </Flex>
          {paymentPageConfig.current?.url && (
            <QRCode
              size={200}
              value={`https://${paymentPageConfig.current.url}`}
            />
          )}
        </Flex>
        <Flex className={`${classes.panel}`} vertical>
          <div style={{ marginBottom: "9px" }}>Для самозанятого или ИП</div>
          <Flex gap={12} className="full-width">
            <Flex vertical style={{ flexGrow: 1 }}>
              <div className={classes.fieldname}>ФИО</div>
              <Input
                value={fio}
                onChange={(e) => {
                  paymentPageConfig.current?.setFio(e.target.value);
                  if (!hasChanges) {
                    setHasChanges(true);
                  }
                }}
              />
            </Flex>
            <Flex vertical style={{ flexGrow: 1 }}>
              <div className={classes.fieldname}>ИНН</div>
              <Input
                value={inn}
                onChange={(e) => {
                  paymentPageConfig.current?.setInn(e.target.value);
                  if (!hasChanges) {
                    setHasChanges(true);
                  }
                }}
              />
            </Flex>
            <Flex vertical style={{ flexGrow: 1 }}>
              <div className={classes.fieldname}>Контактный e-mail</div>
              <Input
                value={email}
                onChange={(e) => {
                  paymentPageConfig.current?.setEmail(e.target.value);
                  if (!hasChanges) {
                    setHasChanges(true);
                  }
                }}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex className={`${classes.panel}`} vertical>
          <div style={{ marginBottom: "9px" }}>Поддержка</div>
          <Flex gap={12} className="full-width">
            <Flex vertical style={{ flexGrow: 1 }}>
              <div className={classes.fieldname}>Минимальная сумма доната</div>
              <InputNumber
                value={minimalAmount}
                onChange={(value) => {
                  if (paymentPageConfig.current) {
                    paymentPageConfig.current.minimalAmount = value;
                  }
                  if (!hasChanges) {
                    setHasChanges(true);
                  }
                }}
              />
            </Flex>
            <Flex vertical style={{ flexGrow: 1 }}>
              <div className={classes.fieldname}>Текст кнопки "Задонатить"</div>
              <Input
                style={{ height: "48px" }}
                value={payButtonText ?? ""}
                onChange={(e) => {
                  if (paymentPageConfig?.current) {
                    paymentPageConfig.current.payButtonText = e.target.value;
                    if (!hasChanges) {
                      setHasChanges(true);
                    }
                  }
                }}
              />
            </Flex>
          </Flex>
        </Flex>
        {hasChanges && (
          <Flex gap={12} justify="flex-end" className={`${classes.buttons}`}>
            <UtilityButton
              onClick={() => {
                paymentPageConfig.current?.reloadConfig();
                setHasChanges(false);
              }}
            >
              Отменить
            </UtilityButton>
            <PrimaryButton
              onClick={() => {
                paymentPageConfig.current?.save();
                setHasChanges(false);
              }}
            >
              Сохранить изменения
            </PrimaryButton>
          </Flex>
        )}
      </div>
    </>
  );
}
