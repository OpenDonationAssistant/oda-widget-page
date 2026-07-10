import { CSSProperties, ReactNode, useState } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import { DefaultWidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";
import classes from "./SourcesProperty.module.css";
import {
  downloadFile,
  fullUri,
  handleFileUpload,
  uploadBlob,
} from "../../utils";
import { Trans } from "react-i18next";
import CollapseLikeButton from "../../components/Button/CollapseLikeButton";
import SourceButton from "./SourceButton";
import Editor from "@monaco-editor/react";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  override,
  toJS,
} from "mobx";
import { uuidv7 } from "uuidv7";

export interface Sources {
  html: string;
  js: string;
  css: string;
  spec: string;
  config: string;
}

function generateSource() {
  return {
    html: `${uuidv7()}.html`,
    js: `${uuidv7()}.js`,
    css: `${uuidv7()}.css`,
    spec: `${uuidv7()}.json`,
    config: `${uuidv7()}.json`,
  };
}

export class SourcesProperty extends DefaultWidgetProperty<Sources> {
  private _htmlContent: string = "<html></html>";
  private _jsContent: string = "";
  private _cssContent: string = "";
  private _specContent: string = "";
  private _configContent: string = "";
  public contentChanged: boolean = false;

  constructor({
    name,
    value,
    displayName,
  }: {
    name: string;
    value?: Sources;
    displayName?: string;
  }) {
    const normalized =
      value === undefined || value === null ? generateSource() : value;
    super({
      name: name,
      value: normalized,
      displayName: displayName ?? "Файлы",
    });
    console.log("SourcesProperty", this._value);
    makeObservable(this, {
      changed: override,
      contentChanged: observable,
      markChanged: action,
    });
  }

  public get value(): Sources {
    return this._value;
  }

  public set value(value: Sources) {
    if (value !== undefined && value !== null) {
      this._value = value;
    }
    downloadFile(this._value.spec)
      .then((blob) => blob.text())
      .then((blob) => {
        this._specContent = blob;
      });
    downloadFile(this._value.config)
      .then((blob) => blob.text())
      .then((blob) => {
        this._configContent = blob;
      });
    downloadFile(this._value.html)
      .then((blob) => blob.text())
      .then((blob) => {
        this._htmlContent = blob;
      });
    downloadFile(this._value.css)
      .then((blob) => blob.text())
      .then((blob) => {
        this._cssContent = blob;
      });
    downloadFile(this._value.js)
      .then((blob) => blob.text())
      .then((blob) => {
        this._jsContent = blob;
      });
    console.log("SourcesProperty", this._value);
  }

  public save(): Promise<void> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this._htmlContent, "text/html");
    const htmlBlob = new Blob([doc.body.outerHTML], { type: "text/plain" });
    const cssBlob = new Blob([this._cssContent], { type: "text/css" });
    const jsBlob = new Blob([this._jsContent], { type: "text/javascript" });
    const specBlob = new Blob([this._specContent], {
      type: "application/json",
    });
    const configBlob = new Blob([this._configContent], {
      type: "application/json",
    });

    return Promise.all([
      uploadBlob(htmlBlob, this._value.html, false),
      uploadBlob(cssBlob, this._value.css, false),
      uploadBlob(jsBlob, this._value.js, false),
      uploadBlob(specBlob, this._value.spec, false),
      uploadBlob(configBlob, this._value.config, false),
    ]).then(() => {
      this.contentChanged = false;
    });
  }

  public markChanged() {
    console.log("changed");
    this.contentChanged = true;
  }

  public get changed(): boolean {
    console.log("changed", this.contentChanged);
    return this.contentChanged;
  }

  comp = observer(() => {
    return (
      <Flex vertical gap={9}>
        <SourceButton label={<Trans>HTML</Trans>}>
          <Editor
            height="50vh"
            width="100%"
            theme="vs-dark"
            defaultLanguage="html"
            options={{ automaticLayout: false }}
            onMount={(editor) => {
              editor.layout();
            }}
            value={this._htmlContent}
            onChange={(value) => {
              this.markChanged();
              this._htmlContent = value ?? "";
            }}
          />
        </SourceButton>
        <SourceButton label={<Trans>JS</Trans>}>
          <Editor
            height="50vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            options={{ automaticLayout: false }}
            onMount={(editor) => {
              editor.layout();
            }}
            value={this._jsContent}
            onChange={(value) => {
              this.markChanged();
              this._jsContent = value ?? "";
            }}
          />
        </SourceButton>
        <SourceButton label={<Trans>CSS</Trans>}>
          <Editor
            height="50vh"
            theme="vs-dark"
            defaultLanguage="css"
            options={{ automaticLayout: false }}
            onMount={(editor) => {
              editor.layout();
            }}
            value={this._cssContent}
            onChange={(value) => {
              this.markChanged();
              this._cssContent = value ?? "";
            }}
          />
        </SourceButton>
        <SourceButton label={<Trans>Fields</Trans>}>
          <Editor
            height="50vh"
            theme="vs-dark"
            defaultLanguage="json"
            options={{ automaticLayout: false }}
            onMount={(editor) => {
              editor.layout();
            }}
            value={this._specContent}
            onChange={(value) => {
              this.markChanged();
              this._specContent = value ?? "";
            }}
          />
        </SourceButton>
        <SourceButton label={<Trans>Data</Trans>}>
          <Editor
            height="50vh"
            theme="vs-dark"
            defaultLanguage="json"
            options={{ automaticLayout: false }}
            onMount={(editor) => {
              editor.layout();
            }}
            value={this._configContent}
            onChange={(value) => {
              this.markChanged();
              this._configContent = value ?? "";
            }}
          />
        </SourceButton>
      </Flex>
    );
  });

  markup(): ReactNode {
    return <this.comp />;
  }

  public copy(): SourcesProperty {
    console.log("copy sources");
    return new SourcesProperty({
      name: this.name,
      value: this.value,
      displayName: this.displayName,
    });
  }
}
