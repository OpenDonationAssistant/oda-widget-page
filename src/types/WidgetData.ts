export interface WidgetData {
  recipientId: string;
  settings: any;
  conf: any;
  widgetId: string;
  features: {
    name: string;
    state: "ENABLED" | "DISABLED";
  }[];
}
