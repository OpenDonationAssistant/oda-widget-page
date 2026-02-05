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

export const ChooseStreamingPlatformComponent = observer(() => {
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
      <Card
        selected={selection.id === "kick"}
        onClick={() => {
          selection.id = "kick";
          continuation.canContinue = true;
        }}
      >
        <CardTitle>Kick</CardTitle>
      </Card>
    </CardList>
  );
});

export const StreamingIntegrationsWizard = observer(() => {
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
                  `https://auth.live.vkvideo.ru/app/oauth2/authorize?client_id=5hdd7dm7bb4w1i9z&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&state=${state}`,
                );
                return Promise.resolve(true);
              }
              if (selection.id === "twitch") {
                log.debug("opening twitch");
                localStorage.setItem(state, "twitch");
                window.open(
                  "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=2f9aljaudj3678kp4gc9bj99tb7bev&redirect_uri=https://widgets.oda.digital&scope=channel%3Aread%3Aredemptions+user%3Aread%3Aemail+moderator%3Aread%3Ashoutouts+moderator%3Aread%3Afollowers+channel%3Aread%3apredictions+channel%3Aread%3Ahype_train+channel%3Aread%3Agoals+bits%3Aread+channel%3Aread%3Apolls&state=" +
                    state,
                );
                return Promise.resolve(true);
              }
              if (selection.id === "youtube") {
              }
              if (selection.id === "kick") {
                log.debug("opening kick");
                localStorage.setItem(state, "kick");
                window.open(
                  "https://id.kick.com/oauth/authorize?response_type=code&client_id=01KGJ3VGHMWQ3DATBFVNJYMG41&redirect_uri=http://localhost:3001&scope=user%3Aread+channel%3Aread+events%3Asubscribe&code_challenge=019c254d-c165-75e4-be26-e6c5c68da338&code_challenge_method=plain&state=" +
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
