import { ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import { Segmented, Select } from "antd";
import { Trans, useTranslation } from "react-i18next";
import LabeledContainer from "../../LabeledContainer/LabeledContainer";
import { observer } from "mobx-react-lite";
import { log } from "../../../logging";

export enum SELECTION_TYPE {
  DROPDOWN,
  SEGMENTED,
}

export class SingleChoiceProperty extends DefaultWidgetProperty<string> {
  private _options: string[];
  private _labelKeys: Record<string, string> | undefined;
  private _selectionType: SELECTION_TYPE;

  constructor({
    name,
    value,
    displayName,
    options,
    labelKeys,
    selectionType,
  }: {
    name: string;
    value: string;
    displayName: string;
    options?: string[];
    labelKeys?: Record<string, string>;
    selectionType?: SELECTION_TYPE;
  }) {
    super({ name: name, value: value, displayName: displayName });
    this._options = options ?? [];
    this._labelKeys = labelKeys;
    this._selectionType = selectionType ?? SELECTION_TYPE.DROPDOWN;
  }

  private labelKey(option: string): string {
    return this._labelKeys?.[option] ?? option;
  }

  SegmentedSelect = observer(() => {
    const { t } = useTranslation();
    log.debug(
      { options: this._options, value: this.value },
      "creating segmented selection",
    );
    return (
      <Segmented
        block
        value={this.value}
        className="full-width"
        options={this._options.map((option) => {
          return { label: t(this.labelKey(option)), value: option };
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
                <Trans i18nKey={this.labelKey(option)} />
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

  public copy(): SingleChoiceProperty {
    return new SingleChoiceProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
      options: this._options,
      labelKeys: this._labelKeys,
      selectionType: this._selectionType,
    });
  }
}
