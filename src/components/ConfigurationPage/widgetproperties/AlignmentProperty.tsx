import { SELECTION_TYPE, SingleChoiceProperty } from "./SingleChoiceProperty";

export class AlignmentProperty extends SingleChoiceProperty {
  private _propertyOptions: string[];

  constructor({
    name,
    value,
    displayName,
    options,
  }: {
    name: string;
    value?: string;
    displayName: string;
    options?: string[];
  }) {
    const propertyOptions = options ?? ["left", "center", "right"];
    super({
      name: name,
      value: value ?? propertyOptions[0],
      displayName: displayName,
      options: propertyOptions,
      selectionType: SELECTION_TYPE.SEGMENTED,
    });
    this._propertyOptions = propertyOptions;
  }

  public copy(): AlignmentProperty {
    return new AlignmentProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      options: this._propertyOptions,
    });
  }
}
