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
      <Card
        selected={selection.id === "discord"}
        onClick={() => {
          selection.id = "discord";
          continuation.canContinue = true;
        }}
      >
        <CardTitle>Discord</CardTitle>
      </Card>
    </CardList>
  );
});

function randomBase64Url(bytes = 32) {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  // convert bytes to base64
  let b64 = btoa(String.fromCharCode(...arr));
  // make URL-safe and remove padding
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export interface sso {
  url: string;
  state: string;
  client_id: string;
  redirect_uri: string;
}

function openSSO(platform: string) {
  const state = uuidv7();
  localStorage.setItem(state, platform);
  switch (platform) {
    case "discord":
      window.open(
        `https://discord.com/oauth2/authorize?client_id=1491974259596198091&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&state=${state}&response_type=code&scope=identify%20email%20guilds`,
      );
      return Promise.resolve(true);
    case "vklive":
      window.open(
        `https://auth.live.vkvideo.ru/app/oauth2/authorize?client_id=5hdd7dm7bb4w1i9z&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&state=${state}`,
      );
      return Promise.resolve(true);
    case "twitch":
      window.open(
        `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=2f9aljaudj3678kp4gc9bj99tb7bev&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&scope=channel:read:redemptions+user:read:email+moderator:read:shoutouts+moderator:read:followers+channel:read:predictions+channel:read:hype_train+channel:read:goals+bits:read+channel:read:polls+user:read:chat+user:bot&state=${state}`,
      );
      return Promise.resolve(true);
    case "kick":
      const code_verifier = randomBase64Url();
      return sha256(code_verifier)
        .then((code_challenge) => {
          localStorage.setItem("code_challenge", code_verifier);
          window.open(
            `https://id.kick.com/oauth/authorize?response_type=code&code_challenge=${code_challenge}&code_challenge_method=S256&client_id=01KGJ3VGHMWQ3DATBFVNJYMG41&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&scope=user:read+channel:read+channel:rewards:read+channel:rewards:write+events:subscribe+kicks:read&state=${state}`,
          );
        })
        .then(() => true);
    default:
      return Promise.resolve(true);
  }
}

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
              return openSSO(selection.id);
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
