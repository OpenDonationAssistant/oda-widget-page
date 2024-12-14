import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";
import { makeAutoObservable } from "mobx";
import { produce } from "immer";
import { PaymentPageConfig } from "../MediaWidget/PaymentPageConfig";
import { log as parent } from "../../logging";
import { subscribe } from "../../socket";
import { toJS } from "mobx";

export interface AbstractDonationGoalState {
  goals: Goal[];
}

export class DonationGoalState implements AbstractDonationGoalState {
  private _log = parent.child({
    module: "components.DonationGoal.DonationGoalState",
  });
  private _widgetId: string;
  private _conf: any;
  private _goals: Goal[] = [];

  constructor({
    widgetId,
    conf,
    paymentPageConfig,
  }: {
    widgetId: string;
    conf: any;
    paymentPageConfig: PaymentPageConfig;
  }) {
    this._widgetId = widgetId;
    this._conf = conf;
    this._goals = paymentPageConfig.goals;
    makeAutoObservable(this);
    document.addEventListener("paymentPageUpdated", () => {
      this._goals = paymentPageConfig.goals;
    });
    this.listen();
  }

  private listen() {
    subscribe(this._widgetId, this._conf.topic.goal, (message) => {
      const updatedGoal = JSON.parse(message.body) as any;
      this._log.debug({ goalCommand: updatedGoal }, "received goals command");
      this._goals = produce(toJS(this._goals), (draft) => {
        draft
          .filter((goal) => goal.id === updatedGoal.goalId)
          .forEach((goal) => {
            this._log.debug({ id: goal.id }, "updating goal");
            goal.accumulatedAmount.major = updatedGoal.accumulatedAmount.major;
          });
      });
      this._log.debug({ goals: this._goals }, "updated goals");
      message.ack();
    });
  }

  public get goals() {
    return this._goals;
  }
}
