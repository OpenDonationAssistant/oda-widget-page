import { CardSection } from "../../components/Cards/CardsComponent";
import { observer } from "mobx-react-lite";
import { DonationPlatformsSection } from "./DonationPlatformsSection";
import { StreamingPlatformsSection } from "./StreamingPlatformsSection";
import { useTokenStore } from "../../stores/TokenStore";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { GamesSection } from "./GamesSection";
import { useTranslation } from "react-i18next";
import {
  DefaultGamesStore,
  GamesStore,
  GamesStoreContext,
} from "../../stores/GamesStore";

export const IntegrationsPage = observer(() => {
  const { t } = useTranslation();
  const { store: tokenStore } = useTokenStore();
  const [gamesStore] = useState<GamesStore>(
    () => new DefaultGamesStore(tokenStore),
  );
  const { features } = useLoaderData() as WidgetData;

  return (
    <GamesStoreContext.Provider value={gamesStore}>
      <h1>{t("menu-integrations")}</h1>
      <CardSection>
        <DonationPlatformsSection />
        <StreamingPlatformsSection />
        {features.find((f) => f.name === "GamesIntegration")?.state ===
          "ENABLED" && <GamesSection />}
      </CardSection>
    </GamesStoreContext.Provider>
  );
});
