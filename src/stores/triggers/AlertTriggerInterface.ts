import { ReactNode } from "react";

export interface Amount {
  major: number;
  currency: string;
}

export interface TriggerCause {
  id: string;
  type: string;
}

export interface DonationTriggerCause extends TriggerCause {
  type: "donation";
  amount: Amount;
  system: string;
}

export interface TriggerType {
  description: string;
  type: string;
  category: string;
}

export interface Trigger {
  type: string;
  category: string;
  description: string;
  priorityFor(event: TriggerCause): number;
  markup(): ReactNode;
}
