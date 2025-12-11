import { SELECTION_TYPE, SingleChoiceProperty } from "./SingleChoiceProperty";

export class AlignmentProperty extends SingleChoiceProperty {
  constructor({
    name,
    value,
    displayName,
  }: {
    name: string;
    value?: string;
    displayName: string;
  }) {
    super({
      name: name,
      value: value ?? "left",
      displayName: displayName,
      options: ["left", "center", "right"],
      selectionType: SELECTION_TYPE.SEGMENTED,
    });
  }

  public copy(): AlignmentProperty {
    return new AlignmentProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
    });
  }
}
