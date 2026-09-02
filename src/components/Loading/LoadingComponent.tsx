import { Flex, Spin } from "antd";
import { useEffect, useState } from "react";
import classes from "./LoadingComponent.module.css";

export interface Loadable {
  load: () => Promise<void>;
}

export interface LoadingComponentProps {
  loadable: Loadable;
  children: React.ReactNode;
}

export function LoadingComponent({
  loadable,
  children,
}: LoadingComponentProps) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    loadable.load().then(() => setLoading(false));
  }, [loadable]);

  return (
    <Flex justify="center" align="center">
      {loading && <Spin className={`${classes.spin}`} size="large" />}
      {!loading && children}
    </Flex>
  );
}
