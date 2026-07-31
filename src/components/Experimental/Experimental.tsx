import { ReactNode } from "react";
import classes from "./Experimental.module.css";

export function Experimental({
  children,
  className,
  show,
}: {
  children: ReactNode;
  className?: string;
  show?: boolean;
}) {
  return (
    <div className={`${classes.wrapper} ${className ?? ""}`}>
      {show && (
        <span className={`${classes.experimental} material-symbols-sharp`}>
          experiment
        </span>
      )}
      {children}
    </div>
  );
}

export function NewFeature({
  children,
  className,
  show,
}: {
  children: ReactNode;
  className?: string;
  show?: boolean;
}) {
  return (
    <div className={`${classes.wrapper} ${className ?? ""}`}>
      {show && <div className={`${classes.newfeature}`}>new</div>}
      {children}
    </div>
  );
}
