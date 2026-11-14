import { observer } from "mobx-react-lite";
import {
  Card,
  CardList,
  CardSectionTitle,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { StreamingIntegrationsWizard } from "./StreamingIntegrationsWizard";
import { useTokenStore } from "../../stores/TokenStore";
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
import TwitchIcon from "../../icons/TwitchIcon";
import YouTubeIcon from "../../icons/YouTubeIcon";
import KickIcon from "../../icons/KickIcon";
import VKLiveIcon from "../../icons/VKLiveIcon";
import { useTranslation } from "react-i18next";

const icons = new Map<string, JSX.Element>();
icons.set("Twitch", <TwitchIcon />);
icons.set("YouTube", <YouTubeIcon />);
icons.set("Kick", <KickIcon />);
icons.set("VKLive", <VKLiveIcon />);

export const StreamingPlatformsSection = observer(() => {
  const { t } = useTranslation();
  const { store: tokenStore } = useTokenStore();
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
              tokenStore.deleteToken(selection);
            }}
          >
            {t("integration-delete-confirm")}
          </Warning>
        </Overlay>
      </ModalStateContext.Provider>
      <CardSectionTitle>
        <span>{t("integration-streaming-platforms")}</span>
      </CardSectionTitle>
      <CardList>
        {tokenStore.tokens
          .filter(
            (token) =>
              token.system === "Twitch" ||
              token.system === "YouTube" ||
              token.system === "Discord" ||
              token.system === "Kick" ||
              token.system === "VKLive",
          )
          .map((token) => (
            <Card key={token.id}>
              <Flex
                style={{ height: "fit-content" }}
                justify="space-between"
                className="full-width"
                align="center"
              >
                <Flex gap={9} align="center" style={{ height: "fit-content" }}>
                  {icons.get(token.system)}
                  <CardTitle>{token.settings.name ?? token.system}</CardTitle>
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
