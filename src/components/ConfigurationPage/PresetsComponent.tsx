import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Subtitle,
  Title,
} from "../Overlay/Overlay";
import { log } from "../../logging";
import { Flex, Spin } from "antd";
import classes from "./PresetsComponent.module.css";
import { observer } from "mobx-react-lite";
import { PresetStore, PresetStoreContext } from "../../stores/PresetStore";
import { Preset } from "../../types/Preset";
import { Widget } from "../../types/Widget";
import { Card, CardList } from "../Cards/CardsComponent";
import { fullUri } from "../../utils";
import SubActionButton from "../SubActionButton/SubActionButton";
import {
  SelectedIndexContext,
  SelectedIndexStore,
} from "../../stores/SelectedIndexStore";
import SecondaryButton from "../SecondaryButton/SecondaryButton";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

const PreviewImage = observer(({
  preset,
  onSelect,
}: {
  preset: Preset;
  onSelect: () => void;
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const selection = useContext(SelectedIndexContext);

  useEffect(() => {
    fullUri(preset.showcase).then((image) => setUrl(image));
  }, [preset]);

  return (
    <Card
      className={`${classes.previewcard}`}
      selected={selection.id === preset.name}
      onClick={() => {
        onSelect();
      }}
    >
      {url && (
        <img src={url} style={{ overflow: "auto", borderRadius: "9px" }} />
      )}
      {!url && <Spin size="large" />}
    </Card>
  );
});

// const Window = ({ children }: { children: ReactNode }) => {
//   const state = useContext(ModalStateContext);
//   const backRef = useRef<HTMLDivElement | null>(null);
//
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (!event.target) {
//         return;
//       }
//       log.debug(
//         {
//           show: state.show,
//           current: backRef.current,
//           misses: backRef.current?.contains(event.target as Node),
//           target: event.target,
//         },
//         "handling click outside",
//       );
//       if (event.target === backRef.current && state.show) {
//         log.debug("closing modal panel");
//         state.onClose();
//         state.show = false;
//         event.stopPropagation();
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [state.show]);
//
//   return (
//     <Flex className={`${classes.modal}`} justify="flex-start" vertical>
//       {children}
//     </Flex>
//   );
// };

export const PresetWindow = ({
  type,
  onSelect,
}: {
  type: string;
  onSelect: (preset: Preset) => void;
}) => {
  const [personal, setPersonal] = useState<Preset[]>([]);
  const [system, setSystem] = useState<Preset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const presetStore = useContext(PresetStoreContext);

  useEffect(() => {
    setLoading(true);
    presetStore.for(type).then((presets) => {
      setPersonal(presets.filter((preset) => preset.owner !== "ODA"));
      setSystem(presets.filter((preset) => preset.owner === "ODA"));
      setLoading(false);
    });
  }, [presetStore, type]);

  return (
    <>
      {loading && (
        <Flex className="full-width" justify="center" align="center">
          <Spin size="large" />
        </Flex>
      )}
      {personal && personal.length > 0 && (
        <Flex vertical className={`${classes.cardlistcontainer}`}>
          <Subtitle className={`${classes.presetsubtitle}`}>
            Ваши шаблоны
          </Subtitle>
          <CardList>
            {personal.map((preset) => (
              <PreviewImage preset={preset} onSelect={() => onSelect(preset)} />
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
              <PreviewImage preset={preset} onSelect={() => onSelect(preset)} />
            ))}
          </CardList>
        </Flex>
      )}
    </>
  );
};

export const PresetsComponent = observer(
  ({ widget }: { presetStore: PresetStore; widget: Widget }) => {
    const parentModalState = useContext(ModalStateContext);
    const [modalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const [selected, setSelected] = useState<Preset | null>(null);
    const [selection, setSelection] = useState<SelectedIndexStore>(
      () => new SelectedIndexStore(),
    );

    return (
      <SelectedIndexContext.Provider value={selection}>
        <ModalStateContext.Provider value={modalState}>
          <Overlay>
            <Panel>
              <Title>Шаблоны</Title>
              <Flex
                vertical
                className={`${classes.presetcontainer} withscroll`}
              >
                <PresetWindow
                  type={widget.type}
                  onSelect={(preset: Preset) => {
                    selection.id = preset.name;
                    setSelected(preset);
                  }}
                />
              </Flex>
              <Flex gap={9} className={`${classes.buttons}`} justify="flex-end">
                <SecondaryButton
                  onClick={() => {
                    modalState.show = false;
                  }}
                >
                  Отменить
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    selected?.applyTo(widget.config, widget.type);
                    modalState.show = false;
                  }}
                >
                  Применить
                </PrimaryButton>
              </Flex>
            </Panel>
          </Overlay>
          <SubActionButton
            onClick={() => {
              modalState.show = true;
            }}
          >
            Применить шаблон
          </SubActionButton>
        </ModalStateContext.Provider>
      </SelectedIndexContext.Provider>
    );
  },
);
