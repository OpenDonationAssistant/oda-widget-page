import WidgetWrapper from "../../WidgetWrapper";
import { CustomWidget } from "./CustomWidget";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { Widget } from "../../types/Widget";
import { CustomWidgetSettings } from "./CustomWidgetSettings";
import { DefaultCustomWidgetStore } from "./CustomWidgetStore";

export default function CustomWidgetPage() {
  const navigate = useNavigate();
  const { recipientId, settings, conf, widgetId } =
    useLoaderData() as WidgetData;

  const widgetSettings = Widget.configFromJson(
    settings,
  ) as CustomWidgetSettings;
  const store = new DefaultCustomWidgetStore({
    settings: widgetSettings,
    widgetId,
    recipientId,
    reloadFn: () => navigate(0),
  });

  return (
    <WidgetWrapper>
      <CustomWidget
        settings={Widget.configFromJson(settings) as CustomWidgetSettings}
        store={store}
      />
    </WidgetWrapper>
  );
}
