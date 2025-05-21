import { useRef, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { DefaultApiFactory as HistoryService } from "@opendonationassistant/oda-history-service-client";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import { Flex, Input, InputNumber, Select, Switch } from "antd";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import { uuidv7 } from "uuidv7";
import { useTranslation } from "react-i18next";
import SecondaryButton from "../../components/SecondaryButton/SecondaryButton";
import AddIcon from "../../icons/AddIcon";

export default function AddHistoryItemModal({}) {
  const { recipientId } = useLoaderData() as WidgetData;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState<boolean>();
  const [nickname, setNickname] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [countInTop, setCountInTop] = useState<boolean>(false);
  const [countInGoal, setCountInGoal] = useState<boolean>(false);
  const [triggerReel, setTriggerReel] = useState<boolean>(false);
  const [goalId, setGoalId] = useState<string | null>(null);

  const paymentPageConfig = useRef<PaymentPageConfig | null>(
    new PaymentPageConfig(recipientId),
  );

  async function addItem() {
    await HistoryService(
      undefined,
      process.env.REACT_APP_HISTORY_API_ENDPOINT,
    ).addHistoryItem({
      recipientId: recipientId,
      amount: {
        minor: 0,
        major: amount,
        currency: "RUB",
      },
      nickname: nickname,
      triggerAlert: showAlert,
      triggerReel: triggerReel,
      goals: goalId
        ? [
            {
              goalId: goalId,
              goalTitle:
                paymentPageConfig.current?.goals.find(
                  (goal) => goal.id === goalId,
                )?.briefDescription ?? "",
            },
          ]
        : [],
      addToTop: countInTop,
      addToGoal: countInGoal,
      id: uuidv7(),
      paymentId: uuidv7(),
    });
    navigate(0);
  }

  return (
    <>
      <SecondaryButton onClick={() => setShowModal((old) => !old)}>
        <AddIcon color="var(--oda-primary-color)" />
        {t("button-add-historyitem")}
      </SecondaryButton>
      <Modal
        size="big"
        title={t("dialog-add-donation-title")}
        show={showModal ?? false}
        onDecline={() => setShowModal(false)}
        onSubmit={() => {
          addItem();
          setShowModal(false);
        }}
      >
      <Flex vertical className="full-width">
        <div className="settings-item">
          <LabeledContainer displayName="dialog-add-donation-nickname">
            <Input
              value={nickname}
              onChange={(value) => setNickname(value.target.value)}
            />
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="dialog-add-donation-amount">
            <InputNumber
              className={`full-width`}
              value={amount}
              onChange={(value) => setAmount(value ?? 0)}
            />
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="dialog-add-donation-count-in-goal">
            <Select
              className="full-width"
              value={goalId}
              onChange={(selected) => setGoalId(selected)}
              options={paymentPageConfig.current?.goals.map((goal) => {
                return { value: goal.id, label: goal.briefDescription };
              })}
            />
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="dialog-add-donation-show-alert">
            <Switch
              value={showAlert}
              onChange={() => setShowAlert((old) => !old)}
            />
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="dialog-add-donation-count-in-top">
            <Switch
              value={countInTop}
              onChange={() => setCountInTop((old) => !old)}
            />
          </LabeledContainer>
        </div>
        <div className="settings-item">
          <LabeledContainer displayName="dialog-add-donation-trigger-reel">
            <Switch
              value={triggerReel}
              onChange={() => setTriggerReel((old) => !old)}
            />
          </LabeledContainer>
        </div>
        </Flex>
      </Modal>
    </>
  );
}
