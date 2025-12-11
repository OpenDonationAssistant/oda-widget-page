import { Trans } from "react-i18next";

import { ColorPicker, Flex, Input, Select, Switch } from "antd";

import { produce } from "immer";
import { AnimatedFontProperty } from "./AnimatedFontProperty";
import classes from "./AnimatedFontComponent.module.css";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { ColorProperty, ColorPropertyTarget } from "./ColorProperty";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { ColorPropertyComponent } from "./ColorPropertyComponent";
import { log } from "../../../logging";
import InputNumber from "../components/InputNumber";
import { FontContext } from "../../../stores/FontStore";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  ModalState,
  ModalStateContext,
  Overlay,
  Panel,
  Title,
} from "../../Overlay/Overlay";
import SecondaryButton from "../../Button/SecondaryButton";
import PrimaryButton from "../../Button/PrimaryButton";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../IconButton/IconButton";
import SmallLabeledContainer from "../../SmallLabeledContainer/SmallLabeledContainer";
import CollapseLikeButton from "../../Button/CollapseLikeButton";
import SubActionButton from "../../Button/SubActionButton";
import { Card, CardList } from "../../Cards/CardsComponent";
import { TextRenderer } from "../../Renderer/TextRenderer";
import FontImport from "../../FontImport/FontImport";
import { FontControllerFontDto as Font } from "@opendonationassistant/oda-font-service-client";

const animations = [
  "none",
  "bounce",
  "flash",
  "pulse",
  "rubberBand",
  "shakeX",
  "shakeY",
  "headShake",
  "swing",
  "tada",
  "wobble",
  "jello",
  "heartBeat",
];

const FontBrowser = ({
  lang,
  onChange,
}: {
  lang: "en" | "ru";
  onChange: (font: Font) => void;
}) => {
  const fonts = useContext(FontContext);
  const [page, setPage] = useState<number>(0);
  const [selected, setSelected] = useState<Font | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(() => {
    if (lang === "en") {
      return "latin";
    }
    return "cyrillic";
  });
  const [name, setName] = useState<string | null>(null);
  const [fontList, setFontList] = useState<Font[]>([]);
  const modalState = useContext(ModalStateContext);

  useEffect(() => {
    log.debug(
      { name: name, category: category, language: language },
      "searching fonts",
    );
    fonts
      .search({
        name: name ?? undefined,
        category: category ?? undefined,
        subset: language ?? undefined,
      })
      .then((data) => {
        log.debug({ loaded: data.length });
        setFontList(data);
      });
  }, [category, language, name]);

  return (
    <Overlay>
      <Panel>
        <Title>Выбор шрифта</Title>
        <Flex className={`${classes.filters}`} gap={12}>
          <SmallLabeledContainer
            className="autoscale-1"
            displayName="Фильтр по названию"
          >
            <Input
              className={`${classes.filter}`}
              value={name ?? ""}
              onChange={(e) => setName(e.target.value ?? null)}
            />
          </SmallLabeledContainer>
          <SmallLabeledContainer
            className="autoscale-1"
            displayName="Категория"
          >
            <Select
              className={`${classes.filter}`}
              value={category}
              options={[
                { label: "Display", value: "display" },
                { label: "Handwriting", value: "handwriting" },
                { label: "Sans Serif", value: "sans-serif" },
                { label: "Serif", value: "serif" },
                { label: "Monospace", value: "monospace" },
                { label: "Other", value: "other" },
                { label: "Любая", value: null },
              ]}
              onChange={(value) => {
                setPage(0);
                setCategory(value);
              }}
            />
          </SmallLabeledContainer>
          <SmallLabeledContainer
            className="autoscale-1"
            displayName="Поддерживаемый язык"
          >
            <Select
              className={`${classes.filter}`}
              value={language}
              options={[
                { label: "Русский", value: "cyrillic" },
                { label: "English", value: "latin" },
                { label: "Любой", value: null },
              ]}
              onChange={(value) => {
                setPage(0);
                setLanguage(value);
              }}
            />
          </SmallLabeledContainer>
        </Flex>
        <CardList className={`${classes.fontlist} withscroll`}>
          {fontList.slice(0, page * 12 + 12).map((font) => (
            <Card
              selected={selected?.name === font.name}
              className={`${classes.fontpreview}`}
              key={font.name}
              onClick={() => setSelected(font)}
            >
              <FontImport font={font.name} key={font.name} />
              <div style={{ fontFamily: font.name, fontSize: "24px" }}>
                {language === "cyrillic" &&
                  "Съешь же еще этих мягких французских булок да выпей чаю"}
                {language !== "cyrillic" &&
                  "The quick brown fox jumps over the lazy dog"}
              </div>
              <div>{font.displayName}</div>
            </Card>
          ))}
        </CardList>
        <Flex className={`${classes.buttons}`} justify="space-between">
          <SecondaryButton
            onClick={() => {
              setPage(0);
              setSelected(null);
              modalState.show = false;
            }}
          >
            Отменить
          </SecondaryButton>
          <SecondaryButton onClick={() => setPage((old) => old + 1)}>
            Показать ещё
          </SecondaryButton>
          <PrimaryButton
            disabled={!selected}
            onClick={() => {
              setPage(0);
              modalState.show = false;
              if (selected) {
                onChange(selected);
              }
            }}
          >
            Принять
          </PrimaryButton>
        </Flex>
      </Panel>
    </Overlay>
  );
};

export const FontSettingsOverlay = observer(
  ({
    property,
    onChange,
  }: {
    property: AnimatedFontProperty;
    onChange?: (property: AnimatedFontProperty) => void;
  }) => {
    const fonts = useContext(FontContext);
    const [fontList, setFontList] = useState<Font[]>([]);
    const parentModalState = useContext(ModalStateContext);
    const [zoomLevel, setZoomLevel] = useState<number>(1.0);
    const [lang, setLang] = useState<"en" | "ru">("ru");
    const [browserModalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    function refreshFonts(): Promise<void> {
      return fonts.list().then((list) => setFontList(list));
    }

    useEffect(() => {
      refreshFonts();
    }, [fonts]);

    return (
      <>
        <ModalStateContext.Provider value={browserModalState}>
          <FontBrowser
            lang={lang}
            onChange={(font) => {
              property.value.family = font.name;
            }}
          />
        </ModalStateContext.Provider>
        <Overlay>
          <Dialog center={false}>
            <Title>Настройки шрифта</Title>
            <div className={`${classes.democontainer}`}>
              <div
                className={`${classes.demo}`}
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <TextRenderer
                  text={
                    lang === "en"
                      ? "The quick brown fox jumps over the lazy dog"
                      : "Съешь же еще этих мягких французских булок да выпей чаю"
                  }
                  font={property}
                />
              </div>
              <div
                className={`${classes.background}`}
                style={{
                  background: `url(${process.env.PUBLIC_URL}/opacity.png)`,
                }}
              />
              <Flex className={`${classes.zoombuttons}`} gap={3}>
                <NotBorderedIconButton
                  onClick={() => {
                    setZoomLevel((old) => old - 0.1);
                  }}
                >
                  <span className="material-symbols-sharp">zoom_out</span>
                </NotBorderedIconButton>
                <NotBorderedIconButton
                  onClick={() => {
                    setZoomLevel((old) => old + 0.1);
                  }}
                >
                  <span className="material-symbols-sharp">zoom_in</span>
                </NotBorderedIconButton>
              </Flex>
              <Flex className={`${classes.langbuttons}`} gap={3}>
                <Select
                  value={lang}
                  options={[
                    { value: "ru", label: "RU" },
                    { value: "en", label: "EN" },
                  ]}
                  onChange={(value) => {
                    setLang(value);
                  }}
                />
              </Flex>
            </div>
            <Flex vertical>
              <div className="settings-item">
                <LabeledContainer
                  displayName="button-font"
                  help={<Trans i18nKey="font-select-help" />}
                >
                  <Flex vertical className="full-width" align="flex-start">
                    <Flex className="full-width" gap={6} align="flex-end">
                      <SmallLabeledContainer
                        className={`${classes.fontsizecontainer}`}
                        displayName="button-font-size"
                      >
                        <InputNumber
                          value={property.value.size}
                          className={`${classes.fontsizecontainer}`}
                          addon="px"
                          onChange={(value) => {
                            if (value === null || value === undefined) {
                              return;
                            }
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.size = value;
                              },
                            );
                            if (onChange) onChange(property);
                          }}
                        />
                      </SmallLabeledContainer>
                      <SmallLabeledContainer
                        className="autoscale-1"
                        displayName="Название"
                      >
                        <Select
                          showSearch
                          className="full-width"
                          value={property.value.family}
                          onChange={(selected) => {
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.family = selected;
                              },
                            );
                            if (onChange) onChange(property);
                          }}
                          options={fontList.sort().map((font) => {
                            return {
                              value: font.name,
                              label: font.displayName,
                            };
                          })}
                        />
                      </SmallLabeledContainer>
                      <Flex align="flex-end" gap={3}>
                        <BorderedIconButton
                          className={`${property.value.weight ? classes.selected : classes.notselected}`}
                          onClick={() => {
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.weight = !draft.weight;
                              },
                            );
                            if (onChange) onChange(property);
                          }}
                        >
                          <span
                            className="material-symbols-sharp"
                            style={
                              property.value.weight
                                ? { color: "black" }
                                : { color: "var(--oda-color-950)" }
                            }
                          >
                            format_bold
                          </span>
                        </BorderedIconButton>
                        <BorderedIconButton
                          className={`${property.value.underline ? classes.selected : classes.notselected}`}
                          onClick={() => {
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.underline = !draft.underline;
                              },
                            );
                            if (onChange) onChange(property);
                          }}
                        >
                          <span
                            className="material-symbols-sharp"
                            style={
                              property.value.underline
                                ? { color: "black" }
                                : { color: "var(--oda-color-950)" }
                            }
                          >
                            format_underlined
                          </span>
                        </BorderedIconButton>
                        <BorderedIconButton
                          className={`${property.value.italic ? classes.selected : classes.notselected}`}
                          onClick={() => {
                            property.value = produce(
                              toJS(property.value),
                              (draft) => {
                                draft.italic = !draft.italic;
                              },
                            );
                            if (onChange) onChange(property);
                          }}
                        >
                          <span
                            className="material-symbols-sharp"
                            style={
                              property.value.italic
                                ? { color: "black" }
                                : { color: "var(--oda-color-950)" }
                            }
                          >
                            format_italic
                          </span>
                        </BorderedIconButton>
                      </Flex>
                    </Flex>
                    <Flex className="full-width" gap={6} align="flex-end">
                      <SecondaryButton
                        className="autoscale-1"
                        onClick={() => {
                          browserModalState.show = true;
                        }}
                      >
                        <span className="material-symbols-sharp">folder</span>
                        <Trans i18nKey="button-browse" />
                      </SecondaryButton>
                      <label className={`${classes.upload} autoscale-1`}>
                        <input
                          type="file"
                          onChange={(e) => {
                            if (!e.target.files) return;
                            fonts.upload(e.target.files[0]).then((font) => {
                              log.debug({ font: font }, "uploaded font");
                              refreshFonts().then((_) => {
                                property.value.family = font.name;
                              });
                            });
                          }}
                        />
                        <span className="material-symbols-sharp">upload</span>
                        <Trans i18nKey="button-upload" />
                      </label>
                    </Flex>
                  </Flex>
                </LabeledContainer>
              </div>
              <div className="settings-item">
                <ColorPropertyComponent
                  onChange={(value) => {
                    log.debug({ newValue: value }, "changing color");
                    property.value = produce(toJS(property.value), (draft) => {
                      draft.color = value;
                    });
                    if (onChange) onChange(property);
                  }}
                  property={
                    new ColorProperty({
                      name: "color",
                      value: property.value.color,
                      displayName: "button-text-color",
                      target: ColorPropertyTarget.TEXT,
                    })
                  }
                />
              </div>
              <div className="settings-item">
                <Flex gap={5} align="center" justify="space-between">
                  <div
                    style={{
                      fontSize: "21px",
                      color: "var(--oda-color-950)",
                      paddingBottom: "9px",
                    }}
                  >
                    Обводка
                  </div>
                  <Switch
                    value={property.value.outline.enabled}
                    onChange={(checked) => {
                      property.value = produce(
                        toJS(property.value),
                        (draft) => {
                          draft.outline.enabled = checked;
                        },
                      );
                    }}
                  />
                </Flex>
                {property.value.outline.enabled && (
                  <Flex gap={9} className="full-width">
                    <SmallLabeledContainer displayName="Толщина">
                      <InputNumber
                        value={property.value.outline.width}
                        addon="px"
                        onChange={(value) => {
                          if (value === null || value === undefined) {
                            return;
                          }
                          property.value = produce(
                            toJS(property.value),
                            (draft) => {
                              draft.outline.width = value;
                            },
                          );
                          if (onChange) onChange(property);
                        }}
                      />
                    </SmallLabeledContainer>
                    <SmallLabeledContainer displayName="Цвет">
                      <ColorPicker
                        style={{
                          border: "1px solid #36363D",
                          borderRadius: "9px",
                          height: "48px",
                        }}
                        showText
                        value={property.value.outline.color}
                        onChange={(color) => {
                          property.value = produce(
                            toJS(property.value),
                            (draft) => {
                              draft.outline.color = color.toRgbString();
                            },
                          );
                        }}
                      />
                    </SmallLabeledContainer>
                  </Flex>
                )}
              </div>
              <div className="settings-item">
                <LabeledContainer displayName="widget-font-animation">
                  <Flex vertical gap={9} className="full-width">
                    <Select
                      value={property.value.animation}
                      className="full-width"
                      onChange={(selected) => {
                        property.value.animation = selected;
                        if (onChange) onChange(property);
                      }}
                      options={animations.map((option) => {
                        return {
                          value: option,
                          label: <Trans i18nKey={option} />,
                        };
                      })}
                    />
                    {property.value.animation !== "none" && (
                      <Flex gap={6}>
                        <SmallLabeledContainer displayName="Режим анимации">
                          <Select
                            value={property.value.animationType}
                            className="full-width"
                            onChange={(selected) => {
                              property.value.animationType = selected;
                              if (onChange) onChange(property);
                            }}
                            options={[
                              { value: "entire", label: "Целиком" },
                              { value: "word", label: "По словам" },
                              { value: "letter", label: "По буквам" },
                            ]}
                          />
                        </SmallLabeledContainer>
                        <SmallLabeledContainer displayName="Скорость анимации">
                          <Select
                            value={property.value.animationSpeed}
                            className="full-width"
                            onChange={(selected) => {
                              property.value.animationSpeed = selected;
                              if (onChange) onChange(property);
                            }}
                            options={[
                              { value: "slower", label: "Очень медленно" },
                              { value: "slow", label: "Медленно" },
                              { value: "normal", label: "Нормально" },
                              { value: "fast", label: "Быстро" },
                              { value: "faster", label: "Очень быстро" },
                            ]}
                          />
                        </SmallLabeledContainer>
                      </Flex>
                    )}
                  </Flex>
                </LabeledContainer>
              </div>
              <div className="settings-item">
                <LabeledContainer displayName="Тени">
                  <Flex vertical className="full-width" gap={3}>
                    {property.value.shadows.map((shadow, i) => (
                      <Flex
                        key={i}
                        vertical
                        gap={9}
                        className={`${classes.shadowitem}`}
                      >
                        <Flex gap={6} className="full-width">
                          <SmallLabeledContainer displayName="Смещение по горизонтали">
                            <InputNumber
                              value={shadow.x}
                              addon="px"
                              onChange={(updated) => (shadow.x = updated)}
                            />
                          </SmallLabeledContainer>
                          <SmallLabeledContainer displayName="Смещение по вертикали">
                            <InputNumber
                              value={shadow.y}
                              addon="px"
                              onChange={(updated) => (shadow.y = updated)}
                            />
                          </SmallLabeledContainer>
                        </Flex>
                        <Flex gap={6} className="full-width">
                          <SmallLabeledContainer
                            className={`${classes.half}`}
                            displayName="Радиус блюра"
                          >
                            <InputNumber
                              value={shadow.blur}
                              addon="px"
                              onChange={(updated) => (shadow.blur = updated)}
                            />
                          </SmallLabeledContainer>
                          <SmallLabeledContainer
                            className={`${classes.half}`}
                            displayName="Цвет"
                          >
                            <ColorPicker
                              showText
                              className={`${classes.colorpicker}`}
                              value={shadow.color}
                              onChange={(updated) =>
                                (shadow.color = updated.toRgbString())
                              }
                            />
                          </SmallLabeledContainer>
                        </Flex>
                        <Flex className="full-width" justify="flex-end" gap={6}>
                          <SubActionButton
                            onClick={() =>
                              property.value.shadows.push(
                                structuredClone(toJS(shadow)),
                              )
                            }
                          >
                            <div>Копировать</div>
                          </SubActionButton>
                          <SubActionButton
                            onClick={() => property.value.shadows.splice(i, 1)}
                          >
                            <div style={{ color: "#FF8888" }}>Удалить</div>
                          </SubActionButton>
                        </Flex>
                      </Flex>
                    ))}
                    <CollapseLikeButton
                      onClick={() => {
                        property.value.shadows.push({
                          x: 0,
                          y: 0,
                          blur: 0,
                          color: "#000000",
                        });
                      }}
                    >
                      Добавить тень
                    </CollapseLikeButton>
                  </Flex>
                </LabeledContainer>
              </div>
            </Flex>
            <Flex className="full-width" justify="flex-end">
              <PrimaryButton
                className={`${classes.okbutton}`}
                onClick={() => (parentModalState.show = false)}
              >
                Применить
              </PrimaryButton>
            </Flex>
          </Dialog>
        </Overlay>
      </>
    );
  },
);

export const AnimatedFontComponent = observer(
  ({
    property,
    onChange,
  }: {
    property: AnimatedFontProperty;
    onChange?: (property: AnimatedFontProperty) => void;
  }) => {
    const parentModalState = useContext(ModalStateContext);
    const [mainWindowModalState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );

    return (
      <ModalStateContext.Provider value={mainWindowModalState}>
        <SecondaryButton
          onClick={() => {
            mainWindowModalState.show = true;
          }}
        >
          Настройки шрифта
        </SecondaryButton>
        <FontSettingsOverlay property={property} onChange={onChange} />
      </ModalStateContext.Provider>
    );
  },
);
