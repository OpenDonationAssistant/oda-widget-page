import { Flex, Input } from "antd";
import { observer } from "mobx-react-lite";
import classes from "./AccountPage.module.css";
import SecondaryButton from "../../components/Button/SecondaryButton";
import {
  Dialog,
  ModalState,
  ModalStateContext,
  Overlay,
  Title,
  Warning,
} from "../../components/Overlay/Overlay";
import { useContext, useState } from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { DefaultApiFactory as KeycloakService } from "@opendonationassistant/oda-recipient-service-client";

export const AccountPage = observer(({}) => {
  const parentModalState = useContext(ModalStateContext);
  const [changePasswordModal] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [passwordChangedModal, setPasswordChangedModal] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [wrongPasswordModal, setWrongPasswordModal] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
    useState<string>("");

  const changePassword = async () => {
    return KeycloakService(
      undefined,
      process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
    )
      .changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then(() => {
        passwordChangedModal.show = true;
      })
      .catch(() => {
        wrongPasswordModal.show = true;
      });
  };

  return (
    <>
      <h1>Настройки аккаунта</h1>
      <ModalStateContext.Provider value={passwordChangedModal}>
        <Overlay>
          <Dialog>
            <Flex vertical className="full-width">
              <div className={`${classes.successmessage}`}>
                Пароль успешно изменен
              </div>
              <Flex justify="center" className="full-width">
                <SecondaryButton
                  onClick={() => {
                    passwordChangedModal.show = false;
                  }}
                >
                  Закрыть
                </SecondaryButton>
              </Flex>
            </Flex>
          </Dialog>
        </Overlay>
      </ModalStateContext.Provider>
      <ModalStateContext.Provider value={wrongPasswordModal}>
        <Overlay>
          <Dialog>
            <Flex vertical className="full-width">
              <div className={`${classes.errormessage}`}>
                Неправильный пароль
              </div>
              <Flex justify="center" className="full-width">
                <SecondaryButton
                  onClick={() => {
                    wrongPasswordModal.show = false;
                  }}
                >
                  Закрыть
                </SecondaryButton>
              </Flex>
            </Flex>
          </Dialog>
        </Overlay>
      </ModalStateContext.Provider>
      <ModalStateContext.Provider value={passwordChangedModal}>
        <Overlay>
          <Dialog>
            <Flex vertical className="full-width">
              <div className={`${classes.successmessage}`}>
                Пароль успешно изменен
              </div>
              <Flex justify="center" className="full-width">
                <SecondaryButton
                  onClick={() => {
                    passwordChangedModal.show = false;
                  }}
                >
                  Закрыть
                </SecondaryButton>
              </Flex>
            </Flex>
          </Dialog>
        </Overlay>
      </ModalStateContext.Provider>
      <ModalStateContext.Provider value={changePasswordModal}>
        <Overlay>
          <Dialog>
            <Title>Смена пароля</Title>
            <Flex
              align="center"
              className={`${classes.container} ${classes.oldpassword}`}
            >
              <div className={`${classes.label}`}>Старый пароль</div>
              <Input
                type="password"
                placeholder="Старый пароль"
                className={`${classes.input}`}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Flex>
            <Flex align="center" className={`${classes.container}`}>
              <div className={`${classes.label}`}>Новый пароль</div>
              <Input
                type="password"
                placeholder="Новый пароль"
                className={`${classes.input}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Flex>
            <Flex align="center" className={`${classes.container}`}>
              <div className={`${classes.label}`}>Повторите новый пароль</div>
              <Input
                type="password"
                placeholder="Повторите новый пароль"
                className={`${classes.input}`}
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              />
            </Flex>
            {newPassword !== newPasswordConfirmation && (
              <div className={`${classes.warning}`}>Пароли не совпадают</div>
            )}
            <Flex justify="flex-end" gap={9} className={`${classes.buttons}`}>
              <SecondaryButton
                onClick={() => {
                  changePasswordModal.show = false;
                }}
              >
                Отменить
              </SecondaryButton>
              <PrimaryButton
                disabled={
                  oldPassword === "" || newPassword !== newPasswordConfirmation
                }
                onClick={() => {
                  changePassword();
                  changePasswordModal.show = false;
                }}
              >
                Сменить
              </PrimaryButton>
            </Flex>
          </Dialog>
        </Overlay>
      </ModalStateContext.Provider>
      <Flex className={`${classes.container}`}>
        <SecondaryButton onClick={() => (changePasswordModal.show = true)}>
          Сменить пароль
        </SecondaryButton>
      </Flex>
    </>
  );
});
