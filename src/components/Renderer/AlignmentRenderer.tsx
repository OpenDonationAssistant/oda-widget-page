import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { AlignmentProperty } from "../ConfigurationPage/widgetproperties/AlignmentProperty";
import { Flex } from "antd";

function getAlignment(alignment: AlignmentProperty) {
  switch (alignment.value) {
    case "left":
      return "flex-start";
    case "center":
      return "center";
    case "right":
      return "flex-end";
    default:
      return "flex-start";
  }
}

export const AlignmentRenderer = observer(
  ({
    children,
    alignment,
  }: {
    children: ReactNode;
    alignment: AlignmentProperty;
  }) => {
    return (
      <Flex className="full-width" justify={getAlignment(alignment)}>
        {children}
      </Flex>
    );
  },
);
