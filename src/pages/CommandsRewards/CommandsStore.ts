import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { uuidv7 } from "uuidv7";
import { ObjectWrapper } from "../../utils";
import { useAuth } from "../../contexts/AuthContext";
import { ListItemData, ListItemsStore } from "../../components/List/FilledList";
import { CardData, CardsStore } from "../../components/Cards/FilledCards";

export class Command implements ListItemData, CardData {
  private _id: string;
  private _title: string;
  private _enabled: boolean;

  constructor(id?: string, title: string = "Без названия") {
    this._id = id ?? uuidv7();
    this._title = title;
    this._enabled = true;
    makeAutoObservable(this);
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public set title(title: string) {
    this._title = title;
  }

  public get enabled() {
    return this._enabled;
  }

  public set enabled(enabled: boolean) {
    this._enabled = enabled;
  }
}

export class CommandsStore implements ListItemsStore, CardsStore {
  private _commands: Command[] = [];
  private _token: string;

  constructor(token: string) {
    this._token = token;
    makeAutoObservable(this);
    this.load();
  }

  public load() {
    // TODO: implement loading of commands
  }

  public save() {
    // TODO: implement saving of commands
  }

  public get items(): Command[] {
    return this._commands;
  }

  public remove(id: string) {
    const index = this._commands.findIndex((command) => command.id === id);
    if (index >= 0) {
      this._commands.splice(index, 1);
    }
  }
}

export const CommandsStoreContext = createContext<ObjectWrapper<CommandsStore>>(
  new ObjectWrapper<CommandsStore>(null),
);

export function useCommandsStore() {
  const { accessToken } = useAuth();
  const context = useContext(CommandsStoreContext);
  if (!context.value) {
    if (!accessToken) {
      throw new Error("useCommandsStore must be used within an AuthProvider");
    }
    context.value = new CommandsStore(accessToken);
  }
  return { store: context.value };
}
