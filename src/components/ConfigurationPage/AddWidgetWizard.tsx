import { Flex } from "antd";
import { observer } from "mobx-react-lite";
import classes from "./AddWidgetWizard.module.css";
import { WIDGET_TYPES } from "../../types/Widget";
import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardList } from "../Cards/CardsComponent";
import { makeAutoObservable } from "mobx";
import { PresetWindow } from "./PresetsComponent";
import { Preset } from "../../types/Preset";
import {
  SelectedIndexContext,
  SelectedIndexStore,
} from "../../stores/SelectedIndexStore";
import { log } from "../../logging";

export class AddWidgetWizardStore {
  private _type: string | null = null;
  private _preset: Preset | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get type(): string | null {
    return this._type;
  }

  public set type(value: string | null) {
    this._type = value;
  }

  public get preset(): Preset | null {
    return this._preset;
  }

  public set preset(value: Preset | null) {
    this._preset = value;
  }

  public reset() {
    this._type = null;
    this._preset = null;
  }
}

export const AddWidgetWizardStoreContext = createContext(
  new AddWidgetWizardStore(),
);

const WidgetPreviewComponent = observer(
  ({
    widget,
  }: {
    widget: { title: string; description: string; preview: string };
  }) => {
    const { t } = useTranslation();

    return (
      <Flex vertical gap={9}>
        <div className={`${classes.widgetpreviewtitle}`}>{t(widget.title)}</div>
        <div className={`${classes.widgetpreviewdescription}`}>
          {t(widget.description)}
        </div>
      </Flex>
    );
  },
);

const NewWidgetSection = observer(({ category }: { category: string }) => {
  const wizardStore = useContext(AddWidgetWizardStoreContext);

  return (
    <CardList>
      {WIDGET_TYPES.filter((type) => type.category === category).map((type) => (
        <Card
          selected={wizardStore.type === type.name}
          onClick={() => {
            wizardStore.type =
              wizardStore.type === type.name ? null : type.name;
          }}
        >
          <WidgetPreviewComponent widget={type} />
        </Card>
      ))}
    </CardList>
  );
});

export const SelectWidgetComponent = () => {
  return (
    <Flex
      vertical
      gap={12}
      className="withscroll"
      style={{ maxHeight: "75vh" }}
    >
      <div className={`${classes.section}`}>Для стрима</div>
      <NewWidgetSection category="onscreen" />
      <div className={`${classes.section}`}>Медиа</div>
      <NewWidgetSection category="media" />
      <div className={`${classes.section}`}>Инструменты стримера</div>
      <NewWidgetSection category="internal" />
    </Flex>
  );
};

export const SelectPresetComponent = observer(() => {
  const wizardStore = useContext(AddWidgetWizardStoreContext);
  const [selection] = useState<SelectedIndexStore>(
    () => new SelectedIndexStore(),
  );

  return (
    <SelectedIndexContext.Provider value={selection}>
      <Flex
        vertical
        gap={12}
        className="withscroll"
        style={{ maxHeight: "75vh", width: "100%" }}
      >
        {wizardStore.type && (
          <PresetWindow
            type={wizardStore.type}
            onSelect={(preset: Preset) => {
              if (selection.id === preset.name) {
                selection.id = null;
                wizardStore.preset = null;
                return;
              } else {
                selection.id = preset.name;
                wizardStore.preset = preset;
                log.debug(
                  { selection: selection.id, inStore: wizardStore.preset.name },
                  "selected preset",
                );
              }
            }}
          />
        )}
      </Flex>
    </SelectedIndexContext.Provider>
  );
});
