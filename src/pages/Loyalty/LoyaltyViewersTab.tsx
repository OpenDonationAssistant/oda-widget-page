import { useState } from "react";
import { Flex, Input, Select, Table } from "antd";
import type { TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import {
  LoyaltyPlatform,
  LoyaltyViewer,
  useLoyaltyStore,
} from "./LoyaltyStore";
import classes from "./LoyaltyPage.module.css";

const PLATFORM_LABEL_KEYS: Record<LoyaltyPlatform, string> = {
  [LoyaltyPlatform.TWITCH]: "loyalty-platform-twitch",
  [LoyaltyPlatform.VKLIVE]: "loyalty-platform-vklive",
  [LoyaltyPlatform.KICK]: "loyalty-platform-kick",
};

const PLATFORMS: LoyaltyPlatform[] = [
  LoyaltyPlatform.TWITCH,
  LoyaltyPlatform.VKLIVE,
  LoyaltyPlatform.KICK,
];

export const LoyaltyViewersTab = observer(() => {
  const { t } = useTranslation();
  const { store } = useLoyaltyStore();
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<LoyaltyPlatform | undefined>();

  const query = search.trim().toLowerCase();
  const viewers = store.viewers.filter((viewer) => {
    const matchesNickname =
      query === "" || viewer.nickname.toLowerCase().includes(query);
    const matchesPlatform = platform === undefined || viewer.platform === platform;
    return matchesNickname && matchesPlatform;
  });

  const columns: TableColumnsType<LoyaltyViewer> = [
    {
      title: t("loyalty-column-nickname"),
      dataIndex: "nickname",
      key: "nickname",
      sorter: (a, b) => a.nickname.localeCompare(b.nickname),
    },
    {
      title: t("loyalty-column-platform"),
      dataIndex: "platform",
      key: "platform",
      render: (value: LoyaltyPlatform) => t(PLATFORM_LABEL_KEYS[value]),
    },
    {
      title: t("loyalty-column-points"),
      dataIndex: "points",
      key: "points",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.points - b.points,
    },
  ];

  return (
    <Flex vertical gap={12} className={`${classes.tabcontainer}`}>
      <Flex gap={9} wrap>
        <Input.Search
          allowClear
          placeholder={t("loyalty-search-placeholder")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={`${classes.search}`}
        />
        <Select
          allowClear
          placeholder={t("loyalty-filter-platform")}
          value={platform}
          onChange={(value) => setPlatform(value)}
          className={`${classes.platformfilter}`}
          options={PLATFORMS.map((item) => ({
            value: item,
            label: t(PLATFORM_LABEL_KEYS[item]),
          }))}
        />
      </Flex>
      <Table<LoyaltyViewer>
        rowKey="id"
        columns={columns}
        dataSource={viewers}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
      />
    </Flex>
  );
});
