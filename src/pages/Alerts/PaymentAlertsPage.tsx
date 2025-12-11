import PaymentAlerts from "./PaymentAlerts";
import WidgetWrapper from "../../WidgetWrapper";
import { AlertController } from "./AlertController";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { PaymentAlertsWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";
import { subscribe } from "../../socket";
import { log } from "../../logging";
import { DefaultTokenStore } from "../../stores/TokenStore";
import { PaymentPageConfig } from "../../components/MediaWidget/PaymentPageConfig";

export default function PaymentAlertsPage() {
  const { conf, widgetId, recipientId, settings } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as PaymentAlertsWidgetSettings;

  const pageConfig = new PaymentPageConfig(recipientId);
  const alertController = new AlertController(
    widgetSettings,
    recipientId,
    pageConfig.displayName,
  );
  alertController.listen(widgetId, conf);

  const tokenStore = new DefaultTokenStore();

  subscribe(widgetId, conf.topic.alertWidgetCommans, (message) => {
    log.info({ command: message.body }, `Received alert command`);
    let json = JSON.parse(message.body);
    if (json.command === "interrupt") {
      alertController.interrupt();
    }
    message.ack();
  });

  return (
    <WidgetWrapper>
      <PaymentAlerts
        alertController={alertController}
        tokenStore={tokenStore}
      />
    </WidgetWrapper>
  );
}
