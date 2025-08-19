import { ReactNode } from "react";
import { log } from "../../../logging";
import { WidgetProperty } from "../widgetproperties/WidgetProperty";
import { Tabs as AntTabs, Flex } from "antd";
import { Trans } from "react-i18next";
import { computed, makeObservable, observable, toJS } from "mobx";
import classes from "./AbstractWidgetSettings.module.css";
import { Preset } from "../../../types/Preset";

export interface SettingsSection {
  key: string;
  title: string;
  properties: WidgetProperty<any>[];
}

export class AbstractWidgetSettings {
  private _index: Map<string, WidgetProperty<any>> = new Map();
  private _sections: SettingsSection[];

  constructor({ sections }: { sections: SettingsSection[] }) {
    this._sections = sections;
    this.makeIndex();
    makeObservable<AbstractWidgetSettings, "_sections">(this, {
      _sections: observable,
      unsaved: computed,
    });
  }

  public copy(): AbstractWidgetSettings {
    return new AbstractWidgetSettings({
      sections: this.sections.map((section) => {
        return {
          key: section.key,
          title: section.title,
          properties: section.properties.map((it) => it.copy()),
        };
      }),
    });
  }

  protected get sections() {
    return this._sections;
  }

  protected set sections(section: SettingsSection[]) {
    this._sections = section;
    this.makeIndex();
  }

  protected addSection(section: SettingsSection) {
    this._sections.push(section);
    this.makeIndex();
  }

  public reset(): void {
    this._sections = [];
    this._index.clear();
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
          value: toJS(prop.value),
        };
      });
    log.debug({ preparedConfig: prepared });
    return prepared;
  }

  protected makeIndex() {
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
    // if (this._sections.length > 1) {
      return (
        <AntTabs
        className={`${classes.settings}`}
          type="card"
          items={this._sections.map(this.tabPaneGenerator)}
        />
      );
    // }
    // return (
    //   <Flex vertical className="full-width">
    //     {this._sections.at(0)?.properties.map((prop) => (
    //       <div key={prop.name} className="settings-item">
    //         {prop.markup()}
    //       </div>
    //     ))}
    //   </Flex>
    // );
  }

  public help(): ReactNode {
    return <div></div>;
  }

  public subactions(): ReactNode {
    return <></>;
  }

  public demo(): ReactNode {
    return <></>;
  }

  public hasDemo(): boolean {
    return false;
  }

  public get(key: string): WidgetProperty<any> | undefined {
    return this._index.get(key);
  }

  public set(key: string, value: any, asInitialValue = false): void {
    const prop = this._index.get(key);
    if (prop) {
      prop.value = value;
      if (asInitialValue) {
        prop.markSaved();
      }
    }
  }

  public markSaved(): void {
    [...this._index.values()].forEach((prop) => prop.markSaved());
  }
}
