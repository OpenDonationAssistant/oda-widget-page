import { Flex, List, Spin } from "antd";
import classes from "./HistoryPage.module.css";
import {
  HistoryItemData,
  DefaultApiFactory as HistoryService,
} from "@opendonationassistant/oda-history-service-client";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import HistoryItem from "./HistoryItem";
import AddHistoryItemModal from "./AddHistoryItemModal";
import { usePagination } from "ahooks";

function HistoryItemList({}: {}) {
  const { recipientId } = useLoaderData() as WidgetData;

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

  const { data, loading, pagination } = usePagination(getHistory, {
    defaultPageSize: 5,
  });

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <List
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
          dataSource={data?.list}
          renderItem={(item) => <HistoryItem item={item} />}
        />
      )}
    </>
  );
}

export default function HistoryPage({}) {

function testAlert(topic: string, alert: Alert) {
  publish(topic, {
    id: uuidv7(), // TODO: сделать опциональным
    alertId: alert.id,
    nickname: "Тестовый алерт",
    message: "Тестовое сообщение",
    amount: {
      major: 100,
      minor: 0,
      currency: "RUB",
    },
  });
}

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: "36px" }}
      >
        <h1 className={`${classes.header}`}>История</h1>
        <AddHistoryItemModal />
      </Flex>
      <div className="configuration-container" style={{ overflow: "auto" }}>
        <HistoryItemList />
      </div>
    </>
  );
}
