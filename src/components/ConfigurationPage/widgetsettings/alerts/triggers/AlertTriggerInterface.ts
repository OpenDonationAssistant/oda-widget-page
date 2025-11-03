import { ReactNode, createContext } from "react";

export interface Amount {
  major: number;
  currency: string;
}

export interface DonationEvent {
  id: string;
  amount: Amount;
}

export interface TriggerType {
  description: string;
  type: string;
}

export interface Trigger {
  type: TriggerType;
  isTriggered(event: DonationEvent): boolean;
  markup(): ReactNode;
  compare(other: Trigger): number;
}
