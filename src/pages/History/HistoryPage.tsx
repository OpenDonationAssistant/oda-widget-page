import { Descriptions, Layout, List, Modal, Spin, Table, theme } from "antd";
import { Content, Header as AntHeader } from "antd/es/layout/layout";
import React, { useState } from "react";
import Toolbar, { Page } from "../../components/ConfigurationPage/Toolbar";
import classes from "./HistoryPage.module.css";
import {
  HistoryItemData,
  DefaultApiFactory as HistoryService,
} from "@opendonationassistant/oda-history-service-client";
import { usePagination } from "ahooks";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import Sider from "antd/es/layout/Sider";
import Header from "../../components/ConfigurationPage/Header";

const dateTimeFormat = new Intl.DateTimeFormat("ru-RU", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const backgroundColor = (
  <style
    dangerouslySetInnerHTML={{
      __html: `
body::before {
    content: "";
    position: fixed;
    left: 0;
    right: 0;
    z-index: -1;
    display: block;
    background-color: #0c122e;
    width: 100%;
    height: 100%;
`,
    }}
  />
);

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
    <>
      {backgroundColor}
      <Layout>
        <AntHeader>
          <Header />
        </AntHeader>
        <Layout>
          <Sider>
            <Toolbar page={Page.HISTORY} />
          </Sider>
          <Content>
            <div className="configuration-container">
              <div className={classes.pagecontainer}>
                <div className={classes.buttons}>
                  <button
                    className="oda-btn-default"
                    style={{ display: "none" }}
                    onClick={() => setShowModal((old) => !old)}
                  >
                    Add
                  </button>
                </div>
                {loading ? <Spin /> : list(data?.list ?? [], pagination)}
              </div>
              <Modal
                title="Add Donation"
                open={showModal}
                onClose={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
                onOk={() => setShowModal(false)}
              >
                <div>Nickname:</div>
                <input className={classes.adddonationinput} />
                <div>Amount:</div>
                <input className={classes.adddonationinput} />
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
