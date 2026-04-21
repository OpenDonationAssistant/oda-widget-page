export default function BoostyIcon({
  color,
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width="16"
      className={className}
      height="19"
      viewBox="0 0 16 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.40697 0.000639617L4.87329 12.3305H7.23858L4.95878 18.2385L10.7153 9.81882H8.29298L10.3946 4.46649C12.0337 4.54953 13.4573 5.18456 14.3392 6.37796C16.2883 9.01556 14.8533 13.3819 11.1339 16.1304C7.41458 18.8789 2.81938 18.9688 0.87026 16.3312C-0.125082 14.9843 -0.237919 13.1866 0.385281 11.3837L3.75508 0H8.41421L8.40697 0.000639617Z"
        fill={color || "#B2D4FB"}
      />
    </svg>
  );
}
