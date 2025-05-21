export default function AddIcon({ color }: { color: string }) {
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.5376 12.5V18.5H12.5127V12.5H18.0376V11.5H12.5127V6H11.5376V11.5H6.03758V12.5H11.5376Z"
          fill={color}
        />
      </svg>
    </>
  );
}
