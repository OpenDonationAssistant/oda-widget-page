import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { ObjectWrapper } from "../../utils";
import { log } from "../../logging";
import { useAuth } from "../../contexts/AuthContext";
import { Loadable } from "../../components/Loading/LoadingComponent";
import type { Panel, PanelPayload } from "./types";
import {
  PanelDto,
  createPanel,
  deletePanel,
  getPanel,
  listPanels,
  updatePanel,
} from "@opendonationassistant/automation-service";

export interface PanelStore {
  panels: Panel[];
  loading: boolean;
  error: string | null;
  load(): Promise<void>;
  loadOne(id: string): Promise<Panel>;
  create(payload: PanelPayload): Promise<Panel>;
  update(id: string, payload: PanelPayload): Promise<Panel>;
  remove(id: string): Promise<void>;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export class DefaultPanelStore implements PanelStore, Loadable {
  private _panels: Panel[] = [];
  private _loading: boolean = false;
  private _error: string | null = null;
  private _token: string;

  constructor(token: string) {
    makeAutoObservable(this);
    this._token = token;
  }

  public get panels(): Panel[] {
    return this._panels;
  }

  public get loading(): boolean {
    return this._loading;
  }

  public get error(): string | null {
    return this._error;
  }

  public load(): Promise<void> {
    log.debug("loading panels");
    this._loading = true;
    return this.withErrorHandling(() =>
      listPanels({
        baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        query: {
          size: 100,
          page: 0,
        },
      }),
    )
      .then((response) => {
        this._panels =
          response.data?.content.map((panel) => this.convert(panel)) ?? [];
        log.debug({ panels: this._panels }, "panels loaded");
      })
      .catch((error: unknown) => {
        log.error(error, "failed to load panels");
      })
      .finally(() => {
        this._loading = false;
      });
  }

  public loadOne(id: string): Promise<Panel> {
    return this.withErrorHandling(() =>
      getPanel({
        baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        path: {
          id,
        },
      }).then((response) => {
        if (response.data) {
          return this.convert(response.data);
        } else {
          throw new Error("Panel not found");
        }
      }),
    );
  }

  public async create(payload: PanelPayload): Promise<Panel> {
    const created = await this.withErrorHandling(() =>
      createPanel({
        baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        body: payload,
      }).then((response) => {
        if (response.data) {
          return { id: response.data.id, ...payload };
        } else {
          throw new Error("Panel not found");
        }
      }),
    );
    this._panels = [...this._panels, created];
    return created;
  }

  public async update(id: string, payload: PanelPayload): Promise<Panel> {
    const updated = await this.withErrorHandling(() =>
      updatePanel({
        baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        body: {
          id,
          ...payload,
        },
      }),
    );
    this._panels = this._panels.map((panel) =>
      panel.id === id ? { ...panel, ...updated } : panel,
    );
    return { id, ...payload };
  }

  public async remove(id: string): Promise<void> {
    await this.withErrorHandling(() =>
      deletePanel({
        baseURL: process.env.REACT_APP_AUTOMATION_API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        body: {
          command: {
            id,
          },
        },
      }),
    );
    this._panels = this._panels.filter((panel) => panel.id !== id);
  }

  /** Runs an API call, clearing `error` on start and capturing it on failure. */
  private async withErrorHandling<T>(operation: () => Promise<T>): Promise<T> {
    this._error = null;
    try {
      return await operation();
    } catch (error) {
      this._error = errorMessage(error);
      throw error;
    }
  }

  private convert(PanelDTO: PanelDto): Panel {
    return {
      cards: PanelDTO.cards.map((card) => {
        return {
          id: card.id,
          ruleId: card.ruleId,
          title: card.title ?? "",
        };
      }),
      id: PanelDTO.id,
      name: PanelDTO.name,
    };
  }
}

export const PanelStoreContext = createContext<ObjectWrapper<PanelStore>>(
  new ObjectWrapper<PanelStore>(null),
);

export function usePanelStore() {
  const { accessToken } = useAuth();
  const context = useContext(PanelStoreContext);
  if (!context.value) {
    if (!accessToken) {
      throw new Error("usePanelStore must be used within an AuthProvider");
    }
    context.value = new DefaultPanelStore(accessToken);
  }
  return { store: context.value };
}
