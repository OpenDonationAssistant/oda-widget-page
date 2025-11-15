import { ReactNode } from "react";

export interface Amount {
  major: number;
  currency: string;
}

export interface DonationEvent {
  id: string;
  amount: Amount;
  system: string;
}

export interface TriggerType {
  description: string;
  type: string;
}

export interface Trigger {
  type: string;
  description: string;
  isTriggered(event: DonationEvent): boolean;
  markup(): ReactNode;
  compare(other: Trigger): number;
}
