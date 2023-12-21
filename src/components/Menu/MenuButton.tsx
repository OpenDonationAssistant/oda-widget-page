import React from "react";

export default function MenuButton({
  text,
  handler,
}: {
  text: string;
  handler: () => void;
}) {
  return (
    <button className="btn btn-dark" onClick={handler}>
      {text}
    </button>
  );
}
