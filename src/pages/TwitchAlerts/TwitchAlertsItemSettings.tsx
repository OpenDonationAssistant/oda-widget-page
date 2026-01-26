import { observer } from "mobx-react-lite";
import {
  TWITCH_ALERT_TRIGGERS,
  TwitchAlertAudioFile,
  TwitchAlert,
  TwitchAlertAudioTTS,
} from "./types";
import { Trans, useTranslation } from "react-i18next";
import { useContext, useEffect, useRef, useState } from "react";
import { PresetStoreContext } from "../../stores/PresetStore";
import { Flex, Input, Select, Slider, Tabs } from "antd";
import classes from "./TwitchAlertsItemSettings.module.css";
import { EditableString } from "../../components/RenamableLabel/EditableString";
import {
  CloseOverlayButton,
  ModalState,
  ModalStateContext,
} from "../../components/Overlay/Overlay";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { CollapseLikeUploadButton } from "../../components/Button/CollapseLikeButton";
import SubActionButton from "../../components/Button/SubActionButton";
import { PresetsComponent } from "../../components/ConfigurationPage/PresetsComponent";
import { ResizableBox } from "react-resizable";
import { SaveButtons } from "../../components/Button/SaveButtons";
import { handleFileUpload, loadAudio } from "../../utils";
import SmallLabeledContainer from "../../components/SmallLabeledContainer/SmallLabeledContainer";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import { AddListItemButton } from "../../components/List/List";
import { ElementsTab } from "../../components/Element/ElementsTab";
import { ElementFactory } from "../../components/Element/ElementFactory";
import {
  DemoTwitchAlertsStore,
  AlertsStore,
} from "../../stores/alerts/TwitchAlertsStore";
import { log } from "../../logging";
import { TwitchAlertsWidget } from "./TwitchAlertsWidget";
import SecondaryButton from "../../components/Button/SecondaryButton";
import { CatalogBrowse } from "../../stores/catalog/CatalogBrowseComponent";
import AddIcon from "../../icons/AddIcon";
import RunIcon from "../../icons/RunIcon";
import { TriggersStoreContext } from "../../stores/triggers/TriggersStore";
import { UNKNOWN_TRIGGER } from "../../stores/triggers/UnknownTrigger";

function play(buffer: ArrayBuffer | null) {
  if (!buffer) {
    return Promise.resolve();
  }
  const audioCtx = new AudioContext();
  return new Promise<void>((resolve) => {
    audioCtx.decodeAudioData(
      buffer,
      (buf) => {
        const gainNode = audioCtx.createGain();
        gainNode.connect(audioCtx.destination);

        let source = audioCtx.createBufferSource();
        source.connect(gainNode);
        source.buffer = buf;
        source.loop = false;
        source.start(0);
        source.addEventListener("ended", () => {
          resolve();
        });
      },
      (err) => {
        console.log(err);
      },
    );
  });
}

const GeneralTab = observer(({ alert }: { alert: TwitchAlert }) => {
  const factory = useContext(TriggersStoreContext);

  return (
    <Flex vertical gap={6} className={`${classes.tabcontainer}`}>
      <div style={{ fontSize: "21px" }}>Срабатывает когда</div>
      {alert.data.triggers
        .map((trigger) => factory.loadTrigger(trigger))
        .map((trigger, index) => (
          <>
            <Flex key={index} align="center" gap={6}>
              <Select
                value={trigger.type}
                className="full-width"
                onChange={(e) => {
                  alert.data.triggers[index] = factory.createTrigger(e);
                }}
                options={[
                  ...factory.available([
                    ...alert.data.triggers.slice(0, index),
                    ...alert.data.triggers.slice(index + 1),
                  ]),
                  ...[factory.getType(trigger.type) ?? UNKNOWN_TRIGGER],
                ].map((option) => {
                  return {
                    value: option.type,
                    label: <Trans i18nKey={option.description} />,
                  };
                })}
              />
              <NotBorderedIconButton
                onClick={() => alert.data.triggers.splice(index, 1)}
                className={`${classes.deletetriggerbutton}`}
              >
                <CloseIcon color="#FF8888" />
              </NotBorderedIconButton>
            </Flex>
            <Flex className="full-width">{trigger.markup()}</Flex>
          </>
        ))}
      {factory.available(alert.data.triggers).length > 0 && (
        <AddListItemButton
          label="Добавить условие"
          onClick={() => {
            alert.data.triggers.push(
              factory.createTrigger(TWITCH_ALERT_TRIGGERS[0]),
            );
          }}
        />
      )}
    </Flex>
  );
});

const AudioCatalog = ({
  line,
}: {
  line: (TwitchAlertAudioFile | TwitchAlertAudioTTS)[];
}) => {
  const parentModalState = useContext(ModalStateContext);
  const [modalState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  return (
    <ModalStateContext.Provider value={modalState}>
      <CatalogBrowse
        category="audio-notification"
        onChange={(item) => {
          line.push({
            delay: 0,
            type: "file",
            volume: 50,
            url: item.url,
            name: item.name,
          });
        }}
      />
      <SecondaryButton
        onClick={() => {
          modalState.show = true;
        }}
      >
        <span className="material-symbols-sharp">folder</span>
        <Trans i18nKey="button-browse" />
      </SecondaryButton>
    </ModalStateContext.Provider>
  );
};

const AudioTab = observer(({ alert }: { alert: TwitchAlert }) => {
  const firstLineLength = alert.data.audio.at(0)?.length ?? 0;

  return (
    <Flex vertical className={`${classes.tabcontainer}`} gap={27}>
      {alert.data.audio.map((line, index) => (
        <Flex vertical gap={6} className="full-width">
          {alert.data.audio.length > 1 && (
            <Flex justify="space-between" align="center">
              <div style={{ fontSize: "24px" }}>Дорожка {index + 1}</div>
              <SubActionButton
                onClick={() => alert.data.audio.splice(index, 1)}
              >
                <CloseIcon color="#FF8888" />
                Удалить
              </SubActionButton>
            </Flex>
          )}
          {line.map((audio, index) => (
            <Flex vertical className={`${classes.audiocontainer}`} gap={9}>
              {audio.type === "file" && (
                <Flex
                  align="center"
                  gap={6}
                  className={`${classes.filenamecontainer}`}
                >
                  <div className={`${classes.filename}`}>
                    {(audio as TwitchAlertAudioFile).name}
                  </div>
                  <SubActionButton
                    onClick={() => {
                      loadAudio(audio.url).then((buffer) => {
                        if (buffer) {
                          play(buffer);
                        }
                      });
                    }}
                  >
                    <Flex align="center" gap={3}>
                      <RunIcon />
                      <div>Воспроизвести</div>
                    </Flex>
                  </SubActionButton>
                  <BorderedIconButton
                    onClick={() => {
                      line.splice(index, 1);
                    }}
                  >
                    <CloseIcon color="#FF8888" />
                  </BorderedIconButton>
                </Flex>
              )}
              {audio.type === "tts" && (
                <>
                  <Flex
                    align="center"
                    gap={6}
                    className={`${classes.filenamecontainer}`}
                  >
                    <div className={`${classes.filename}`}>{audio.name}</div>
                    <SubActionButton onClick={() => {}}>
                      <Flex align="center" gap={3}>
                        <RunIcon />
                        <div>Воспроизвести</div>
                      </Flex>
                    </SubActionButton>
                    <BorderedIconButton
                      onClick={() => {
                        line.splice(index, 1);
                      }}
                    >
                      <CloseIcon color="#FF8888" />
                    </BorderedIconButton>
                  </Flex>
                  <Flex className="full-width" vertical gap={3}>
                    <SmallLabeledContainer displayName="Фразы">
                      <Flex vertical className="full-width" gap={3}>
                        {audio.templates?.map((template, index) => (
                          <Flex
                            gap={3}
                            align="center"
                            className={`full-width ${classes.speechcontainer}`}
                          >
                            <Input
                              style={{ height: "28px", border: "none" }}
                              value={template}
                              onChange={(e) => {
                                audio.templates?.splice(
                                  index,
                                  1,
                                  e.target.value,
                                );
                              }}
                            />
                            <NotBorderedIconButton
                              onClick={() => {
                                audio.templates?.splice(index, 1);
                              }}
                            >
                              <CloseIcon color="#FF8888" />
                            </NotBorderedIconButton>
                          </Flex>
                        ))}
                        <Flex
                          align="center"
                          justify="flex-end"
                          className="full-width"
                          gap={3}
                        >
                          <SubActionButton
                            onClick={() => {
                              audio.templates?.push("");
                            }}
                          >
                            <Flex align="center" gap={3}>
                              <AddIcon color="var(--oda-color-950)" />
                              <div>Добавить фразу</div>
                            </Flex>
                          </SubActionButton>
                        </Flex>
                      </Flex>
                    </SmallLabeledContainer>
                  </Flex>
                </>
              )}
              <Flex gap={6}>
                <SmallLabeledContainer displayName="Задержка">
                  <InputNumber
                    value={audio.delay}
                    addon={"мс"}
                    onChange={(newValue) => {
                      if (newValue === null) {
                        return;
                      }
                      audio.delay = newValue;
                    }}
                  />
                </SmallLabeledContainer>
                <SmallLabeledContainer displayName="Громкость">
                  <Slider
                    min={1}
                    max={100}
                    defaultValue={50}
                    value={audio.volume}
                    onChange={(value: number) => (audio.volume = value)}
                  />
                </SmallLabeledContainer>
              </Flex>
            </Flex>
          ))}
          <Flex gap={9} align="center">
            <AddListItemButton
              label="Добавить озвучку"
              onClick={() => {
                line.push({
                  delay: 0,
                  name: "Озвучка",
                  type: "tts",
                  volume: 50,
                  templates: [],
                });
              }}
            />
            <CollapseLikeUploadButton
              onClick={(e) => {
                handleFileUpload(e).then((result) => {
                  if (result) {
                    line.push({
                      delay: 0,
                      type: "file",
                      volume: 50,
                      url: result.url,
                      name: result.originalName,
                    });
                  }
                });
              }}
            >
              <Flex align="center">
                <AddIcon color="var(--oda-primary-color)" />
                <div>Добавить аудиофайл</div>
              </Flex>
            </CollapseLikeUploadButton>
            <AudioCatalog line={line} />
          </Flex>
        </Flex>
      ))}
      {alert.data.audio.length === 1 && (
        <Flex vertical className="full-width" gap={9}>
          <div className={`${classes.note}`}>
            Добавленные аудио в одной дорожке будут играть последовательно, одно
            за другим.
          </div>
          <div className={`${classes.note}`}>
            Добавленные аудио в разных дорожках будут играть параллельно
          </div>
        </Flex>
      )}
      {firstLineLength > 0 && (
        <Flex gap={9}>
          <AddListItemButton
            label="Добавить дорожку"
            onClick={() => {
              alert.data.audio.push([]);
            }}
          />
        </Flex>
      )}
    </Flex>
  );
});

export const ItemContent = observer(({ alert }: { alert: TwitchAlert }) => {
  const { t } = useTranslation();
  const preview = useRef<HTMLElement | null>(null);
  const presetStore = useContext(PresetStoreContext);
  const [alertStore, setAlertStore] = useState<AlertsStore | null>(null);

  const elements = alert.elements;

  useEffect(() => {
    const store = new DemoTwitchAlertsStore(alert);
    setAlertStore(store);
    return () => {
      log.debug("Stop demo twich store");
      store.stop();
    };
  }, [alert]);

  return (
    <Flex vertical style={{ height: "100%" }} gap={12}>
      <Flex
        justify="space-between"
        className={`${classes.alerttitle}`}
        align="top"
      >
        <EditableString
          label={alert.data.name}
          onChange={(value) => {
            alert.data.name = value;
          }}
        />
        <CloseOverlayButton />
      </Flex>
      <Flex
        style={{ height: "96vh", maxHeight: "calc(100vh - 100px)" }}
        gap={6}
      >
        <Flex
          vertical
          className={`${classes.contentpanel} ${classes.settingspanel} withscroll`}
        >
          <Tabs
            size="small"
            type="card"
            tabPosition="top"
            items={[
              {
                key: "general",
                label: t("General"),
                children: [<GeneralTab alert={alert} />],
              },
              {
                key: "visual",
                label: "Отображение",
                children: [
                  <ElementsTab
                    alert={alert}
                    elements={elements}
                    available={ElementFactory.list()}
                  />,
                ],
              },
              {
                key: "audio",
                label: "Аудио",
                children: [<AudioTab alert={alert} />],
              },
            ]}
          />
        </Flex>
        <Flex vertical gap={9} className={`${classes.contentpanel}`}>
          <Flex justify="flex-start" gap={9}>
            <SubActionButton onClick={() => {}}>Создать шаблон</SubActionButton>
            <PresetsComponent target={alert.data} presetStore={presetStore} />
          </Flex>
          <Flex
            ref={preview}
            justify="space-around"
            className={`${classes.preview}`}
          >
            <ResizableBox
              height={-1}
              width={-1}
              className={`${classes.resizable}`}
              axis="both"
              minConstraints={[400, 100]}
            >
              {alertStore && <TwitchAlertsWidget store={alertStore} />}
            </ResizableBox>
          </Flex>
          <SaveButtons />
        </Flex>
      </Flex>
    </Flex>
  );
});
