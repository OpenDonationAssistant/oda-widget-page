import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Flex } from "antd";
import classes from "./ConnectionErrorsPanel.module.css";
import { DefaultWorkersStore, WorkersStore } from "../../stores/WorkersStore";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import { sendMessageToWorker } from "../../worker";
import { useAuth } from "../../contexts/AuthContext";

export default observer(function ConnectionErrorsPanel() {
  const [store] = useState<WorkersStore>(() => new DefaultWorkersStore());
  const { accessToken } = useAuth();

  useEffect(() => () => store.dispose(), [store]);

  const restart = (handler: string) => {
    sendMessageToWorker({ type: "Reload", handler, accessToken });
  };

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
              <Flex align="center" gap={6}>
                <Button
                  size="small"
                  onClick={() => restart(error.handler)}
                  title={`Restart ${error.handler}`}
                >
                  Restart
                </Button>
                <NotBorderedIconButton
                  onClick={() => store.remove(error.handler)}
                  title={`Remove ${error.handler} errors`}
                >
                  <CloseIcon color="white" />
                </NotBorderedIconButton>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  );
});
