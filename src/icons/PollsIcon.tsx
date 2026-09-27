import { observer } from "mobx-react-lite"

const PollsIcon = observer(
  ({ color, className }: { color?: string; className?: string }) => {
    return (
      <>
        <svg
          width="24"
          height="24"
          className={className}
          viewBox="0 0 24 24"
          fill={color || "var(--oda-primary-color)"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="14" width="4.5" height="7" rx="1" />
          <rect x="9.75" y="10" width="4.5" height="11" rx="1" />
          <rect x="16.5" y="6" width="4.5" height="15" rx="1" />
          <path
            d="M3.5 4.5L5.75 6.75L10.5 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    );
  },
);

export default PollsIcon
