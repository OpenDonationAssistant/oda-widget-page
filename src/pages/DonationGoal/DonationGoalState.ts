import { makeAutoObservable, toJS } from "mobx";
import { produce } from "immer";
import { Goal } from "../../components/ConfigurationPage/widgetproperties/DonationGoalProperty";
import { DonationGoalWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { log as parent } from "../../logging";
import { subscribe } from "../../socket";
import { VariableStore } from "../../stores/VariableStore";

export interface AbstractDonationGoalState {
  goals: Goal[];
}

export interface DonationGoalTopics {
  goal: string;
}

export class DonationGoalState implements AbstractDonationGoalState {
  private _log = parent.child({
    module: "components.DonationGoal.DonationGoalState",
  });
  private _widgetId: string;
  private _topics: DonationGoalTopics;
  private _goals: Goal[] = [];
  private _variables: VariableStore;

  constructor({
    widgetId,
    topics,
    settings,
    variables,
  }: {
    widgetId: string;
    topics: DonationGoalTopics;
    settings: DonationGoalWidgetSettings;
    variables: VariableStore;
  }) {
    this._widgetId = widgetId;
    this._topics = topics;
    this._goals = settings.goalProperty.value ?? [];
    this._variables = variables;
    makeAutoObservable(this);
    this.listen();
  }

  private listen() {
    subscribe(this._widgetId, this._topics.goal, (message) => {
      const updatedGoal = JSON.parse(message.body) as any;
      this._log.debug({ goalCommand: updatedGoal }, "received goals command");
      this._goals = produce(toJS(this._goals), (draft) => {
        draft
          .filter((goal) => goal.id === updatedGoal.goalId)
          .forEach((goal) => {
            this._log.debug({ id: goal.id }, "updating goal");
            goal.accumulatedAmount.major = updatedGoal.accumulatedAmount.major;
            goal.requiredAmount.major = updatedGoal.requiredAmount.major;
          });
      });
      this._variables.load();
      this._log.debug({ goals: this._goals }, "updated goals");
      message.ack();
    });
  }

  public get goals() {
    return this._goals;
  }
}
