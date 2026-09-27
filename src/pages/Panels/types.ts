export interface PanelPayload {
  name: string;
  cards: PanelCard[];
}

export interface Panel extends PanelPayload {
  id: string;
}

export interface PanelCard {
  id: string;
  ruleId: string;
  title: string;
}
