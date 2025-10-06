import {
  CardSection,
} from "../../components/Cards/CardsComponent";
import { observer } from "mobx-react-lite";
import { DonationPlatformsSection } from "./DonationPlatformsSection";
import { GamesSection } from "./GamesSection";

export const IntegrationsPage = observer(({}) => {
  return (
    <>
      <h1>Интеграции</h1>
      <CardSection>
        <DonationPlatformsSection />
      </CardSection>
    </>
  );
});
