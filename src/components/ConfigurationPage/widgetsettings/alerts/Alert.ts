import { uuidv7 } from "uuidv7";
import { DEFAULT_PROPERTIES } from "./DefaultProperties";

export interface Trigger{
  amount: number;
}

export class Alert {

  private _id: string | null = null;
  audio: string | null = null;
  image: string | null = null;
  video: string | null = null;
  trigger: Trigger = { amount: 10 };
  properties: any[] = DEFAULT_PROPERTIES;

  constructor({
    id,
    audio,
    image,
    video,
    trigger,
    properties,
  }:{
    id?:string;
    audio?: string;
    image?: string;
    video?: string;
    trigger?: Trigger;
    properties?: any[];
  }){
    this._id = id || uuidv7();
    this.audio = audio || null;
    this.image = image || null;
    this.video = video || null;
    this.trigger = trigger || { amount: 10 };
    this.properties = this.mergeWithDefault(properties);
  }

  public get id(): string | null {
      return this._id;
  }

  private mergeWithDefault(properties?: any[]): any[]{
    const props = new Map<string, any>();
    properties?.forEach((it) => {
      props.set(it.name, it);
    })
    return DEFAULT_PROPERTIES.map(prop => {
      return props.get(prop.name) ?? prop;
    });
  }
}
