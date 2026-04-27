import { log } from "../logging";
import { subscribe } from "../socket";

export interface Variable {
  id: string;
  name: string;
  value: any;
  type: string;
}

export class Event {
  private _type: string;
  private _variables: Variable[];

  constructor(type: string, variables: Variable[]) {
    this._type = type;
    this._variables = variables;
  }

  public get type() {
    return this._type;
  }

  public get(name: string): string | number | null {
    return this._variables.find((it) => it.name === name)?.value ?? null;
  }
}

export interface EventBus {
  addListener(listener: (event: Event) => void): void;
}

export class DefaultEventBus implements EventBus {
  private listeners: ((event: Event) => void)[] = [];

  constructor(widgetId: string, topic: string) {
    subscribe(
      widgetId,
      topic,
      (message) => {
        log.debug({ message: message.body }, "events widgets received");
        this.listeners.forEach((listener) => {
          listener(this.convert(message.body));
        });
        message.ack();
      },
      { autoDelete: "true", durable: "false" },
    );
  }

  private convert(body: string): Event {
    const json = JSON.parse(body);
    return new Event(json.type, json.variables);
  }

  public addListener(listener: (event: Event) => void) {
    this.listeners.push(listener);
  }
}
