export default function CheckIcon({ color }: { color: string }) {
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
          d="M18.3536 9.35356L12.7678 14.9393C11.7915 15.9157 10.2085 15.9157 9.23223 14.9393L6.64645 12.3536L7.35355 11.6465L9.93934 14.2322C10.5251 14.818 11.4749 14.818 12.0607 14.2322L17.6464 8.64645L18.3536 9.35356Z"
          fill={color}
        />
      </svg>
    </>
  );
}
