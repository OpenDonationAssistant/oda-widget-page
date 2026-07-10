import { observer } from "mobx-react-lite";
import { CustomWidgetSettings } from "./CustomWidgetSettings";
import { useEffect, useState } from "react";
import { CustomWidgetStore } from "./CustomWidgetStore";

function resolvePlaceholders(str: string, data: any) {
  return str.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_, expr) => {
    // support "a.b.c" paths
    const path = expr.trim().split(".");
    let cur = data;
    for (const key of path) {
      cur = cur?.[key];
    }
    return cur == null ? "" : String(cur);
  });
}

export const CustomWidget = observer(
  ({
    settings,
    store,
  }: {
    settings: CustomWidgetSettings;
    store: CustomWidgetStore;
  }) => {
    const [html, setHtml] = useState<string>("");
    const [css, setCss] = useState<string>("");
    const [js, setJs] = useState<string>("");
    const [doc, setDoc] = useState<string>("");

    useEffect(() => {
      settings.configContent().then((config) => {
        settings
          .htmlContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((content) => {
            setHtml(content);
          });
        settings
          .jsContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((text) => {
            setJs(text);
          });
        settings
          .cssContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((text) => {
            setCss(text);
          });
      });
    }, [settings]);

    useEffect(() => {
      setDoc(
        `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
          <style>
            html, body { background: none transparent!important; }
          </style>
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            window.addEventListener("load", function (event) {
              const e = new CustomEvent("onWidgetLoad", {
                detail: ${JSON.stringify(store.session)},
              });

              window.dispatchEvent(e);
            });
          </script>
          <script>
            ${js}
          </script>
        </body>
      </html>`,
      );
    }, [html, css, js, store.session]);

    return (
      <>
        {doc && (
          <iframe
            width="570px"
            height="570px"
            sandbox="allow-scripts"
            scrolling="no"
            srcDoc={doc}
            style={{ border: "none", background: "transparent" }}
          />
        )}
      </>
    );
  },
);
