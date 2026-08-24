import {
  getApps,
  changeOidcAppSettings,
  deregisterOidcApplication,
  refreshClientSecret,
  registerOidcApplication,
} from "@opendonationassistant/subscriptions-service";
import { makeAutoObservable } from "mobx";

export interface AppStore {
  apps: UserApp[];
  addApp(name: string, description: string): Promise<void>;
  changeAppSettings(
    app: UserApp,
    name: string,
    description: string,
    redirectUris: string[],
  ): Promise<void>;
  removeApp(app: UserApp): Promise<void>;
  refreshClientSecret(app: UserApp): Promise<string>;
}

export interface UserApp {
  id: string;
  clientId: string;
  name?: string | null;
  description?: string | null;
  redirectUris?: string[] | null;
  clientSecret?: string | null;
}

export class DefaultAppStore {
  private _apps: UserApp[] = [];
  private _token: string;

  constructor(token: string) {
    this._token = token;
    makeAutoObservable(this);
    this.refresh();
  }

  private async refresh() {
    const { data } = await getApps({
      baseURL: process.env.REACT_APP_SUBSCRIPTIONS_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    });
    const apps = data?.content;
    if (!apps) return;
    this._apps = apps as UserApp[];
  }

  public get apps() {
    return this._apps;
  }

  public async addApp(name: string, description: string) {
    await registerOidcApplication({
      baseURL: process.env.REACT_APP_SUBSCRIPTIONS_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: {
        clientName: name,
        redirectUris: [],
        description: description,
      },
    });
    await this.refresh();
  }

  public async changeAppSettings(
    app: UserApp,
    name: string,
    description: string,
    redirectUris: string[],
  ) {
    await changeOidcAppSettings({
      baseURL: process.env.REACT_APP_SUBSCRIPTIONS_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: {
        id: app.id,
        name,
        description,
        redirectUris,
      },
    });
    const index = this._apps.findIndex((a) => a.id === app.id);
    if (index !== -1) {
      this._apps[index] = {
        ...this._apps[index],
        name,
        description,
        redirectUris,
      };
    }
  }

  public async refreshClientSecret(app: UserApp): Promise<string> {
    const { data } = await refreshClientSecret({
      baseURL: process.env.REACT_APP_SUBSCRIPTIONS_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: {
        id: app.id,
      },
    });
    const secret = data?.clientSecret;
    if (!secret) {
      throw new Error("No client secret returned");
    }
    const index = this._apps.findIndex((a) => a.id === app.id);
    if (index !== -1) {
      this._apps[index] = {
        ...this._apps[index],
        clientSecret: secret.slice(-6),
      };
    }
    return secret;
  }

  public async removeApp(app: UserApp) {
    await deregisterOidcApplication({
      baseURL: process.env.REACT_APP_SUBSCRIPTIONS_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: {
        clientId: app.clientId,
      },
    });
    this._apps = this._apps.filter((a) => a.clientId !== app.clientId);
  }
}
