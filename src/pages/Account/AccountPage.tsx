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
} from "../../components/Overlay/Overlay";
import { useContext, useState } from "react";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { changePassword as changePasswordRequest } from "@opendonationassistant/recipient-service";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export const AccountPage = observer(() => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const parentModalState = useContext(ModalStateContext);
  const [changePasswordModal] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [passwordChangedModal] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [wrongPasswordModal] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
    useState<string>("");

  const changePassword = async () => {
    return changePasswordRequest({
      body: {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
      headers: { Authorization: `Bearer ${accessToken}` },
      throwOnError: true,
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
      <h1>{t("account-settings-title")}</h1>
      <ModalStateContext.Provider value={passwordChangedModal}>
        <Overlay>
          <Dialog>
            <Flex vertical className="full-width">
              <div className={`${classes.successmessage}`}>
                {t("account-password-changed")}
              </div>
              <Flex justify="center" className="full-width">
                <SecondaryButton
                  onClick={() => {
                    passwordChangedModal.show = false;
                  }}
                >
                  {t("common-close")}
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
                {t("account-wrong-password")}
              </div>
              <Flex justify="center" className="full-width">
                <SecondaryButton
                  onClick={() => {
                    wrongPasswordModal.show = false;
                  }}
                >
                  {t("common-close")}
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
                {t("account-password-changed")}
              </div>
              <Flex justify="center" className="full-width">
                <SecondaryButton
                  onClick={() => {
                    passwordChangedModal.show = false;
                  }}
                >
                  {t("common-close")}
                </SecondaryButton>
              </Flex>
            </Flex>
          </Dialog>
        </Overlay>
      </ModalStateContext.Provider>
      <ModalStateContext.Provider value={changePasswordModal}>
        <Overlay>
          <Dialog>
            <Title>{t("account-change-password-title")}</Title>
            <Flex
              align="center"
              className={`${classes.container} ${classes.oldpassword}`}
            >
              <div className={`${classes.label}`}>{t("account-old-password")}</div>
              <Input
                type="password"
                placeholder={t("account-old-password")}
                className={`${classes.input}`}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Flex>
            <Flex align="center" className={`${classes.container}`}>
              <div className={`${classes.label}`}>{t("account-new-password")}</div>
              <Input
                type="password"
                placeholder={t("account-new-password")}
                className={`${classes.input}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Flex>
            <Flex align="center" className={`${classes.container}`}>
              <div className={`${classes.label}`}>{t("account-repeat-password")}</div>
              <Input
                type="password"
                placeholder={t("account-repeat-password")}
                className={`${classes.input}`}
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              />
            </Flex>
            {newPassword !== newPasswordConfirmation && (
              <div className={`${classes.warning}`}>{t("account-passwords-mismatch")}</div>
            )}
            <Flex justify="flex-end" gap={9} className={`${classes.buttons}`}>
              <SecondaryButton
                onClick={() => {
                  changePasswordModal.show = false;
                }}
              >
                {t("button-cancel")}
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
                {t("account-change-password-action")}
              </PrimaryButton>
            </Flex>
          </Dialog>
        </Overlay>
      </ModalStateContext.Provider>
      <Flex className={`${classes.container}`}>
        <SecondaryButton onClick={() => (changePasswordModal.show = true)}>
          {t("account-change-password-button")}
        </SecondaryButton>
      </Flex>
    </>
  );
});
