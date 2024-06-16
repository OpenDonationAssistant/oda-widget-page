import { Descriptions, List, Spin, Table, theme } from "antd";
import React from "react";
import Toolbar, { Page } from "../../components/ConfigurationPage/Toolbar";
import classes from "./HistoryPage.module.css";
import {
  HistoryItemData,
  DefaultApiFactory as HistoryService,
} from "@opendonationassistant/oda-history-service-client";
import { usePagination } from "ahooks";
import { PaginationResult } from "ahooks/lib/usePagination/types";

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

async function getHistory(params: {
  current: number;
  pageSize: number;
}): Promise<{ total: number; list: HistoryItemData[] }> {
  const history = await HistoryService(
    undefined,
    process.env.REACT_APP_WIDGET_API_ENDPOINT,
  ).getHistory(
    {
      recipientId: "testuser",
    },
    { params: { size: params.pageSize, page: params.current - 1 } },
  );
  return { total: history.data.totalSize, list: history.data?.content };
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
        pageSizeOptions: [5,10,15,20,25],
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
  const { data, loading, pagination } = usePagination(getHistory, {defaultPageSize: 5});

  return (
    <>
      <div className="configuration-container">
        {backgroundColor}
        <Toolbar page={Page.HISTORY} />
        <div className={classes.pagecontainer}>
          {loading ? <Spin /> : list(data?.list ?? [], pagination)}
        </div>
      </div>
    </>
  );
}
