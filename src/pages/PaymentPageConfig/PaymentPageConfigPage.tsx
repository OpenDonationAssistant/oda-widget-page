import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import classes from "./PaymentPageConfig.module.css";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import { Flex, Input, QRCode, Select } from "antd";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import PrimaryButton from "../../components/Button/PrimaryButton";
import UtilityButton from "../../components/Button/UtilityButton";
import { uploadBlob } from "../../utils";
import { ExecutionStoreContext } from "../../stores/ExecutionStore";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Waiting,
} from "../../components/Overlay/Overlay";
import { AddListItemButton } from "../../components/List/List";
import { NotBorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";

export default function PaymentPageConfigPage() {
  const { recipientId } = useLoaderData() as WidgetData;
  const paymentPageConfig = useRef<PaymentPageConfig | null>(null);
  const [minimalAmount, setMinimalAmount] = useState<number>(40);
  const [email, setEmail] = useState("");
  const [fio, setFio] = useState("");
  const [inn, setInn] = useState("");
  const [socials, setSocials] = useState<Map<string, string>[]>([]);
  const [arbitraryText, setArbitraryText] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [payButtonText, setPayButtonText] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  const [imageUrl, setImageUrl] = useState<string>(
    "https://api.oda.digital/public/commonlogo.png",
  );

  const [backUrl, setBackUrl] = useState<string>(
    "https://api.oda.digital/public/commonback.jpg",
  );

  const executionStore = useContext(ExecutionStoreContext);
  const parentModalState = useContext(ModalStateContext);
  const [dialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
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
    setDescription(paymentPageConfig.current?.description ?? "");
    if (paymentPageConfig.current?.socials) {
      setSocials([...paymentPageConfig.current?.socials]);
    } else {
      setSocials([]);
    }
  }

  const handleBackUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const url = `${process.env.REACT_APP_CDN_ENDPOINT}/back-${recipientId}.jpg?random=${Date.now()}`;
      executionStore.fn = () => {
        dialogState.show = true;
        return uploadBlob(file, `back-${recipientId}.jpg`, true).then(() =>
          setBackUrl(url),
        );
      };
      executionStore.callback = () => {
        dialogState.show = false;
      };
      executionStore.run();
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log(file);
      const url = `${process.env.REACT_APP_CDN_ENDPOINT}/logo-${recipientId}.png?random=${Date.now()}`;
      executionStore.fn = () => {
        dialogState.show = true;
        return uploadBlob(file, `logo-${recipientId}.png`, true).then(() =>
          setImageUrl(url),
        );
      };
      executionStore.callback = () => {
        dialogState.show = false;
      };
      executionStore.run();
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
        <Flex className={`${classes.panel}`} vertical gap={12}>
          <Flex style={{ flexGrow: 1 }} align="center">
            <Flex vertical style={{ flexGrow: 1 }}>
              <a
                href={`https://${paymentPageConfig.current?.url}`}
                className={classes.url}
              >
                {paymentPageConfig.current?.url}
              </a>
              <Flex justify="flex-start" align="flex-start" gap={12}>
                <Flex vertical style={{ justifyContent: "end" }}>
                  <div className={`${classes.fieldname}`}>Аватарка</div>
                  <label style={{ flexGrow: 1, display: "flex" }}>
                    <input type="file" onChange={handleLogoUpload} />
                    <img className={classes.logoimage} src={imageUrl} />
                  </label>
                </Flex>
                <Flex vertical style={{ justifyContent: "end", flexGrow: 1 }}>
                  <div className={`${classes.fieldname}`}>
                    Фоновое изображение
                  </div>
                  <label>
                    <input type="file" onChange={handleBackUpload} />
                    <img className={classes.backgroundimage} src={backUrl} />
                  </label>
                </Flex>
                {paymentPageConfig.current?.url && (
                  <Flex vertical style={{ justifyContent: "end" }}>
                    <div className={`${classes.fieldname}`}>QR код</div>
                    <QRCode
                      size={210}
                      value={`https://${paymentPageConfig.current.url}`}
                    />
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex vertical style={{ flexGrow: 1 }}>
            <Flex vertical style={{ height: "100%" }}>
              <div className={`${classes.fieldname}`}>Текст на странице</div>
              <textarea
                value={arbitraryText ?? ""}
                className={classes.pagetext}
                style={{
                  width: "100%",
                  textAlign: "left",
                  height: "108px",
                }}
                onChange={(e) => {
                  paymentPageConfig.current?.setArbitraryText(e.target.value);
                  if (!hasChanges) {
                    setHasChanges(true);
                  }
                }}
              />
            </Flex>
          </Flex>
          <Flex vertical style={{ flexGrow: 1 }}>
            <div className={classes.fieldname}>
              Текст подписи внизу страницы
            </div>
            <textarea
              value={description ?? ""}
              className={classes.pagetext}
              style={{
                width: "100%",
                textAlign: "left",
                height: "108px",
              }}
              onChange={(e) => {
                if (paymentPageConfig?.current) {
                  paymentPageConfig.current.setDescription(e.target.value);
                  if (!hasChanges) {
                    setHasChanges(true);
                  }
                }
              }}
            />
          </Flex>
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
        <Flex className={`${classes.panel}`} vertical>
          <div style={{ marginBottom: "9px", fontSize: "21px" }}>
            Для самозанятого или ИП
          </div>
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
          <div style={{ marginBottom: "9px", fontSize: "21px" }}>
            Социальные ссылки
          </div>
          {socials.map((link) => (
            <Flex gap={12} className={`${classes.sociallink}`}>
              <Flex vertical>
                <div className={classes.fieldname}>Название</div>
                <Select
                  value={link.keys().next().value}
                  style={{ height: "100%", minWidth: "150px" }}
                  options={[
                    {
                      value: "twitch",
                      label: "Twitch",
                    },
                    {
                      value: "vk",
                      label: "ВКонтакте",
                    },
                    {
                      value: "youtube",
                      label: "YouTube",
                    },
                    {
                      value: "trovo",
                      label: "Trovo",
                    },
                    {
                      value: "boosty",
                      label: "Boosty",
                    },
                    {
                      value: "kick",
                      label: "Kick",
                    },
                  ]}
                  onChange={(newKey) => {
                    if (paymentPageConfig?.current) {
                      const oldKey = link.keys().next().value;
                      paymentPageConfig.current.changeSocial(oldKey, newKey);
                      setHasChanges(true);
                    }
                  }}
                />
              </Flex>
              <Flex vertical style={{ flexGrow: 1 }}>
                <div className={classes.fieldname}>Ссылка</div>
                <Input
                  value={link.values().next().value}
                  onChange={(e) => {
                    if (paymentPageConfig?.current) {
                      paymentPageConfig.current.updateSocial(
                        link.keys().next().value,
                        e.target.value,
                      );
                      setHasChanges(true);
                    }
                  }}
                />
              </Flex>
              <NotBorderedIconButton
                className={`${classes.deletesocialbutton}`}
                onClick={() => {
                  if (paymentPageConfig?.current) {
                    paymentPageConfig.current.deleteSocial(
                      link.keys().next().value,
                    );
                    setHasChanges(true);
                  }
                }}
              >
                <CloseIcon color="#FF8888" size={36} />
              </NotBorderedIconButton>
            </Flex>
          ))}
          <AddListItemButton
            onClick={() => {
              paymentPageConfig.current?.addSocial("", "");
              setHasChanges(true);
            }}
            label="Добавить ссылку"
          />
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
      <ModalStateContext.Provider value={dialogState}>
        <Overlay>
          <Waiting />
        </Overlay>
      </ModalStateContext.Provider>
    </>
  );
}
