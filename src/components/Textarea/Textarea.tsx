import classes from "./Textarea.module.css";

export default function Textarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      className={`${classes.textarea}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
