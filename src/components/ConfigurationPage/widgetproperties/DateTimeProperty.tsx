import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { observer } from "mobx-react-lite";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { log } from "../../../logging";
import { toJS } from "mobx";
import { produce } from "immer";

export interface DateTimePropertyValue {
  timestamp?: Date;
}

const dateFormat = "DD/MM/YYYY   HH:mm";

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

  DateTimePropertyComponent = observer(() => {
    return (
      <>
        <LabeledContainer help={this.help} displayName={this.name}>
          <DatePicker
            value={dayjs(this.value.timestamp)}
            showTime
            format={dateFormat}
            onChange={(value) => {
              this.value = { timestamp: value.toDate() };
              log.debug({ value: toJS(this.value) }, "updated value");
            }}
          />
        </LabeledContainer>
      </>
    );
  });

  copy() {
    return new DateTimeProperty({
      name: this.name,
      value: produce(toJS(this.value), draft => draft),
      displayName: this.displayName,
      help: this.help,
    });
  }

  markup(): ReactNode {
    return <this.DateTimePropertyComponent />;
  }
}
