import { Flex } from "antd";
import { ReactNode } from "react";

export default function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <>
      <button
        className={`oda-btn-default ${className ? className : ""}`}
        disabled={disabled}
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
