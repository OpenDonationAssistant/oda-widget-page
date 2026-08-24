import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import classes from "./ConnectionErrorsPanel.module.css";
import { DefaultWorkersStore, WorkersStore } from "../../stores/WorkersStore";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";

export default observer(function ConnectionErrorsPanel() {
  const [store] = useState<WorkersStore>(() => new DefaultWorkersStore());

  useEffect(() => () => store.dispose(), [store]);

  return (
    <>
      {store.errors.length > 0 && (
        <Flex vertical gap={3} className={classes.container}>
          {store.errors.map((error) => (
            <Flex align="center" key={error.handler} className={classes.row}>
              <div className={classes.line}>
                <span>{error.handler}</span>
                {error.message ? `: ${error.message}` : ""}
              </div>
              <NotBorderedIconButton
                onClick={() => store.remove(error.handler)}
                title={`Remove ${error.handler} errors`}
              >
                <CloseIcon color="white" />
              </NotBorderedIconButton>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  );
});
