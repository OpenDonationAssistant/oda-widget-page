const fonts = [
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
];

export default function FontSelect({ prop, onChange }) {
  return (
    <>
      <select
        value={prop.value}
        className="widget-settings-value select"
        onChange={(e) => onChange(e.target.value)}
      >
        {fonts.sort().map((font) => (
          <option key={font}>{font}</option>
        ))}
      </select>
    </>
  );
}
