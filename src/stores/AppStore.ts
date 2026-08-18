import {
  client,
  getApps,
  registerOidcApplication,
} from "@opendonationassistant/subscriptions-service";
import { makeAutoObservable } from "mobx";

export interface AppStore {
  apps: UserApp[];
  addApp(name: string, description: string): Promise<void>;
}

export interface UserApp {
  clientId: string;
  clientInternalId: string;
  name?: string | null;
  description?: string | null;
}

export class DefaultAppStore {
  private _apps: UserApp[] = [];

  constructor(token: string) {
    console.log({ token: token }, "Creating app store");
    client.setConfig({
      baseURL: process.env.REACT_APP_SUBSCRIPTIONS_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    makeAutoObservable(this);
    this.load();
  }

  private async load() {
    const { data } = await getApps({});
    const apps = data?.content;
    if (!apps) return;
    this._apps = apps;
  }

  public get apps() {
    return this._apps;
  }

  public async addApp(name: string, description: string) {
    await registerOidcApplication({
      body: {
        clientName: name,
        redirectUris: [],
        description: description,
      },
    });
  }
}
