import PaymentAlerts from "./PaymentAlerts";
import WidgetWrapper from "../../WidgetWrapper";
import { AlertController } from "./AlertController";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { PaymentAlertsWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/alerts/PaymentAlertsWidgetSettings";

export default function PaymentAlertsPage({}) {
  const { recipientId, settings } = useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as PaymentAlertsWidgetSettings;

  const alertController = new AlertController(widgetSettings, recipientId);
  return (
    <WidgetWrapper>
      <PaymentAlerts alertController={alertController} />
    </WidgetWrapper>
  );
}
