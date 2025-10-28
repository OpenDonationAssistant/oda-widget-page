import { CardSection } from "../../components/Cards/CardsComponent";
import { observer } from "mobx-react-lite";
import { DonationPlatformsSection } from "./DonationPlatformsSection";
import { StreamingPlatformsSection } from "./StreamingPlatformsSection";
import {
  DefaultTokenStore,
  TokenStore,
  TokenStoreContext,
} from "../../stores/TokenStore";
import { useState } from "react";
import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";

export const IntegrationsPage = observer(({}) => {
  const navigate = useNavigate();
  const [tokenStore] = useState<TokenStore>(() => new DefaultTokenStore());
  const { recipientId } = useLoaderData() as WidgetData;

  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");
  const code = params.get("code");
  if (state) {
    const platform = localStorage.getItem(state);
    localStorage.removeItem(state);
    if (platform === "twitch" && code) {
      RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
        .getTwitchToken({
          authorizationCode: code,
        })
        .then(() => navigate(0));
    }
    if (platform === "vklive" && code) {
      RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
        .getVKLiveToken({
          authorizationCode: code,
        })
        .then(() => navigate(0));
    }
  }

  return (
    <TokenStoreContext.Provider value={tokenStore}>
      <h1>Интеграции</h1>
      <CardSection>
        <DonationPlatformsSection />
        {recipientId &&
          (recipientId === "tabularussia" || recipientId === "testuser") && (
            <StreamingPlatformsSection />
          )}
      </CardSection>
    </TokenStoreContext.Provider>
  );
});
