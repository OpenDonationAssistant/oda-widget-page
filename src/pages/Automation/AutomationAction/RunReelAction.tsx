import { Select } from "antd";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { WidgetStoreContext } from "../../../stores/WidgetStore";
import { log } from "../../../logging";
import { makeAutoObservable } from "mobx";

export interface RunReelActionValue {
  reelId: string;
}

const RunReelActionComponent = observer(
  ({ action }: { action: RunReelAction }) => {
    const widgets = useContext(WidgetStoreContext);

    log.debug({value: action.value}, "render run reel action");

    return (
      <LabeledContainer displayName="">
        <Select
          className="full-width"
          value={action.reelId}
          options={widgets?.search({ type: "reel" }).map((widget) => {
            return {
              value: widget.id,
              label: widget.name,
            };
          })}
          onChange={(id) => {
            log.debug({ id: id }, "change reel id");
            action.reelId = id;
          }}
        />
      </LabeledContainer>
    );
  },
);

export class RunReelAction implements AutomationAction, Renderable {
  private _value: RunReelActionValue = { reelId: "" };

  constructor() {
    makeAutoObservable(this);
  }

  public set value(value: RunReelActionValue) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public get reelId() {
    return this._value.reelId;
  }

  public set reelId(id: string) {
    this._value = { reelId: id };
  }

  public get id() {
    return "run-reel";
  }

  public get name() {
    return "Запустить рулетку";
  }

  public get markup() {
    return <RunReelActionComponent action={this} />;
  }
}
