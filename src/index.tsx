import React from "react";
import ReactDOM from "react-dom/client";
import Payments from "./components/Payments/Payments";
import PlayerInfo from "./components/PlayerInfo/PlayerInfo";
import PaymentAlerts from "./components/PaymentAlerts/PaymentAlerts";
import MediaWidget from "./components/MediaWidget/MediaWidget";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import PlayerControl from "./components/PlayerControl/PlayerControl";
import DonatersTopList from "./components/DonatersTopList/DonatersTopList";
import ConfigurationPage from "./components/ConfigurationPage/ConfigurationPage";
import "./index.css";
import { config } from "./config";
import { log, setLoglevel } from "./logging";
import auth from "./auth";
import axios from "axios";
import Login from "./components/Login/Login";
import DonationTimer from "./components/DonationTimer/DonationTimer";
import type { Params } from "react-router-dom";
import PaymentPageConfigComponent from "./components/PaymentPageConfig/PaymentPageConfigComponent";
import PaymentGatewaysConfiguration from "./pages/PaymentGatewaysConfiguration/PaymentGatewaysConfiguration";
import PlayerPopup from "./components/PlayerPopup/PlayerPopup";
import ReelWidget from "./pages/Reel/ReelWidget";
import { WidgetData } from "./types/WidgetData";
import DonationGoal from "./components/DonationGoal/DonationGoal";
import HistoryPage from "./pages/History/HistoryPage";
import { ConfigProvider, theme } from "antd";
import "./i18n";
import 'animate.css';

async function widgetSettingsLoader({
  params,
}: {
  params: Params<"widgetId">;
}): Promise<WidgetData> {
  const recipientId = await auth();
  log.debug(`loading settings for ${recipientId}`);
  let settings = {};
  if (params.widgetId) {
    settings = await axios
      .get(
        `${process.env.REACT_APP_WIDGET_API_ENDPOINT}/widgets/${params.widgetId}`,
      )
      .then((json) => {
        return json.data;
      });
  }

  const conf = await config(recipientId);
  setLoglevel(conf.loglevel);
  log.debug(`Configuration: ${JSON.stringify(conf)}`);
  const widgetId = params.widgetId ?? "unknown";

  return { recipientId, settings, conf, widgetId };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/configuration/widgets" />,
  },
  {
    path: "/configuration/news",
    element: <ConfigurationPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/configuration/widgets",
    element: <ConfigurationPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/configuration/gateways",
    element: <PaymentGatewaysConfiguration />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/configuration/payment-page",
    element: <PaymentPageConfigComponent />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/configuration/history-page",
    element: <HistoryPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/payment-alerts/:widgetId",
    element: <PaymentAlerts />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/media/:widgetId",
    element: <MediaWidget />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/payments/:widgetId",
    element: <Payments />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/player-info/:widgetId",
    element: <PlayerInfo />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/player-popup/:widgetId",
    element: <PlayerPopup />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/player-control/:widgetId",
    element: <PlayerControl />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/donaters-top-list/:widgetId",
    element: <DonatersTopList />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/reel/:widgetId",
    element: <ReelWidget />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/donation-timer/:widgetId",
    element: <DonationTimer />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/donationgoal/:widgetId",
    element: <DonationGoal />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 8,
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>,
  );
}
