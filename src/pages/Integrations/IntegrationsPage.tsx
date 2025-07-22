import {
  Card,
  CardButton,
  CardList,
  CardSection,
  CardSectionTitle,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import {
  Wizard,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { createContext, useEffect, useState } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

import {
  DefaultApiFactory as RecipientService,
  TokenControllerTokenDto,
} from "@opendonationassistant/oda-recipient-service-client";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";

class IntegrationWizardStore {
  private _system: "donationalerts" | "donatepay" | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public set system(system: "donationalerts" | "donatepay" | null) {
    this._system = system;
  }

  public get system() {
    return this._system;
  }
}

const IntegrationWizardStoreContext = createContext(
  new IntegrationWizardStore(),
);

const ChooseDonationPlatformComponent = observer(
  ({ context }: { context: IntegrationWizardStore }) => {
    return (
      <CardList>
        <Card
          selected={context.system === "donationalerts"}
          onClick={() => (context.system = "donationalerts")}
        >
          <CardTitle>DonationAlerts</CardTitle>
        </Card>
      </CardList>
    );
  },
);

export default function IntegrationsPage({}) {
  const selection = new IntegrationWizardStore();
  const { recipientId } = useLoaderData() as WidgetData;
  const [tokens, setTokens] = useState<TokenControllerTokenDto[]>([]);

  useEffect(() => {
    RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
      .listTokens()
      .then((tokens) => {
        setTokens(tokens.data);
      });
  }, [recipientId]);

  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    new WizardConfigurationStore({
      steps: [
        {
          title: "Добавить донатную платформу",
          subtitle: "Выберите донатную платформу, которую хотите добавить",
          content: <ChooseDonationPlatformComponent context={selection} />,
          handler: () => {
            if (selection.system === "donationalerts") {
              window.open(
                "https://www.donationalerts.com/oauth/authorize?client_id=13593&redirect_uri=https%3A%2F%2Fwidgets.oda.digital&response_type=code&scope=oauth-donation-subscribe oauth-user-show",
              );
            }
          },
        },
      ],
    }),
  );

  return (
    <>
      <h1>Интеграции</h1>
      <CardSection>
        <CardSectionTitle>Донатные платформы</CardSectionTitle>
        <CardList>
          {tokens.map((token) => (
            <Card onClick={() => {}}>
              <CardTitle>{token.system}</CardTitle>
            </Card>
          ))}
          <CardButton
            onClick={() => {
              wizardConfiguration.next();
            }}
          />
        </CardList>
      </CardSection>
      <Wizard configurationStore={wizardConfiguration} />
    </>
  );
}
