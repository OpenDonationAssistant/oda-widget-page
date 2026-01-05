import { observer } from "mobx-react-lite";
import { ElementData } from "../Element";
import { ProgressElementSettings } from "./ProgressElement";
import { ColorPropertyComponent } from "../../ConfigurationPage/widgetproperties/ColorPropertyComponent";
import { ImagePropertyComponent } from "../../ConfigurationPage/widgetproperties/BackgroundImageProperty";
import { HeightPropertyComponent } from "../../ConfigurationPage/widgetproperties/HeightProperty";
import { BorderPropertyComponent } from "../../ConfigurationPage/widgetproperties/BorderProperty";
import { PaddingPropertyComponent } from "../../ConfigurationPage/widgetproperties/PaddingProperty";
import { RoundingPropertyComponent } from "../../ConfigurationPage/widgetproperties/RoundingProperty";
import { BoxShadowPropertyComponent } from "../../ConfigurationPage/widgetproperties/BoxShadowProperty";
import classes from "./ProgressElementSettingsComponent.module.css";

const OuterProperties = observer(
  ({ data }: { data: ElementData<ProgressElementSettings> }) => {
    return (
      <>
        <ColorPropertyComponent
          property={{
            value: data.settings.backgroundColor,
            displayName: "Фон",
          }}
          onChange={(updated) => (data.settings.backgroundColor = updated)}
        />
        <ImagePropertyComponent
          displayName="Фоновое изображение"
          value={data.settings.outerImage}
        />
        <HeightPropertyComponent property={data.settings.outerHeight} />
        <BorderPropertyComponent
          help="Рамка"
          value={data.settings.outerBorder}
          displayName="Граница"
        />
        <PaddingPropertyComponent
          displayName="Отступ"
          value={data.settings.barPadding}
        />
        <RoundingPropertyComponent
          displayName="Скругление"
          value={data.settings.outerRounding}
        />
        <BoxShadowPropertyComponent
          displayName="Тени"
          value={data.settings.outerBoxShadow}
          buttonClassName={classes.addshadowbutton}
        />
      </>
    );
  },
);

const InnerProperties = observer(
  ({ data }: { data: ElementData<ProgressElementSettings> }) => {
    return (
      <>
        <ColorPropertyComponent
          property={{
            value: data.settings.filledColor,
            displayName: "Фон",
          }}
          onChange={(updated) => (data.settings.filledColor = updated)}
        />
        <ImagePropertyComponent
          displayName="Фоновое изображение"
          value={data.settings.innerImage}
        />
        <HeightPropertyComponent property={data.settings.filledHeight} />
        <BorderPropertyComponent
          help="Рамка"
          value={data.settings.innerBorder}
          displayName="Граница"
        />
        <PaddingPropertyComponent
          displayName="Отступ"
          value={data.settings.innerPadding}
        />
        <RoundingPropertyComponent
          displayName="Скругление"
          value={data.settings.innerRounding}
        />
        <BoxShadowPropertyComponent
          displayName="Тени"
          value={data.settings.innerBoxShadow}
          buttonClassName={classes.addshadowbutton}
        />
      </>
    );
  },
);

export const ProgressElementSettingsComponent = ({
  data,
}: {
  data: ElementData<ProgressElementSettings>;
}) => {
  return <>
    <OuterProperties data={data} />
    <InnerProperties data={data} />
  </>;
};
