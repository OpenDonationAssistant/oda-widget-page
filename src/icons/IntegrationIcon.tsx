export default function IntegrationIcon({ color }:{ color?: string; }) {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8.5" cy="15.5" r="5" stroke={color ?? "white"} />
        <path
          d="M13.5 9L11.5 11.5M17 9L18.5 12.5M13.5 15.5C13.9 15.5 16.3333 15.1667 17.5 15"
          stroke={ color ?? "white" }
        />
        <circle cx="15.5" cy="6.5" r="3" stroke={ color ?? "white" }/>
        <circle cx="19.5" cy="14.5" r="2" stroke={ color ?? " white" } />
      </svg>
    </>
  );
}
