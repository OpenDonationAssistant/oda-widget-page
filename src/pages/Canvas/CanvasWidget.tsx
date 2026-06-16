import { CSSProperties, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import classes from "./CanvasWidget.module.css";
import { CanvasWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/canvas/CanvasWidgetSettings";
import { TextRenderer } from "../../components/Renderer/TextRenderer";

export const CanvasWidget = observer(
  ({ settings }: { settings: CanvasWidgetSettings }) => {
    const [style, setStyle] = useState<CSSProperties>({});

    useEffect(() => {
      settings.backgroundImageProperty.calcCss().then((css) => {
        setStyle({
          ...settings.borderProperty.calcCss(),
          ...settings.backgroundColorProperty.calcCss(),
          ...settings.paddingProperty.calcCss(),
          ...settings.roundingProperty.calcCss(),
          ...settings.shadowProperty.calcCss(),
          ...css,
        });
      });
    }, [
      settings.backgroundImageProperty.value,
      settings.borderProperty.value,
      settings.paddingProperty.value,
      settings.roundingProperty.value,
      settings.shadowProperty.value,
    ]);

    return <></>;
  },
);
