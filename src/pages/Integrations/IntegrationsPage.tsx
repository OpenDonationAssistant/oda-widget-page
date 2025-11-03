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
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";

export const IntegrationsPage = observer(({}) => {
  const [tokenStore] = useState<TokenStore>(() => new DefaultTokenStore());
  const { recipientId } = useLoaderData() as WidgetData;

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
