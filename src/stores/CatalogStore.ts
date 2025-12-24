import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { DefaultApiFactory } from "@opendonationassistant/oda-files-service-client";

export interface CatalogItem {
  id: string;
  type: string;
  url: string;
  category: string;
  recipientId: string;
}

export interface CatalogStore {
  items: CatalogItem[];
  loadPage(page: number): void;
}

export class DefaultCatalogStore implements CatalogStore {
  private _catalog: CatalogItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get items() {
    return this._catalog;
  }

  private client() {
    return DefaultApiFactory(
      undefined,
      process.env.REACT_APP_FILE_API_ENDPOINT,
    );
  }

  public loadPage(page: number): void {
    this.load();
  }

  public load() {
    this.client()
      .getCatalog()
      .then((response) => {
        this._catalog = response.data;
      });
  }
}

export const CatalogStoreContext = createContext<CatalogStore>(
  new DefaultCatalogStore(),
);
