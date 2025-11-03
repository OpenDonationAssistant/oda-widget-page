import { observer } from "mobx-react-lite";
import { TwitchAlertData,TWITCH_ALERT_TRIGGERS } from "./types";
import { TwitchAlertsProperty } from "./TwitchAlertsProperty";
import { useTranslation } from "react-i18next";
import { useContext, useRef } from "react";
import { PresetStoreContext } from "../../stores/PresetStore";
import { Flex, Select, Tabs } from "antd";
import classes from "./TwitchAlertsItemSettings.module.css";
import { EditableString } from "../../components/RenamableLabel/EditableString";
import { CloseOverlayButton } from "../../components/Overlay/Overlay";
import { NotBorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import CollapseLikeButton from "../../components/Button/CollapseLikeButton";
import SubActionButton from "../../components/Button/SubActionButton";
import { PresetsComponent } from "../../components/ConfigurationPage/PresetsComponent";
import { ResizableBox } from "react-resizable";
import { SaveButtons } from "../../components/Button/SaveButtons";

export const ItemContent = observer(
  ({
    alert,
    property,
    index,
  }: {
    alert: TwitchAlertData;
    property: TwitchAlertsProperty;
    index: number;
  }) => {
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
            label={alert.name}
            onChange={(value) => {
              alert.name = value;
            }}
          />
          <CloseOverlayButton />
        </Flex>
        <Flex style={{ height: "100%" }}>
          <Flex vertical className={`${classes.contentpanel} withscroll`}>
            <Tabs
              size="small"
              type="card"
              tabPosition="top"
              items={[
                {
                  key: "general",
                  label: t("General"),
                  children: [
                    <Flex vertical gap={6}>
                      <div style={{ paddingTop: "12px", fontSize: "21px" }}>
                        Срабатывает когда
                      </div>
                      {alert.triggers.map((trigger, index) => (
                        <Flex align="center" gap={6}>
                          <Select
                            key={index}
                            value={trigger.type}
                            className="full-width"
                            onChange={(e) => {
                              trigger.type = e;
                            }}
                            options={TWITCH_ALERT_TRIGGERS.map((option) => {
                              return {
                                value: option,
                                label: (
                                  <>
                                    <Trans i18nKey={option} />
                                  </>
                                ),
                              };
                            })}
                          />
                          <NotBorderedIconButton
                            onClick={() => alert.triggers.splice(index, 1)}
                            className={`${classes.deletetriggerbutton}`}
                          >
                            <CloseIcon color="#FF8888" />
                          </NotBorderedIconButton>
                        </Flex>
                      ))}
                      <CollapseLikeButton
                        onClick={() => {
                          alert.triggers.push({
                            type: TWITCH_ALERT_TRIGGERS[0],
                          });
                        }}
                      >
                        Добавить условие
                      </CollapseLikeButton>
                    </Flex>,
                  ],
                },
                {
                  key: "visual",
                  label: "Отображение",
                  children: [<div></div>],
                },
                {
                  key: "audio",
                  label: "Аудио",
                  children: [<div></div>],
                },
              ]}
            />
          </Flex>
          <Flex vertical gap={9} className={`${classes.contentpanel}`}>
            <Flex
              justify="flex-start"
              gap={9}
              className={`${classes.previewcontainer}`}
            >
              <SubActionButton onClick={() => {}}>
                Создать шаблон
              </SubActionButton>
              <PresetsComponent target={alert} presetStore={presetStore} />
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
  },
);
