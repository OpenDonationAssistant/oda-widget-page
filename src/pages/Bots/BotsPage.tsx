import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { CardList } from "../../components/Cards/CardsComponent";
import { AddBotWizard } from "./AddBotWizard";
import { BotStore, BotStoreContext } from "../../stores/BotStore";
import { useState } from "react";
import { BotCard } from "./BotCard";

export const BotsPage = observer(() => {
  const { t } = useTranslation();
  const [botStore] = useState<BotStore>(() => new BotStore());

  return (
    <>
      <h1>{t("menu-bots")}</h1>
      <BotStoreContext.Provider value={botStore}>
        <CardList>
          {botStore.bots.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
          <AddBotWizard />
        </CardList>
      </BotStoreContext.Provider>
    </>
  );
});
