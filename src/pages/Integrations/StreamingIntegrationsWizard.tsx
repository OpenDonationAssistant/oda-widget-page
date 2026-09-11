import { makeAutoObservable, reaction, runInAction } from "mobx";
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
import { createContext, useContext, useEffect, useState } from "react";
import { SelectedIndexContext } from "../../stores/SelectedIndexStore";
import { uuidv7 } from "uuidv7";
import { Input } from "antd";
import { TokenStore, TokenStoreContext } from "../../stores/TokenStore";
import classes from "./IntegrationsWizard.module.css";

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
// <Card
//   selected={selection.id === "youtube"}
//   onClick={() => {
//     selection.id = "youtube";
//     continuation.canContinue = true;
//   }}
// >
//   <CardTitle>YouTube</CardTitle>
// </Card>

function base64urlEncode(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomBase64Url(bytes = 64) {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return base64urlEncode(arr);
}

async function sha256(str: string) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return base64urlEncode(new Uint8Array(hashBuffer));
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
        `https://auth.live.vkvideo.ru/app/oauth2/authorize?client_id=5hdd7dm7bb4w1i9z&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&scope=channel:points:rewards,channel:points,channel:roles,channel:points:rewards:demands&state=${state}`,
      );
      return Promise.resolve(true);
    case "youtube":
      window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=260836533562-3cu1bfnpi16vgi6r8u6nqk4a9rn1ur8p.apps.googleusercontent.com&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&scope=https://www.googleapis.com/auth/youtube.readonly&state=${state}`,
      );
      return Promise.resolve(true);
    case "twitch":
      window.open(
        `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=2f9aljaudj3678kp4gc9bj99tb7bev&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&scope=channel:moderate+channel:manage:vips+channel:manage:redemptions+user:read:email+moderator:manage:shoutouts+moderator:read:followers+channel:manage:predictions+channel:read:hype_train+channel:read:subscriptions+channel:manage:raids+channel:read:goals+bits:read+channel:manage:polls+user:read:chat+user:write:chat+moderator:manage:chat_messages+user:bot&state=${state}`,
      );
      return Promise.resolve(true);
    case "kick":
      const code_verifier = randomBase64Url();
      return sha256(code_verifier)
        .then((code_challenge) => {
          localStorage.setItem("code_challenge", code_verifier);
          console.log({ code_verifier, code_challenge }, "kick sso");
          window.open(
            `https://id.kick.com/oauth/authorize?response_type=code&code_challenge=${code_challenge}&code_challenge_method=S256&client_id=01KGJ3VGHMWQ3DATBFVNJYMG41&redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT}&scope=user:read+channel:read+channel:rewards:read+channel:rewards:write+events:subscribe+kicks:read&state=${state}`,
          );
        })
        .then(() => true);
    default:
      return Promise.resolve(true);
  }
}

class YouTubeWizardStore {
  private _handle: string = "";
  private _apiKey: string = "";
  private _resolvedChannelId: string | null = null;
  private _resolvedChannelTitle: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get handle() {
    return this._handle;
  }
  public set handle(value: string) {
    this._handle = value;
  }

  public get apiKey() {
    return this._apiKey;
  }
  public set apiKey(value: string) {
    this._apiKey = value;
  }

  public get resolvedChannelId() {
    return this._resolvedChannelId;
  }
  public set resolvedChannelId(value: string | null) {
    this._resolvedChannelId = value;
  }

  public get resolvedChannelTitle() {
    return this._resolvedChannelTitle;
  }
  public set resolvedChannelTitle(value: string | null) {
    this._resolvedChannelTitle = value;
  }
}

// ---------------------------------------------------------------------------
// YouTube wizard step components
// ---------------------------------------------------------------------------

export const YouTubeHandleInputComponent = observer(() => {
  const wizardStore = useContext(YouTubeWizardStoreContext);

  return (
    <div className={`${classes.content}`}>
      <div className={`${classes.instruction}`}>
        Укажите хэндл (handle) вашего YouTube-канала. Это часть URL вашего
        канала после <code>@</code>, например{" "}
        <code style={{ userSelect: "text" }}>@MyChannel</code>.
        <br />
        <br />
        Хэндл будет использован для автоматического поиска вашего канала в
        YouTube.
      </div>
      <Input
        placeholder="@handle канала"
        value={wizardStore.handle}
        onChange={(e) => (wizardStore.handle = e.target.value)}
        style={{ marginTop: 12 }}
      />
    </div>
  );
});

export const YouTubeApiKeyInputComponent = observer(() => {
  const wizardStore = useContext(YouTubeWizardStoreContext);

  return (
    <div className={`${classes.content}`}>
      <div className={`${classes.instruction}`}>
        Для подключения YouTube необходим ключ API Google (Google API Key).
        <br />
        <br />
        Чтобы получить ключ API:
        <br />
        <br />
        1. Откройте{" "}
        <a
          href="https://console.cloud.google.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Cloud Console
        </a>{" "}
        и войдите в свой аккаунт Google.
        <br />
        <br />
        2. Создайте новый проект (или выберите существующий): нажмите{" "}
        <b>SELECT PROJECT</b> → <b>New Project</b>, введите название и нажмите{" "}
        <b>CREATE</b>.
        <br />
        <br />
        3. В левом меню перейдите в <b>APIs &amp; Services</b> → <b>Library</b>.
        Найдите <b>YouTube Data API v3</b> и нажмите <b>ENABLE</b>.
        <br />
        <br />
        4. Перейдите в <b>APIs &amp; Services</b> → <b>Credentials</b>. Нажмите{" "}
        <b>CREATE CREDENTIALS</b> → <b>API key</b>. Скопируйте сгенерированный
        ключ.
        <br />
        <br />
        5. Вставьте скопированный ключ в поле ниже.
      </div>
      <Input
        placeholder="Google API Key"
        value={wizardStore.apiKey}
        onChange={(e) => (wizardStore.apiKey = e.target.value)}
        style={{ marginTop: 12 }}
      />
    </div>
  );
});

export const YouTubeSuccessComponent = observer(() => {
  const wizardStore = useContext(YouTubeWizardStoreContext);

  return (
    <div className={`${classes.content}`}>
      <div className={`${classes.instruction}`}>
        YouTube-канал успешно подключён!
        <br />
        <br />
        Канал: {wizardStore.resolvedChannelTitle} (
        {wizardStore.resolvedChannelId})
        <br />
        Хэндл: {wizardStore.handle}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// YouTube wizard store context
// ---------------------------------------------------------------------------

const YouTubeWizardStoreContext = createContext(new YouTubeWizardStore());

// ---------------------------------------------------------------------------
// Channel handle → channel ID resolver (YouTube Data API v3)
// ---------------------------------------------------------------------------

async function resolveYouTubeChannel(
  apiKey: string,
  handle: string,
): Promise<{ channelId: string; title: string } | null> {
  const cleanHandle = handle.replace(/^@/, "");
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=channel&q=${encodeURIComponent(cleanHandle)}` +
    `&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const json = await response.json();
  const item = json.items?.[0];
  if (!item?.id?.channelId) return null;
  return {
    channelId: item.id.channelId,
    title: item.snippet?.title ?? cleanHandle,
  };
}

// ---------------------------------------------------------------------------
// Main streaming integrations wizard
// ---------------------------------------------------------------------------

export const StreamingIntegrationsWizard = observer(() => {
  const [continuation] = useState<Continuation>(() => new Continuation());
  const selection = useContext(SelectedIndexContext);
  const tokenStore = useContext(TokenStoreContext);
  const [wizardStore] = useState<YouTubeWizardStore>(
    () => new YouTubeWizardStore(),
  );

  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    () =>
      new WizardConfigurationStore({
        steps: [
          // Step 1 — platform chooser
          {
            title: "Добавить платформу",
            subtitle:
              "Выберите стриминговую платформу, которую хотите добавить",
            content: <ChooseStreamingPlatformComponent />,
            handler: () => {
              if (selection.id === null) {
                return Promise.resolve(false);
              }
              if (selection.id === "youtube") {
                return Promise.resolve(true);
              }
              return openSSO(selection.id);
            },
          },
          // Step 2 — YouTube channel handle
          {
            title: "Добавить YouTube",
            subtitle: "Укажите хэндл вашего YouTube-канала",
            content: <YouTubeHandleInputComponent />,
            condition: () => Promise.resolve(selection.id === "youtube"),
            handler: () => {
              if (!wizardStore.handle) return Promise.resolve(false);
              return Promise.resolve(true);
            },
          },
          // Step 3 — YouTube API key
          {
            title: "Добавить YouTube",
            subtitle: "Введите Google API Key",
            content: <YouTubeApiKeyInputComponent />,
            condition: () => Promise.resolve(selection.id === "youtube"),
            handler: async () => {
              if (!wizardStore.apiKey) return false;
              const result = await resolveYouTubeChannel(
                wizardStore.apiKey,
                wizardStore.handle,
              );
              if (!result) {
                return false;
              }
              runInAction(() => {
                wizardStore.resolvedChannelId = result.channelId;
                wizardStore.resolvedChannelTitle = result.title;
              });
              tokenStore?.addToken("GoogleApiKey", wizardStore.apiKey, {
                channelId: result.channelId,
                name: result.title,
                handle: wizardStore.handle,
              } as unknown as { [key: string]: object });
              continuation.canContinue = true;
              return true;
            },
          },
          // Step 4 — success (information step)
          {
            title: "Добавить YouTube",
            subtitle: "YouTube-канал подключён",
            content: <YouTubeSuccessComponent />,
            condition: () => Promise.resolve(selection.id === "youtube"),
            isInformation: true,
          },
        ],
        dynamicStepAmount: true,
        reset: () => {
          selection.id = null;
          continuation.canContinue = false;
          wizardStore.handle = "";
          wizardStore.apiKey = "";
          wizardStore.resolvedChannelId = null;
          wizardStore.resolvedChannelTitle = null;
        },
        continuationContext: continuation,
      }),
  );

  // Enable "Next" while typing the channel handle (YouTube step)
  useEffect(() => {
    const dispose = reaction(
      () => wizardStore.handle,
      (handle) => {
        if (
          selection.id === "youtube" &&
          wizardStore.resolvedChannelId === null
        ) {
          continuation.canContinue = handle.length > 0;
        }
      },
    );
    return dispose;
  }, [wizardStore, continuation, selection.id]);

  // Enable "Next" while typing the API key (YouTube step)
  useEffect(() => {
    const dispose = reaction(
      () => wizardStore.apiKey,
      (apiKey) => {
        if (
          selection.id === "youtube" &&
          wizardStore.resolvedChannelId === null
        ) {
          continuation.canContinue = apiKey.length > 0;
        }
      },
    );
    return dispose;
  }, [wizardStore, continuation, selection.id]);

  return (
    <YouTubeWizardStoreContext.Provider value={wizardStore}>
      <ContinuationContext.Provider value={continuation}>
        <Wizard configurationStore={wizardConfiguration} />
        <CardButton onClick={() => wizardConfiguration.next()} />
      </ContinuationContext.Provider>
    </YouTubeWizardStoreContext.Provider>
  );
});
