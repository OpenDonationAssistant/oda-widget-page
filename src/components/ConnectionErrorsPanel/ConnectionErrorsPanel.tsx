import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import classes from "./ConnectionErrorsPanel.module.css";
import { DefaultWorkersStore, WorkersStore } from "../../stores/WorkersStore";

export default observer(function ConnectionErrorsPanel() {
  const [store] = useState<WorkersStore>(() => new DefaultWorkersStore());

  useEffect(() => () => store.dispose(), [store]);

  return (
    <>
      {store.errors.length > 0 && (
        <Flex vertical gap={3} className={classes.container}>
          {store.errors.map((error) => (
            <Flex align="center" key={error.handler}>
              <div className={classes.prefix}>err</div>
              <div className={classes.line}>
                {error.handler}
                {error.message ? `: ${error.message}` : ""}
              </div>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  );
});
