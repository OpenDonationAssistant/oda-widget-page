import { CSSProperties } from "react";

export default function PictureIcon({ style }: { style?: CSSProperties }) {
  return (
    <>
      <svg
        style={ style ? style : {} }
        width="90"
        height="60"
        viewBox="0 0 90 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="88"
          height="58"
          rx="9"
          stroke="#787887"
          stroke-width="2"
        />
        <circle cx="21" cy="21" r="10" stroke="#787887" stroke-width="2" />
        <path
          d="M1 49.5L10.9153 43.4646C11.9203 42.8528 13.1438 42.7146 14.26 43.0867L15.1441 43.3814C16.3151 43.7717 17.6007 43.5995 18.6278 42.9148L25.2812 38.4792C26.6248 37.5835 28.3752 37.5835 29.7188 38.4792L46.9342 49.9562C47.9259 50.6173 49.1608 50.8018 50.3024 50.4593L51.7162 50.0351C52.8471 49.6959 54.0701 49.8735 55.0577 50.5206L68 59"
          stroke="#787887"
          stroke-width="2"
        />
        <path
          d="M38.5 44.5L49.9963 35.1327C51.2159 34.1389 52.9047 33.9524 54.3118 34.6559L54.6104 34.8052C56.057 35.5285 57.7968 35.3095 59.019 34.2502L69.6328 25.0516C71.0231 23.8466 73.0561 23.7455 74.5592 24.8065L89 35"
          stroke="#787887"
          stroke-width="2"
        />
      </svg>
    </>
  );
}
