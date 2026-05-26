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
import { GamesSection } from "./GamesSection";
import {
  DefaultGamesStore,
  GamesStore,
  GamesStoreContext,
} from "../../stores/GamesStore";

export const IntegrationsPage = observer(() => {
  const [tokenStore] = useState<TokenStore>(() => new DefaultTokenStore());
  const [gamesStore] = useState<GamesStore>(
    () => new DefaultGamesStore(tokenStore),
  );
  const { features } = useLoaderData() as WidgetData;

  return (
    <TokenStoreContext.Provider value={tokenStore}>
      <GamesStoreContext.Provider value={gamesStore}>
        <h1>Интеграции</h1>
        <CardSection>
          <DonationPlatformsSection />
          {features.find((f) => f.name === "TwitchIntegration")?.state ===
            "ENABLED" && <StreamingPlatformsSection />}
          {features.find((f) => f.name === "GamesIntegration")?.state ===
            "ENABLED" && <GamesSection />}
        </CardSection>
      </GamesStoreContext.Provider>
    </TokenStoreContext.Provider>
  );
});
