import { Select } from "antd";

export const Fonts = [
  "Alice",
  "Play",
  "Roboto",
  "Ruslan Display",
  "Cuprum",
  "Anonymous Pro",
  "Pangolin",
  "Ruda",
  "Stalinist One",
  "Montserrat",
  "Ubuntu Mono",
  "Jura",
  "Scada",
  "Prosto One",
  "Arsenal",
  "Tenor Sans",
  "El Messiri",
  "Yeseva One",
  "Pattaya",
  "Andika",
  "Gabriela",
  "Marmelad",
  "Cormorant Unicase",
  "Cormorant SC",
  "Amatic SC",
  "Rubik Mono One",
  "PT Sans Caption",
  "Spectral SC",
  "Rubik",
  "Exo 2",
  "Exo",
  "Oswald",
  "Underdog",
  "Kurale",
  "Forum",
  "Neucha",
  "Didact Gothic",
  "Philosopher",
  "Russo One",
  "Noto Serif",
  "Press Start 2P",
];

export default function FontSelect({
  prop,
  className,
  onChange,
}: {
  prop: { value: string };
  className?: string;
  onChange: (name: string) => void;
}) {
  return (
    <Select
      showSearch
      value={prop.value}
      onChange={onChange}
      className={className}
      options={Fonts.sort().map((font) => {
        return { value: font, label: font };
      })}
    />
  );
}
