import { useContext, useRef, useState } from "react";
import { DefaultApiFactory as HistoryService } from "@opendonationassistant/oda-history-service-client";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Flex, Input, Select, Switch } from "antd";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";
import { uuidv7 } from "uuidv7";
import { useTranslation } from "react-i18next";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../components/Overlay/Overlay";
import PrimaryButton from "../../components/Button/PrimaryButton";
import {
  BorderedIconButton,
} from "../../components/IconButton/IconButton";
import SubActionButton from "../../components/Button/SubActionButton";
import AddIcon from "../../icons/AddIcon";
import { LabeledSwitchComponent } from "../../components/LabeledSwitch/LabeledSwitchComponent";
import classes from "./AddHistoryItemModal.module.css";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import SecondaryButton from "../../components/Button/SecondaryButton";

export default function AddHistoryItemModal({ compact }: { compact: boolean }) {
  const { recipientId } = useLoaderData() as WidgetData;
  const { t } = useTranslation();

  const parentModal = useContext(ModalStateContext);
  const [showModal] = useState<ModalState>(() => new ModalState(parentModal));

  const [nickname, setNickname] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [countInTop, setCountInTop] = useState<boolean>(false);
  const [triggerReel, setTriggerReel] = useState<boolean>(false);
  const [triggerDonaton, setTriggerDonaton] = useState<boolean>(false);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

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
      message: message,
      nickname: nickname,
      triggerAlert: showAlert,
      triggerReel: triggerReel,
      triggerDonaton: triggerDonaton,
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
      addToGoal: false,
      id: uuidv7(),
      paymentId: uuidv7(),
    });
  }

  return (
    <>
      {!compact && (
        <SubActionButton onClick={() => (showModal.show = true)}>
          {t("button-add-historyitem")}
        </SubActionButton>
      )}
      {compact && (
        <BorderedIconButton onClick={() => (showModal.show = true)}>
          <AddIcon color="var(--oda-color-1000)" />
        </BorderedIconButton>
      )}
      <ModalStateContext.Provider value={showModal}>
        <Overlay>
          <Panel>
            <Title>Добавить донат</Title>
            <Flex vertical className="full-width">
              <Flex vertical className={`${classes.section}`} gap={12}>
                <div className={`${classes.sectiontitle}`}>Основное</div>
                <Flex vertical>
                  <div className={`${classes.label}`}>Ник поддержавшего</div>
                  <Input
                    value={nickname}
                    onChange={(value) => setNickname(value.target.value)}
                  />
                </Flex>
                <Flex vertical>
                  <div className={`${classes.label}`}>Сумма</div>
                  <InputNumber
                    className={`full-width`}
                    value={amount}
                    onChange={(value) => setAmount(value ?? 0)}
                  />
                </Flex>
                <Flex vertical>
                  <div className={`${classes.label}`}>Сообщение</div>
                  <Input
                    type="textarea"
                    className={`full-width`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Flex>
                <Flex vertical>
                  <div className={`${classes.label}`}>
                    Учитывать в сборе средств
                  </div>
                  <Select
                    className="full-width"
                    value={goalId}
                    onChange={(selected) => setGoalId(selected)}
                    options={paymentPageConfig.current?.goals.map((goal) => {
                      return { value: goal.id, label: goal.briefDescription };
                    })}
                  />
                </Flex>
              </Flex>
              <Flex vertical className={`${classes.section}`}>
                <div className={`${classes.sectiontitle}`}>Дополнительно</div>
                <Flex wrap gap={6}>
                  <LabeledSwitchComponent
                    label="dialog-add-donation-show-alert"
                    value={showAlert}
                    onChange={() => setShowAlert((old) => !old)}
                  />
                  <LabeledSwitchComponent
                    label="dialog-add-donation-count-in-top"
                    value={countInTop}
                    onChange={() => setCountInTop((old) => !old)}
                  />
                  <LabeledSwitchComponent
                    label="dialog-add-donation-trigger-reel"
                    value={triggerReel}
                    onChange={() => setTriggerReel((old) => !old)}
                  />
                  <LabeledSwitchComponent
                    label="dialog-add-donation-trigger-donaton"
                    value={triggerDonaton}
                    onChange={() => setTriggerDonaton((old) => !old)}
                  />
                </Flex>
              </Flex>
              <Flex gap={6} justify="flex-end">
                <SecondaryButton onClick={() => (showModal.show = false)}>
                  Отменить
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    addItem();
                    showModal.show = false;
                  }}
                >
                  Добавить
                </PrimaryButton>
              </Flex>
            </Flex>
          </Panel>
        </Overlay>
      </ModalStateContext.Provider>
    </>
  );
}
