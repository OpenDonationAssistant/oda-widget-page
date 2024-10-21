import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Segmented, Select } from "antd";
import { Trans, useTranslation } from "react-i18next";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";

export enum SELECTION_TYPE {
  DROPDOWN,
  SEGMENTED,
}

export class SingleChoiceProperty extends DefaultWidgetProperty<string> {
  private _options: string[];
  private _selectionType: SELECTION_TYPE;

  constructor({
    name,
    value,
    displayName,
    options,
    selectionType,
  }: {
    name: string;
    value: string;
    displayName: string;
    options?: string[];
    selectionType?: SELECTION_TYPE;
  }) {
    super({name: name, value: value, displayName: displayName});
    this._options = options ?? [];
    this._selectionType = selectionType ?? SELECTION_TYPE.DROPDOWN;
  }

  SegmentedSelect = observer(() => {
    const { t } = useTranslation();
    return (
      <Segmented
        value={this.value}
        block
        className="full-width"
        options={this._options.map((option) => {
          return { label: t(option), value: option };
        })}
        onChange={(selected) => {
          this.value = selected;
        }}
      />
    );
  });

  DropdownSelect = observer(() => {
    return (
      <Select
        value={this.value}
        className="full-width"
        onChange={(e) => {
          this.value = e;
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
  });

  renderSelect() {
    switch (this._selectionType) {
      case SELECTION_TYPE.DROPDOWN:
        return <this.DropdownSelect />;
      case SELECTION_TYPE.SEGMENTED:
        return <this.SegmentedSelect />;
    }
  }

  markup(): ReactNode {
    return (
      <LabeledContainer displayName={this.displayName}>
        {this.renderSelect()}
      </LabeledContainer>
    );
  }
}
