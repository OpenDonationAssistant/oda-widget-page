import { Flex } from "antd";
import classes from "./CollapseLikeButton.module.css";
import { ChangeEvent, ReactNode } from "react";

export default function CollapseLikeButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`${classes.collapselikebutton}`}
      onClick={() => onClick()}
    >
      <Flex justify="center" align="center" gap={3}>
        {children}
      </Flex>
    </button>
  );
}

export function CollapseLikeUploadButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={`${classes.collapselikebutton}`}>
      <input type="file" onChange={(e) => onClick(e)} />
      <Flex justify="center" align="center" gap={3} className="full-height">
        {children}
      </Flex>
    </label>
  );
}
