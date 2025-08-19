import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import {
  CloseOverlayButton,
  ModalState,
  ModalStateContext,
  Overlay,
  Subtitle,
  Title,
} from "../Overlay/Overlay";
import { log } from "../../logging";
import { Flex, Spin } from "antd";
import classes from "./PresetsComponent.module.css";
import { observer } from "mobx-react-lite";
import { PresetStore } from "../../stores/PresetStore";
import { Preset } from "../../types/Preset";
import { Widget } from "../../types/Widget";
import { Card, CardList } from "../Cards/CardsComponent";
import { fullUri } from "../../utils";
import SubActionButton from "../SubActionButton/SubActionButton";

const PreviewImage = ({
  preset,
  widget,
}: {
  preset: Preset;
  widget: Widget;
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const dialogState = useContext(ModalStateContext);

  useEffect(() => {
    fullUri(preset.showcase).then((image) => setUrl(image));
  }, [preset]);

  return (
    <Card
      className={`${classes.previewcard}`}
      onClick={() => {
        preset.applyTo(widget.config, widget.type);
        dialogState.show = false;
      }}
    >
      {url && (
        <img src={url} style={{ overflow: "auto", borderRadius: "9px" }} />
      )}
      {!url && <Spin size="large" />}
    </Card>
  );
};

const Window = ({ children }: { children: ReactNode }) => {
  const state = useContext(ModalStateContext);
  const backRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!event.target) {
        return;
      }
      log.debug(
        {
          show: state.show,
          current: backRef.current,
          misses: backRef.current?.contains(event.target as Node),
          target: event.target,
        },
        "handling click outside",
      );
      if (event.target === backRef.current && state.show) {
        log.debug("closing modal panel");
        state.onClose();
        state.show = false;
        event.stopPropagation();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.show]);

  return (
    <Flex className={`${classes.modal}`} justify="flex-start" vertical>
      {children}
    </Flex>
  );
};

export const PresetWindow = ({
  widget,
  presetStore,
}: {
  widget: Widget;
  presetStore: PresetStore;
}) => {
  const [personal, setPersonal] = useState<Preset[]>([]);
  const [system, setSystem] = useState<Preset[]>([]);

  useEffect(() => {
    presetStore.for(widget.type).then((presets) => {
      setPersonal(presets.filter((preset) => preset.owner !== "ODA"));
      setSystem(presets.filter((preset) => preset.owner === "ODA"));
    });
  }, [presetStore, widget]);

  return (
    <Overlay>
      <Window>
        <Flex justify="space-between">
          <Title>Шаблоны</Title>
          <CloseOverlayButton />
        </Flex>
        {personal && personal.length > 0 && (
          <Flex vertical className={`${classes.cardlistcontainer}`}>
            <Subtitle className={`${classes.presetsubtitle}`}>
              Ваши шаблоны
            </Subtitle>
            <CardList>
              {personal.map((preset) => (
                <PreviewImage preset={preset} widget={widget} />
              ))}
            </CardList>
          </Flex>
        )}
        {system && system.length > 0 && (
          <Flex vertical className={`${classes.cardlistcontainer}`}>
            <Subtitle className={`${classes.presetsubtitle}`}>
              Стандартные шаблоны
            </Subtitle>
            <CardList>
              {system.map((preset) => (
                <PreviewImage preset={preset} widget={widget} />
              ))}
            </CardList>
          </Flex>
        )}
      </Window>
    </Overlay>
  );
};

export const PresetsComponent = observer(
  ({ presetStore, widget }: { presetStore: PresetStore; widget: Widget }) => {
    const parentModalState = useContext(ModalStateContext);
    const [modalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    return (
      <>
        <ModalStateContext.Provider value={modalState}>
          <PresetWindow presetStore={presetStore} widget={widget} />
          <SubActionButton
            onClick={() => {
              modalState.show = true;
            }}
          >
            Применить шаблон
          </SubActionButton>
        </ModalStateContext.Provider>
      </>
    );
  },
);
