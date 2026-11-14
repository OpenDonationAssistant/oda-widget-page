import { Flex } from "antd";
import { useRequest } from "ahooks";
import { useAuth } from "../../contexts/AuthContext";
import {
  getWarnings,
  clearWarnings,
} from "@opendonationassistant/news-service";
import classes from "./WarningsPanel.module.css";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { useTranslation } from "react-i18next";

interface Warning {
  message: string;
}

export default function WarningsPanel() {
  const { t } = useTranslation();
  const { accessToken } = useAuth();

  const { data, refresh } = useRequest<Warning[], any>(
    async () => {
      const response = await getWarnings({
        baseURL: process.env.REACT_APP_NEWS_API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        query: {
          priority: "warning",
        },
      });
      return response.data ?? [];
    },
    {
      ready: !!accessToken,
      pollingInterval: 5000,
    },
  );

  const warnings = data ?? [];

  if (warnings.length === 0) return null;

  return (
    <Flex vertical gap={3} className={classes.container}>
      {warnings.map((warning, index) => (
        <Flex align="center" key={index} className={classes.row}>
          <div className={classes.line}>
            <span>{t("common-warning")}</span>: {warning.message}
          </div>
          <NotBorderedIconButton
            onClick={() => {
              clearWarnings({
                baseURL: process.env.REACT_APP_NEWS_API_ENDPOINT,
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                body: {},
              }).then(() => refresh());
            }}
            title={t("warnings-clear-all")}
          >
            <CloseIcon color="white" />
          </NotBorderedIconButton>
        </Flex>
      ))}
    </Flex>
  );
}
