import { observer } from "mobx-react-lite";
import {
  TWITCH_ALERT_TRIGGERS,
  TwitchAlertAudioFile,
  TwitchAlert,
} from "./types";
import { Trans, useTranslation } from "react-i18next";
import { useContext, useRef, useState } from "react";
import { PresetStoreContext } from "../../stores/PresetStore";
import { Flex, Select, Slider, Tabs } from "antd";
import classes from "./TwitchAlertsItemSettings.module.css";
import {
  EditableString,
  SmallEditableString,
} from "../../components/RenamableLabel/EditableString";
import {
  CloseOverlayButton,
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
  Warning,
} from "../../components/Overlay/Overlay";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import CollapseLikeButton, {
  CollapseLikeUploadButton,
} from "../../components/Button/CollapseLikeButton";
import SubActionButton from "../../components/Button/SubActionButton";
import { PresetsComponent } from "../../components/ConfigurationPage/PresetsComponent";
import { ResizableBox } from "react-resizable";
import { SaveButtons } from "../../components/Button/SaveButtons";
import { handleFileUpload, loadAudio } from "../../utils";
import SmallLabeledContainer from "../../components/SmallLabeledContainer/SmallLabeledContainer";
import InputNumber from "../../components/ConfigurationPage/components/InputNumber";
import AddIcon from "../../icons/AddIcon";
import { List, ListItem } from "../../components/List/List";
import { Element, ElementData } from "../../components/Element/Element";
import ArrowUp from "../../icons/ArrowUp";
import ArrowDown from "../../icons/ArrowDown";
import {
  Card,
  CardList,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { log } from "../../logging";
import { DEFAULT_LABEL_ELEMENT_SETTINGS } from "../../components/Element/LabelElement";

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
  return (
    <Flex vertical gap={6} className={`${classes.tabcontainer}`}>
      <div style={{ fontSize: "21px" }}>Срабатывает когда</div>
      {alert.data.triggers.map((trigger, index) => (
        <Flex key={index} align="center" gap={6}>
          <Select
            value={trigger.type}
            className="full-width"
            onChange={(e) => {
              trigger.type = e;
            }}
            options={TWITCH_ALERT_TRIGGERS.map((option) => {
              return {
                value: option,
                label: <Trans i18nKey={option} />,
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
      ))}
      <CollapseLikeButton
        onClick={() => {
          alert.data.triggers.push({
            type: TWITCH_ALERT_TRIGGERS[0],
          });
        }}
      >
        Добавить условие
      </CollapseLikeButton>
    </Flex>
  );
});

const ElementsItemComponent = observer(
  ({ element }: { element: Element<any> }) => {
    const [opened, setOpened] = useState<boolean>(false);
    const parentModalState = useContext(ModalStateContext);
    const [deleteDialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    return (
      <>
        <Flex vertical className={`${classes.element}`}>
          <ListItem
            onClick={() => setOpened(!opened)}
            first={
              <SmallEditableString
                label={element.data.name}
                onChange={(value) => (element.data.name = value)}
              />
            }
            second={
              <Flex align="center" justify="flex-end" gap={3}>
                <ModalStateContext.Provider value={deleteDialogState}>
                  <Overlay>
                    <Warning
                      action={() => {
                        deleteDialogState.show = false;
                        element.delete();
                      }}
                    >
                      Вы точно хотите удалить оповещение?
                    </Warning>
                  </Overlay>
                  <BorderedIconButton
                    onClick={() => (deleteDialogState.show = true)}
                  >
                    <CloseIcon color="#FF8888" />
                  </BorderedIconButton>
                </ModalStateContext.Provider>
                {opened ? <ArrowUp /> : <ArrowDown />}
              </Flex>
            }
          />
          {opened && (
            <div className={`${classes.elementsettings}`}>
              {element.markup()}
            </div>
          )}
        </Flex>
      </>
    );
  },
);

const ElementsTab = observer(({ alert }: { alert: TwitchAlert }) => {
  const parentModalState = useContext(ModalStateContext);
  const [addElementDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [selected, setSelected] = useState<string>("");

  return (
    <div className={`${classes.tabcontainer}`}>
      <List>
        {alert.elements.map((element, index) => (
          <ElementsItemComponent key={index} element={element} />
        ))}
        <ModalStateContext.Provider value={addElementDialogState}>
          <CollapseLikeButton
            onClick={() => {
              addElementDialogState.show = true;
            }}
          >
            <AddIcon color="var(--oda-primary-color)" />
            <div>Добавить элемент</div>
          </CollapseLikeButton>
          <Overlay>
            <Panel>
              <Title>Добавить элемент</Title>
              <CardList>
                <Card
                  onClick={() => {
                    alert.addElement({
                      data: {
                        type: "label",
                        name: "Надпись",
                        settings: DEFAULT_LABEL_ELEMENT_SETTINGS,
                      },
                    });
                    addElementDialogState.show = false;
                  }}
                >
                  <CardTitle>Надпись</CardTitle>
                </Card>
                <Card
                  onClick={() => {
                    addElementDialogState.show = false;
                    alert.addElement({
                      data: {
                        type: "media",
                        name: "Изображение/Видео",
                        settings: {},
                      },
                    });
                  }}
                >
                  <CardTitle>Изображение/Видео</CardTitle>
                </Card>
              </CardList>
            </Panel>
          </Overlay>
        </ModalStateContext.Provider>
      </List>
    </div>
  );
});

const AudioTab = observer(({ alert }: { alert: TwitchAlert }) => {
  return (
    <Flex vertical className={`${classes.tabcontainer}`} gap={9}>
      {alert.data.audio.map((audio, index) => (
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
                Воспроизвести
              </SubActionButton>
              <BorderedIconButton
                onClick={() => {
                  alert.data.audio.splice(index, 1);
                }}
              >
                <CloseIcon color="#FF8888" />
              </BorderedIconButton>
            </Flex>
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
      <Flex gap={9}>
        <CollapseLikeUploadButton
          onClick={(e) => {
            handleFileUpload(e).then((result) => {
              if (result) {
                alert.data.audio.push({
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
          Добавить аудиофайл
        </CollapseLikeUploadButton>
      </Flex>
      <div className={`${classes.note}`}>
        Добавленные аудиофайлы будут воспроизводиться по порядку, один за одним.
      </div>
    </Flex>
  );
});

export const ItemContent = observer(({ alert }: { alert: TwitchAlert }) => {
  const { t } = useTranslation();
  const preview = useRef<HTMLElement | null>(null);
  const presetStore = useContext(PresetStoreContext);

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
      <Flex style={{ height: "96vh", maxHeight: "calc(100vh - 100px)" }} gap={6}>
        <Flex vertical className={`${classes.contentpanel} ${classes.settingspanel} withscroll`}>
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
                children: [<ElementsTab alert={alert} />],
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
              <div style={{ margin: "auto" }}></div>
            </ResizableBox>
          </Flex>
          <SaveButtons />
        </Flex>
      </Flex>
    </Flex>
  );
});
