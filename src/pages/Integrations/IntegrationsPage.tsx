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
  WizardConfiguration,
  WizardConfigurationStep,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { createContext, useContext, useEffect, useState } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import {
  Dialog,
  ModalState,
  ModalStateContext,
  Overlay,
  Title,
} from "../../components/Overlay/Overlay";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { Flex } from "antd";

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
  const [params] = useSearchParams();
  const parentModalState = useContext(ModalStateContext);
  const [state] = useState<ModalState>(new ModalState(parentModalState));
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");
    if (code) {
      RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
        .getDonationAlertsToken({
          authorizationCode: code,
        })
        .then((response) => {
          state.show = true;
        });
    }
  }, [params]);

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
                "https://www.donationalerts.com/oauth/authorize?client_id=13593&redirect_uri=https%3A%2F%2Fwidgets.oda.digital%2Fconfiguration%2Fintegrations&response_type=code&scope=oauth-donation-subscribe oauth-user-show",
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
          <CardButton
            onClick={() => {
              wizardConfiguration.next();
            }}
          />
        </CardList>
      </CardSection>
      <Wizard configurationStore={wizardConfiguration} />
      <ModalStateContext.Provider value={state}>
        <Overlay>
          <Dialog>
            <Title>Подключение успешно</Title>
            <div style={{ height: "200px" }}></div>
            <Flex className="full-width" justify="flex-end">
              <PrimaryButton
                onClick={() => {
                  navigate(0);
                }}
              >
                Ok
              </PrimaryButton>
            </Flex>
          </Dialog>
        </Overlay>
      </ModalStateContext.Provider>
    </>
  );
}
