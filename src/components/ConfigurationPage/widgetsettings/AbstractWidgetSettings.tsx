import { ReactNode } from "react";
import { log } from "../../../logging";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { Tabs as AntTabs } from "antd";
import { Trans } from "react-i18next";
import {
  computed,
  getObserverTree,
  makeObservable,
  observable,
  observe,
} from "mobx";

export interface SettingsSection {
  key: string;
  title: string;
  properties: WidgetProperty<any>[];
}

export class AbstractWidgetSettings {
  private _index: Map<string, WidgetProperty<any>> = new Map();
  private _sections: SettingsSection[];
  private _initial: any;

  constructor({ sections }: { sections: SettingsSection[] }) {
    this._sections = sections;
    this._initial = this.prepareConfig();
    this.makeIndex();
    makeObservable(this, {
      _sections: observable,
      unsaved: computed,
    });
  }

  public get unsaved(): boolean {
    log.debug("calc unsaved");
    return (
      this._sections
        .flatMap((section) => section.properties)
        .find((prop) => prop.changed) !== undefined
    );
  }

  public prepareConfig(): { name: string; value: any }[] {
    const prepared = this._sections
      .flatMap((section) => section.properties)
      .map((prop) => {
        return {
          name: prop.name,
          value: prop.value,
        };
      });
    log.debug({preparedConfig: prepared});
    return prepared;
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
        <div key={prop.name} className="settings-item">
          {prop.markup()}
        </div>
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
