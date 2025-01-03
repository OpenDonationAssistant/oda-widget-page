import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import { Select } from "antd";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import { toJS } from "mobx";
import { produce } from "immer";
import { log } from "../../../../logging";

export interface WordsBlacklistValue {
  words: string[];
}

const WodrsBlacklistComponent = observer(
  ({ property }: { property: WordsBlacklist }) => {
    return (
      <LabeledContainer displayName="Черный список слов в названии">
        <Select
          className="full-width"
          mode="tags"
          value={property.value.words}
          onChange={(value: string[]) => {
            log.debug({ value: value }, "words changed");
            property.value = { words: value };
          }}
        />
      </LabeledContainer>
    );
  },
);

export class WordsBlacklist extends DefaultWidgetProperty<WordsBlacklistValue> {
  constructor() {
    super({
      name: "titleBlacklist",
      value: [],
      displayName: "Черный список",
    });
  }

  markup(): ReactNode {
    return <WodrsBlacklistComponent property={this} />;
  }
}
