export default function ODAIcon({ color, className }:{ color?: string; className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="15 -30 20 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 0H18V24H0V0ZM5 5H13V19H5V5ZM39 0H47L43.61 6.25839L34 24H22V0H39ZM27 5H39L31 19H27V5ZM39 24H44.5L47.2632 19H59V24H64V0H52L39 24ZM59 14V5L55 5L50.0263 14H59Z"
        fill={color || "#ffffff"}
      ></path>
    </svg>
  );
}
