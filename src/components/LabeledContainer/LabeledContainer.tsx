import React, { ReactNode, useState } from "react";
import classes from "./LabeledContainer.module.css";
import { Trans } from "react-i18next";
import { Tooltip } from "antd";

export default function LabeledContainer({
  children,
  displayName,
  className,
  help,
}: {
  children: ReactNode;
  displayName: string;
  className?: string;
  help?: ReactNode;
}) {
  return (
    <div className={`${classes.container} ${className ? className : ""}`}>
      <label className={`${classes.name}`}>
        <Trans i18nKey={displayName} />
        {help && (
          <Tooltip placement="right" title={help}>
            <span className="material-symbols-sharp">help</span>
          </Tooltip>
        )}
      </label>
      <div className={`${classes.child}`}>{children}</div>
    </div>
  );
}
