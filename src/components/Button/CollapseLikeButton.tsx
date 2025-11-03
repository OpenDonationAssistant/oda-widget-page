import { Flex } from "antd";
import classes from "./CollapseLikeButton.module.css";
import { ReactNode } from "react";

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
