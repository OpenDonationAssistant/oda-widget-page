import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import WordBlacklistDialog from "../../../wizards/wordblacklist/WordBlacklistDialog";

const WordBlacklistPropertyComponent = observer(
  ({ property }: { property: WordBlacklistProperty }) => {
    return (
      <Flex>
        <WordBlacklistDialog />
      </Flex>
    );
  },
);

export class WordBlacklistProperty extends DefaultWidgetProperty<string> {
  constructor(params: { value?: string }) {
    super({
      name: "word-blacklist",
      value: params.value ?? "",
      displayName: "Список запрещенных слов",
    });
  }

  copy() {
    return new WordBlacklistProperty({
      value: this.value,
    });
  }

  markup(): ReactNode {
    return <WordBlacklistPropertyComponent property={this} />;
  }
}
