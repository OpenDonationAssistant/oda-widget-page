import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { log } from "../../../logging";
import { toJS } from "mobx";
import { produce } from "immer";
import dayjs from "dayjs";
import DateTimeInput from "../../DateTimeInput/DateTimeInput";

export interface DateTimePropertyValue {
  timestamp?: Date;
}

export class DateTimeProperty extends DefaultWidgetProperty<DateTimePropertyValue> {
  constructor(params: {
    name: string;
    value?: DateTimePropertyValue;
    displayName?: string;
    help?: string;
  }) {
    log.debug({ value: params.value }, "date time property value");
    super({
      name: params.name,
      value: params.value ?? {
        timestamp: dayjs(Date.now()).endOf("day").set("second", 0).toDate(),
      },
      displayName: params.displayName ?? "datetime",
      help: params.help,
    });
  }

  DateTimePropertyComponent = observer(
    ({ property }: { property: DateTimeProperty }) => {
      return (
        <>
          <LabeledContainer help={property.help} displayName={property.name}>
            <DateTimeInput
              value={new Date(property.value.timestamp ?? Date.now()).getTime()}
              onChange={(value) => {
                property.value = { timestamp: new Date(value) };
                log.debug({ value: toJS(property.value) }, "updated value");
              }}
            />
          </LabeledContainer>
        </>
      );
    },
  );

  copy() {
    return new DateTimeProperty({
      name: this.name,
      value: produce(toJS(this.value), (draft) => draft),
      displayName: this.displayName,
      help: this.help,
    });
  }

  markup(): ReactNode {
    return <this.DateTimePropertyComponent property={this} />;
  }
}
