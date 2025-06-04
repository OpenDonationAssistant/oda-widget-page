import React from "react";

export default function GuideIcon({ color }: { color?: string }) {
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
          d="M6 5.5H14C15.933 5.5 17.5 7.067 17.5 9V17C17.5 18.933 15.933 20.5 14 20.5H6C5.17157 20.5 4.5 19.8284 4.5 19V7C4.5 6.17157 5.17157 5.5 6 5.5Z"
          stroke={color ?? "white"}
        />
        <path d="M4.87 6L7.5 4" stroke={color ?? "white"} />
        <path
          d="M6.64999 5.99374V5.64999C6.64999 4.54542 7.54542 3.64999 8.64999 3.64999H15.65C17.8591 3.64999 19.65 5.44086 19.65 7.64999V15.8643C19.65 17.4028 18.4028 18.65 16.8643 18.65V18.65"
          stroke={color ?? "white"}
        />
        <path
          d="M10 6V12.0397C10 12.4442 10.4553 12.6813 10.7867 12.4493L12.2133 11.4507C12.3854 11.3302 12.6146 11.3302 12.7867 11.4507L14.2133 12.4493C14.5447 12.6813 15 12.4442 15 12.0397V6"
          stroke={color ?? "white"}
        />
      </svg>
    </>
  );
}
