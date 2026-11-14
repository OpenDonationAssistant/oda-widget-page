import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import StringListEditor from "../../../StringListEditor/StringListEditor";
import { useTranslation } from "react-i18next";

const parseWords = (value: string): string[] => {
  return value
    .split(/\r?\n/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
};

// media-service reads wordsBlacklist as a newline-separated string
const serializeWords = (words: string[]): string => {
  return words.join("\n");
};

const WordsBlacklistComponent = observer(
  ({ property }: { property: WordsBlacklist }) => {
    const { t } = useTranslation();
    const words = parseWords(property.value);

    return (
      <LabeledContainer displayName={property.displayName}>
        <StringListEditor
          items={words}
          placeholder={t("media-enter-word")}
          onAdd={(word) => {
            const current = parseWords(property.value);
            if (!current.includes(word)) {
              property.value = serializeWords([...current, word]);
            }
          }}
          onRemove={(_, index) => {
            const current = parseWords(property.value);
            property.value = serializeWords(
              current.filter((_, position) => position !== index),
            );
          }}
        />
      </LabeledContainer>
    );
  },
);

export class WordsBlacklist extends DefaultWidgetProperty<string> {
  constructor(value: string = "") {
    super({
      name: "wordsBlacklist",
      value: value,
      displayName: "media-words-blacklist",
    });
  }

  copy(): WordsBlacklist {
    return new WordsBlacklist(this.value);
  }

  markup(): ReactNode {
    return <WordsBlacklistComponent property={this} />;
  }
}
