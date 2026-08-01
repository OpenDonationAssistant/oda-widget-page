import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import WidgetWrapper from "../../WidgetWrapper";
import { HistoryComponent } from "./HistoryPage";
import { useState } from "react";
import {
  DefaultHistoryStore,
  HistoryStore,
  HistoryStoreContext,
} from "./HistoryStore";
import {
  DefaultWidgetStore,
  WidgetStore,
  WidgetStoreContext,
} from "../../stores/WidgetStore";

export default function HistoryWidgetPage() {
  const { recipientId, conf, widgetId } = useLoaderData() as WidgetData;
  const [store] = useState<HistoryStore>(
    () => new DefaultHistoryStore(recipientId, widgetId, conf),
  );
  const [widgetStore] = useState<WidgetStore>(() => new DefaultWidgetStore());

  return (
    <WidgetWrapper>
      <style
        dangerouslySetInnerHTML={{
          __html: `#root {overflow: auto; background-color: var(--oda-color-100);}`,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `@media(min-width: 450px){#root {padding: 12px 15px;}`,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `@media(max-width: 450px){#root {padding: 6px 3px;}`,
        }}
      />
      <WidgetStoreContext.Provider value={widgetStore}>
        <HistoryStoreContext.Provider value={store}>
          <HistoryComponent showHeader={false} />
        </HistoryStoreContext.Provider>
      </WidgetStoreContext.Provider>
    </WidgetWrapper>
  );
}
