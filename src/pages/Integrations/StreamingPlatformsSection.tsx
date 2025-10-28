import { observer } from "mobx-react-lite";
import {
  Card,
  CardList,
  CardSectionTitle,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { StreamingIntegrationsWizard } from "./StreamingIntegrationsWizard";
import { TokenStoreContext } from "../../stores/TokenStore";
import { useContext, useState } from "react";
import { Flex, Switch } from "antd";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import CloseIcon from "../../icons/CloseIcon";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Warning,
} from "../../components/Overlay/Overlay";

export const StreamingPlatformsSection = observer(({}) => {
  const tokenStore = useContext(TokenStoreContext);
  const parentModalState = useContext(ModalStateContext);
  const [deleteRuleDialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [selection, setSelection] = useState<string>("");
  return (
    <>
      <ModalStateContext.Provider value={deleteRuleDialogState}>
        <Overlay>
          <Warning
            onCancel={() => {
              setSelection("");
            }}
            action={() => {
              deleteRuleDialogState.show = false;
              tokenStore?.deleteToken(selection);
            }}
          >
            Вы точно хотите удалить интеграцию?
          </Warning>
        </Overlay>
      </ModalStateContext.Provider>
      <CardSectionTitle>Стриминговые платформы</CardSectionTitle>
      <CardList>
        {tokenStore?.tokens
          .filter(
            (token) =>
              token.system === "Twitch" ||
              token.system === "YouTube" ||
              token.system === "VKLive",
          )
          .map((token) => (
            <Card key={token.id} onClick={() => {}}>
              <Flex
                style={{ height: "fit-content" }}
                justify="space-between"
                className="full-width"
                align="center"
              >
                <Flex gap={9} align="center" style={{ height: "fit-content" }}>
                  <CardTitle>{token.system}</CardTitle>
                  <Switch
                    value={token.enabled}
                    onChange={() =>
                      tokenStore.toggleToken(token.id, !token.enabled)
                    }
                  />
                </Flex>
                <BorderedIconButton
                  onClick={() => {
                    setSelection(token.id);
                    deleteRuleDialogState.show = true;
                  }}
                >
                  <CloseIcon color="#FF8888" />
                </BorderedIconButton>
              </Flex>
            </Card>
          ))}
        <StreamingIntegrationsWizard />
      </CardList>
    </>
  );
});
