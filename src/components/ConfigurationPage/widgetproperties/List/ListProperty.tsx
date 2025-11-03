import { ReactNode } from "react";
import { DefaultWidgetProperty, WidgetProperty } from "./../WidgetProperty";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import CollapseLikeButton from "../../../Button/CollapseLikeButton";
import AddIcon from "../../../../icons/AddIcon";

const ListPropertyComponent = observer(
  ({ property }: { property: ListProperty<any> }) => {
    return (
      <Flex vertical className="full-width" gap={6}>
        {property.value.map((item, index) => item.markup())}
        <CollapseLikeButton
          onClick={() => {
            property.factoryMethod();
          }}
        >
          <AddIcon color="var(--oda-color-1000)" />
          <div>Добавить надпись</div>
        </CollapseLikeButton>
      </Flex>
    );
  },
);

export class ListProperty<T> extends DefaultWidgetProperty<
  WidgetProperty<T>[]
> {
  private _factoryMethod: () => WidgetProperty<T>;

  constructor(params: {
    name: string;
    value?: WidgetProperty<T>[];
    displayName: string;
    help?: string;
    factoryMethod: () => WidgetProperty<T>;
  }) {
    super({
      name: params.name,
      value: params.value ?? [],
      displayName: params.displayName,
      help: params.help,
    });
    this._factoryMethod = params.factoryMethod;
  }

  copy() {
    return new ListProperty<T>({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      help: this.help,
      factoryMethod: this._factoryMethod,
    });
  }

  markup(): ReactNode {
    return <ListPropertyComponent property={this} />;
  }

  factoryMethod() {
    this._value.push(this._factoryMethod());
  }
}
