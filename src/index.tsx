import ReactDOM from "react-dom/client";
import PlayerInfo from "./components/PlayerInfo/PlayerInfo";
import MediaWidget from "./components/MediaWidget/MediaWidget";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { Header as AntHeader, Content } from "antd/es/layout/layout";
import PlayerControl from "./components/PlayerControl/PlayerControl";
import ConfigurationPage from "./components/ConfigurationPage/ConfigurationPage";
import "./index.css";
import "./ant-override.css";
import "./ant.css";
import "@fontsource/material-symbols-sharp";
import "@fontsource/play";
import { config } from "./config";
import { log, setLoglevel } from "./logging";
import auth from "./auth";
import axios from "axios";
import type { Params } from "react-router-dom";
import PaymentGatewaysConfiguration from "./pages/PaymentGatewaysConfiguration/PaymentGatewaysConfiguration";
import ReelWidget from "./pages/Reel/ReelWidget";
import { WidgetData } from "./types/WidgetData";
import HistoryPage from "./pages/History/HistoryPage";
import { Button, ConfigProvider, Flex, Layout, theme } from "antd";
import "./i18n";
import "animate.css";
import WidgetWrapper from "./WidgetWrapper";
import Header from "./components/ConfigurationPage/Header";
import Toolbar, { Page } from "./components/ConfigurationPage/Toolbar";
import DonatonPage from "./pages/Donaton/DonatonPage";
import PaymentPageConfigComponent from "./pages/PaymentPageConfig/PaymentPageConfigComponent";
import DonationTimerPage from "./pages/DonationTimer/DonationTimerPage";
import PlayerPopupPage from "./pages/PlayerPopup/PlayerPopupPage";
import DonationGoalPage from "./pages/DonationGoal/DonationGoalPage";
import EventsPage from "./pages/Events/EventsPage";
import DonatersTopListPage from "./pages/DonatersTopList/DonatersTopListPage";
import RutonyChatPage from "./pages/RutonyChat/RutonyChatPage";
import Login from "./pages/Login/Login";
import PaymentAlertsPage from "./pages/Alerts/PaymentAlertsPage";
import AutomationPage from "./pages/Automation/AutomationPage";
import { GuidesPage } from "./pages/Guides/GuidesPage";
import IntegrationsPage from "./pages/Integrations/IntegrationsPage";

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
  log.debug({ configuration: conf });
  const widgetId = params.widgetId ?? "unknown";

  return { recipientId, settings, conf, widgetId };
}

function detectPage(path: string): Page {
  if (path.endsWith("payment-page")) {
    return Page.PAYMENTPAGE;
  }
  if (path.endsWith("history-page")) {
    return Page.HISTORY;
  }
  if (path.endsWith("automation-page")) {
    return Page.AUTOMATION;
  }
  if (path.endsWith("gateways")) {
    return Page.GATEWAYS;
  }
  if (path.indexOf("guides") > 0) {
    return Page.GUIDES;
  }
  if (path.indexOf("integrations") > 0) {
    return Page.INTEGRATIONS;
  }
  return Page.WIDGETS;
}

function ConfigurationPageTemplate() {
  const location = useLocation();
  const page = detectPage(location.pathname);

  return (
    <>
      <Flex vertical className="newstyle">
        <AntHeader>
          <Header />
        </AntHeader>
        <Flex style={{ paddingTop: "18px" }}>
          <style
            dangerouslySetInnerHTML={{
              __html: `
        body {
          padding-left: 18px;
          padding-right: 18px;
  }`,
            }}
          />
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
    background-color: #2d3436;
    background-image: linear-gradient(345deg, #2d3436 0%, #000000 58%);
    width: 100%;
    height: 100%;
  }`,
            }}
          />
          <Toolbar page={page} />
          <Flex
            style={{ marginLeft: "24px", width: "100%", marginRight: "24px" }}
            className="full-width"
          >
            <Content
              className={`newstyle`}
              style={{
                paddingTop: "15px",
                borderRadius: "16px",
                backgroundColor: "var(--oda-color-100)",
              }}
            >
              <Outlet />
            </Content>
          </Flex>
          <div className="right-space" />
        </Flex>
      </Flex>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/configuration/widgets" />,
  },
  {
    path: "/configuration",
    element: <ConfigurationPageTemplate />,
    loader: widgetSettingsLoader,
    children: [
      {
        path: "widgets",
        element: <ConfigurationPage />,
        loader: widgetSettingsLoader,
      },
      {
        path: "payment-page",
        element: <PaymentPageConfigComponent />,
        loader: widgetSettingsLoader,
      },
      {
        path: "history-page",
        element: <HistoryPage />,
        loader: widgetSettingsLoader,
      },
      {
        path: "automation-page",
        element: <AutomationPage />,
        loader: widgetSettingsLoader,
      },
      {
        path: "guides",
        element: <GuidesPage />,
        loader: widgetSettingsLoader,
      },
      {
        path: "integrations",
        element: <IntegrationsPage />,
        loader: widgetSettingsLoader,
      },
      {
        path: "gateways",
        element: <PaymentGatewaysConfiguration />,
        loader: widgetSettingsLoader,
      },
    ],
  },
  {
    path: "/payment-alerts/:widgetId",
    element: <PaymentAlertsPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/media/:widgetId",
    element: <MediaWidget />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/payments/:widgetId",
    element: <EventsPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/player-info/:widgetId",
    element: (
      <WidgetWrapper>
        <PlayerInfo />
      </WidgetWrapper>
    ),
    loader: widgetSettingsLoader,
  },
  {
    path: "/player-popup/:widgetId",
    element: <PlayerPopupPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/donaton/:widgetId",
    element: <DonatonPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/rutonychat/:widgetId",
    element: <RutonyChatPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/player-control/:widgetId",
    element: <PlayerControl />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/donaters-top-list/:widgetId",
    element: <DonatersTopListPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/reel/:widgetId",
    element: <ReelWidget />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/donation-timer/:widgetId",
    element: <DonationTimerPage />,
    loader: widgetSettingsLoader,
  },
  {
    path: "/donationgoal/:widgetId",
    element: <DonationGoalPage />,
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
        algorithm: theme.darkAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>,
  );
}
