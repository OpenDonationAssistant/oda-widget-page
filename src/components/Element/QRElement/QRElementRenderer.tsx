import { observer } from "mobx-react-lite";
import { QRElementSettings } from "./QRElement";
import { QRCode } from "antd";

export const QRElementRenderer = observer(
  ({ settings }: { settings: QRElementSettings }) => {
    return (
      <QRCode
        size={settings.size}
        value={settings.text}
        color={settings.color}
      />
    );
  },
);
