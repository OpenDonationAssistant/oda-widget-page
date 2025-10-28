import { observer } from "mobx-react-lite";
import {
  Card,
  CardButton,
  CardList,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import {
  Continuation,
  ContinuationContext,
  Wizard,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { useContext, useState } from "react";
import { SelectedIndexContext } from "../../stores/SelectedIndexStore";
import { log } from "../../logging";
import { uuidv7 } from "uuidv7";

export const ChooseStreamingPlatformComponent = observer(({}) => {
  const continuation = useContext(ContinuationContext);
  const selection = useContext(SelectedIndexContext);

  return (
    <CardList>
      <Card
        selected={selection.id === "twitch"}
        onClick={() => {
          selection.id = "twitch";
          continuation.canContinue = true;
        }}
      >
        <CardTitle>Twitch</CardTitle>
      </Card>
      <Card
        selected={selection.id === "vklive"}
        onClick={() => {
          selection.id = "vklive";
          continuation.canContinue = true;
        }}
      >
        <CardTitle>VKLive</CardTitle>
      </Card>
    </CardList>
  );
});

export const StreamingIntegrationsWizard = observer(({}) => {
  const [continuation] = useState<Continuation>(() => new Continuation());
  const selection = useContext(SelectedIndexContext);

  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    () =>
      new WizardConfigurationStore({
        steps: [
          {
            title: "Добавить платформу",
            subtitle:
              "Выберите стриминговую платформу, которую хотите добавить",
            content: <ChooseStreamingPlatformComponent />,
            handler: () => {
              if (selection.id === null) {
                return Promise.resolve(false);
              }
              const state = uuidv7();
              if (selection.id === "vklive") {
                log.debug("opening vklive");
                localStorage.setItem(state, "vklive");
                window.open(
                  "https://auth.live.vkvideo.ru/app/oauth2/authorize?client_id=5hdd7dm7bb4w1i9z&redirect_uri=https://widgets.oda.digital/configuration/integrations&state=" +
                    state,
                );
                return Promise.resolve(true);
              }
              if (selection.id === "twitch") {
                log.debug("opening twitch");
                localStorage.setItem(state, "twitch");
                window.open(
                  "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=2f9aljaudj3678kp4gc9bj99tb7bev&redirect_uri=https://widgets.oda.digital/configuration/integrations/twitch&scope=channel%3Aread%3Aredemptions+user%3Aread%3Aemail+moderator%3Aread%3Ashoutouts+moderator%3Aread%3Afollowers+channel%3Aread%3apredictions+channel%3Aread%3Ahype_train+channel%3Aread%3Agoals+bits%3Aread+channel%3Aread%3Apolls&state=" +
                    state,
                );
                return Promise.resolve(true);
              }
              return Promise.resolve(true);
            },
          },
        ],
        dynamicStepAmount: true,
        reset: () => {
          selection.id = null;
          continuation.canContinue = false;
        },
        continuationContext: continuation,
      }),
  );
  return (
    <ContinuationContext.Provider value={continuation}>
      <Wizard configurationStore={wizardConfiguration} />
      <CardButton onClick={() => wizardConfiguration.next()} />
    </ContinuationContext.Provider>
  );
});
