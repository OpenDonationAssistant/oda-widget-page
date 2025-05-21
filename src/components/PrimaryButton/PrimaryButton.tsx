import { Flex } from "antd";
import { ReactNode } from "react";

export default function PrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <>
      <button
        className="oda-btn-default"
        onClick={() => {
          onClick();
        }}
      >
        <Flex align="center" gap={3}>
          {children}
        </Flex>
      </button>
    </>
  );
}
