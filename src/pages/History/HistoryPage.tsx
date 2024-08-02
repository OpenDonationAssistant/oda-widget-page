import {
  Descriptions,
  Input,
  InputNumber,
  List,
  Modal,
  Select,
  Spin,
  Switch,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useRef, useState } from "react";
import classes from "./HistoryPage.module.css";
import {
  HistoryItemData,
  DefaultApiFactory as HistoryService,
} from "@opendonationassistant/oda-history-service-client";
import { usePagination } from "ahooks";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useTranslation } from "react-i18next";
import { uuidv7 } from "uuidv7";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";

const dateTimeFormat = new Intl.DateTimeFormat("ru-RU", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

function description(item: HistoryItemData) {
  const desc = [];
  if (item.message) {
    desc.push({
      key: "message",
      label: <span className="material-symbols-sharp">chat_bubble</span>,
      children: item.message,
      span: 3,
    });
  }
  if (item.goals) {
    desc.push({
      key: "goal",
      label: <span className="material-symbols-sharp">target</span>,
      children: item.goals?.map((goal) => goal.goalTitle),
    });
  }
  if (item.reelResults) {
    desc.push({
      key: "reel",
      label: <span className="material-symbols-sharp">casino</span>,
      children: item.reelResults?.pop()?.title,
    });
  }
  return desc;
}

function list(data: HistoryItemData[], pagination: any) {
  return (
    <List
      dataSource={data}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        onShowSizeChange: pagination.onChange,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 15, 20, 25],
        align: "center",
        position: "bottom",
      }}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <span className={classes.title}>
                {item.nickname}{" "}
                <span className={classes.little}>задонатил(а)</span>{" "}
                {item.amount?.major}
                {`\u20BD`}
                {item.authorizationTimestamp && (
                  <span className={classes.timestamp}>
                    {dateTimeFormat.format(
                      new Date(item.authorizationTimestamp),
                    )}
                  </span>
                )}
              </span>
            }
            description={
              <div>
                <Descriptions items={description(item)} />
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}

export default function HistoryPage({}) {
  const { recipientId } = useLoaderData() as WidgetData;
  const { data, loading, pagination } = usePagination(getHistory, {
    defaultPageSize: 10,
  });
  const [showModal, setShowModal] = useState<boolean>();
  const { t } = useTranslation();
  const [nickname, setNickname] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [countInTop, setCountInTop] = useState<boolean>(false);
  const [countInGoal, setCountInGoal] = useState<boolean>(false);
  const [triggerReel, setTriggerReel] = useState<boolean>(false);
  const navigate = useNavigate();
  const paymentPageConfig = useRef<PaymentPageConfig | null>(
    new PaymentPageConfig(recipientId),
  );
  const [goalId, setGoalId] = useState<string | null>(null);

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

  async function getHistory(params: {
    current: number;
    pageSize: number;
  }): Promise<{ total: number; list: HistoryItemData[] }> {
    const history = await HistoryService(
      undefined,
      process.env.REACT_APP_HISTORY_API_ENDPOINT,
    ).getHistory(
      {
        recipientId: recipientId,
      },
      { params: { size: params.pageSize, page: params.current - 1 } },
    );
    return { total: history.data.totalSize, list: history.data?.content };
  }

  return (
    <Content>
      <div className="configuration-container">
        <div className={classes.pagecontainer}>
          <div className={classes.buttons}>
            <button
              className="oda-btn-default"
              onClick={() => setShowModal((old) => !old)}
            >
              {t("button-add-historyitem")}
            </button>
          </div>
          {loading ? <Spin /> : list(data?.list ?? [], pagination)}
        </div>
        <Modal
          title={t("dialog-add-donation-title")}
          open={showModal}
          onClose={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          onOk={() => {
            addItem();
            setShowModal(false);
          }}
        >
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
        </Modal>
      </div>
    </Content>
  );
}
