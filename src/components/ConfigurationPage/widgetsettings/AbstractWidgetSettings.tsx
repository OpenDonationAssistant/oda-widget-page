import { ReactNode } from "react";
import { log } from "../../../logging";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { Tabs as AntTabs } from "antd";
import { Notifier } from "../Notifier";
import { Trans, useTranslation } from "react-i18next";
import { makeObservable, observable } from "mobx";

export interface SettingsSection {
  key: string;
  title: string;
  properties: WidgetProperty<any>[];
}

export class AbstractWidgetSettings {
  private _index: Map<string, WidgetProperty<any>> = new Map();
  private _sections: SettingsSection[];
  public unsaved: boolean = false;

  constructor({ sections }: { sections: SettingsSection[] }) {
    this._sections = sections;
    this.makeIndex();
    makeObservable(this, {
      unsaved: observable,
    });
  }

  public prepareConfig(): { name: string, value: any }[]{
    return this._sections
      .flatMap((section) => section.properties)
      .map((prop) => {
        return {
          name: prop.name,
          value: prop.value
        }
      });
  }

  private makeIndex() {
    this._sections
      .flatMap((section) => section.properties)
      .forEach((prop) => {
        this._index.set(prop.name, prop);
      });
  }

  tabPaneGenerator = (section: SettingsSection) => {
    return {
      label: <Trans i18nKey={section.title} />,
      key: section.key,
      children: section.properties.map((prop) => (
        <div className="settings-item">{prop.markup()}</div>
      )),
    };
  };

  public markup(): ReactNode {
    return (
      <AntTabs type="card" items={this._sections.map(this.tabPaneGenerator)} />
    );
  }

  public get(key: string): WidgetProperty<any> | undefined {
    return this._index.get(key);
  }

  public set(key: string, value: any): void {
    const prop = this._index.get(key);
    if (prop) {
      prop.value = value;
    }
  }
}
