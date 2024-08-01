import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Segmented, Select } from "antd";
import { Trans, useTranslation } from "react-i18next";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";

export enum SELECTION_TYPE {
  DROPDOWN,
  SEGMENTED,
}

export class SingleChoiceProperty extends DefaultWidgetProperty {
  private _options: string[];
  private _selectionType: SELECTION_TYPE;

  constructor({
    widgetId,
    name,
    value,
    displayName,
    options,
    tab,
    selectionType,
  }: {
    widgetId: string;
    name: string;
    value: any;
    displayName: string;
    options?: string[];
    tab?: string;
    selectionType?: SELECTION_TYPE;
  }) {
    super(widgetId, name, "choice", value, displayName, tab);
    this._options = options ?? [];
    this._selectionType = selectionType ?? SELECTION_TYPE.DROPDOWN;
  }

  segmentedSelect = (updateConfig: Function) => {
    const { t } = useTranslation();
    return (
      <Segmented
        block
        className="full-width"
        options={this._options.map((option) => {
          return { label: t(option), value: option };
        })}
        onChange={(selected) => {
          updateConfig(this.widgetId, this.name, selected);
        }}
      />
    );
  };

  dropdownSelect = (updateConfig: Function) => {
    return (
      <Select
        value={this.value}
        className="full-width"
        onChange={(e) => {
          updateConfig(this.widgetId, this.name, e);
        }}
        options={this._options.map((option) => {
          return {
            value: option,
            label: (
              <>
                <Trans i18nKey={option} />
              </>
            ),
          };
        })}
      />
    );
  };

  renderSelect(updateConfig: Function) {
    switch (this._selectionType) {
      case SELECTION_TYPE.DROPDOWN:
        return this.dropdownSelect(updateConfig);
      case SELECTION_TYPE.SEGMENTED:
        return this.segmentedSelect(updateConfig);
    }
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <LabeledContainer displayName={this.displayName}>
        {this.renderSelect(updateConfig)}
      </LabeledContainer>
    );
  }

  copy(): SingleChoiceProperty {
    return new SingleChoiceProperty({
      widgetId: this.widgetId,
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      options: this._options,
      tab: this.tab,
      selectionType: this._selectionType,
    });
  }
}
