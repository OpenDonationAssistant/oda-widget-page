import { observer } from "mobx-react-lite";
import { CustomWidgetSettings } from "./CustomWidgetSettings";
import { useEffect, useState } from "react";
import { CustomWidgetStore } from "./CustomWidgetStore";
import { toJS } from "mobx";

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
  ({ settings, store }: { settings: CustomWidgetSettings; store: CustomWidgetStore }) => {
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [cssUrl, setCssUrl] = useState<string>("");
    const [jsUrl, setJsUrl] = useState<string | null>(null);
    const [doc, setDoc] = useState<string>("");
    const [src, setSrc] = useState<string | null>(null);
    const [config, setConfig] = useState<any>({});

    useEffect(() => {
      settings.configContent().then((config) => {
        setConfig(config);
        settings
          .htmlContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((content) => {
            setHtmlContent(content);
          });
        settings
          .jsContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((text) => {
            const url = URL.createObjectURL(
              new Blob([text], { type: "application/javascript" }),
            );
            setJsUrl(url);
          });
        settings
          .cssContent()
          .then((blob) => blob.text())
          .then((text) => resolvePlaceholders(text, config))
          .then((text) => {
            const url = URL.createObjectURL(
              new Blob([text], { type: "text/css" }),
            );
            setCssUrl(url);
          });
      });
    }, [settings]);

    useEffect(() => {
      console.log({ session: toJS(store.session) },"session");
      const url = URL.createObjectURL(
        new Blob(
          [
            `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="${cssUrl}">
          <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
          <script src="${jsUrl}"></script>
          <style>
            html, body { background: none transparent!important; }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            window.addEventListener("load", function (event) {
              const e = new CustomEvent("onWidgetLoad", {
                detail: ${JSON.stringify(store.session)},
              });

              window.dispatchEvent(e);
            });
          </script>
        </body>
      </html>`,
          ],
          { type: "text/html" },
        ),
      );
      setSrc(url);
    }, [htmlContent, cssUrl, jsUrl, store.session]);

    return (
      <>
        {src && (
          <iframe
            width="570px"
            height="570px"
            sandbox="allow-scripts"
            scrolling="no"
            src={src}
            style={{ border: "none", background: "transparent" }}
          />
        )}
      </>
    );
  },
);
