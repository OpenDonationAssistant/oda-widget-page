import { DatePicker } from "antd";
import dayjs from "dayjs";

export const datetimeFormat = "DD/MM/YYYY   HH:mm";

export interface DateTimeInputProps {
  value: number;
  onChange: (timestamp: number) => void;
}

export default function DateTimeInput({
  value,
  onChange,
}: DateTimeInputProps) {
  return (
    <DatePicker
      value={dayjs(value)}
      className="full-width"
      showTime
      format={datetimeFormat}
      onChange={(picked) => {
        if (picked) {
          onChange(picked.valueOf());
        }
      }}
    />
  );
}
