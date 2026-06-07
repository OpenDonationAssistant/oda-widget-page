import { ReactNode } from "react";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";

export class MakePinnedMessageAction implements AutomationAction, Renderable {
    id = "make-pinned-message";
    name = "Создать закрепленное сообщение";
    markup: ReactNode;
    value: any;
}
