import { ReactNode } from "react";
import classes from "./LabeledContainer.module.css";
import { Trans } from "react-i18next";
import { Flex, Tooltip } from "antd";

export default function LabeledContainer({
  children,
  displayName,
  className,
  help,
  buttons,
}: {
  children: ReactNode;
  displayName: string;
  className?: string;
  help?: ReactNode;
  buttons?: ReactNode;
}) {
  return (
    <div className={`${classes.container} ${className ? className : ""}`}>
      <label className={`${classes.name}`}>
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Trans i18nKey={displayName} />
            {help && (
              <Tooltip placement="right" title={help}>
                <span className="material-symbols-sharp">help</span>
              </Tooltip>
            )}
          </Flex>
          {buttons}
        </Flex>
      </label>
      <div className={`${classes.child}`}>{children}</div>
    </div>
  );
}
