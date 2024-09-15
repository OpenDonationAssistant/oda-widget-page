import React from "react";
import classes from "./LabeledContainer.module.css";
import { Trans } from "react-i18next";

export default function LabeledContainer({
  children,
  displayName,
  className,
}: {
  children: React.ReactNode;
  displayName: string;
  className?: string;
}) {
  return (
    <div className={`${classes.container} ${className ? className : ""}`}>
      <label className={`${classes.name}`}>
        <Trans i18nKey={displayName} />
      </label>
      <div className={`${classes.child}`}>{children}</div>
    </div>
  );
}
