export default function LinkIcon({ color }: { color?: string }) {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 9H8H7C5.34315 9 4 10.3431 4 12V12C4 13.6569 5.34315 15 7 15H8H10M14 15H16H17C18.6569 15 20 13.6569 20 12V12C20 10.3431 18.6569 9 17 9H16H14"
          stroke={color ?? "white"}
        />
        <path d="M8 12H16" stroke={color ?? "white"} />
      </svg>
    </>
  );
}
