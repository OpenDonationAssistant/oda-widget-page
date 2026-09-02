import type { Message, MessagePart } from "../ChatWidget/ChatWidgetStore";

export interface ChatWidgetV2FontConfig {
  family: string;
  size: number;
  color: string;
  gradient: boolean;
  outline: { enabled: boolean; width: number; color: string };
  weight: boolean;
  italic: boolean;
  underline: boolean;
  shadows: { x: number; y: number; blur: number; color: string }[];
}

export interface ChatWidgetV2Config {
  layout: "vertical" | "horizontal";
  alignment: "left" | "center" | "right";
  totalGap: number;
  lineGap: number;
  isBlock: boolean;
  imgSize: number;
  authorFont: ChatWidgetV2FontConfig;
  messageFont: ChatWidgetV2FontConfig;
}

const MAX_MESSAGES = 50;

/**
 * Vanilla JS chat renderer. Owns the message DOM inside a container element
 * provided by the React host. No React imports — pure DOM manipulation.
 */
export class ChatWidgetV2Renderer {
  private _container: HTMLElement | null = null;
  private _config: ChatWidgetV2Config;
  private _messages: Message[] = [];

  constructor(config: ChatWidgetV2Config) {
    this._config = config;
  }

  mount(container: HTMLElement): void {
    this._container = container;
    this.applyContainerStyle();
    this.render();
  }

  updateConfig(config: ChatWidgetV2Config): void {
    this._config = config;
    this.applyContainerStyle();
    this.render();
  }

  addMessage(message: Message): void {
    this._messages.push(message);
    while (this._messages.length > MAX_MESSAGES) {
      this._messages.shift();
      this._container?.removeChild(this._container.firstChild!);
    }
    const created = this.createMessageElement(message);
    this._container?.appendChild(created);
    created.scrollIntoView();
  }

  clear(): void {
    this._messages = [];
    this.render();
  }

  destroy(): void {
    if (this._container) {
      this._container.innerHTML = "";
    }
    this._container = null;
  }

  private render(): void {
    if (!this._container) return;
    this._container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    this._messages.forEach((message) => {
      fragment.appendChild(this.createMessageElement(message));
    });
    this._container.appendChild(fragment);
    this._container.scrollTop = this._container.scrollHeight;
  }

  private createMessageElement(message: Message): HTMLElement {
    return this._config.isBlock
      ? this.createBlockMessage(message)
      : this.createInlineMessage(message);
  }

  private createBlockMessage(message: Message): HTMLElement {
    const line = document.createElement("div");
    line.style.display = "flex";
    line.style.alignItems = "flex-start";
    line.style.gap = `${this._config.lineGap}px`;

    message.badges.forEach((badge) => {
      line.appendChild(this.createBadgeImage(badge.url));
    });

    line.appendChild(
      this.createTextElement(
        message.chatter.nickname,
        this._config.authorFont,
        message.chatter.color,
      ),
    );

    const parts = document.createElement("div");
    message.parts.forEach((part) => {
      parts.appendChild(this.createPartElement(part));
    });
    line.appendChild(parts);

    return line;
  }

  private createInlineMessage(message: Message): HTMLElement {
    const line = document.createElement("span");

    message.badges.forEach((badge) => {
      line.appendChild(this.createBadgeImage(badge.url));
    });

    line.appendChild(
      this.createTextElement(
        `${message.chatter.nickname}: `,
        this._config.authorFont,
        message.chatter.color,
      ),
    );

    message.parts.forEach((part) => {
      line.appendChild(this.createPartElement(part));
    });

    return line;
  }

  private createPartElement(part: MessagePart): HTMLElement {
    if (part.type === "emote") {
      return this.createEmoteImage(part.url ?? "");
    }
    return this.createTextElement(part.text ?? "", this._config.messageFont);
  }

  private createBadgeImage(url: string): HTMLImageElement {
    const img = this.createImage(url);
    img.style.marginLeft = "1px";
    img.style.marginRight = "3px";
    return img;
  }

  private createEmoteImage(url: string): HTMLImageElement {
    return this.createImage(url);
  }

  private createImage(url: string): HTMLImageElement {
    const img = document.createElement("img");
    img.src = url;
    img.width = this._config.imgSize;
    img.height = this._config.imgSize;
    img.style.display = "inline";
    img.style.verticalAlign = "text-bottom";
    return img;
  }

  private createTextElement(
    text: string,
    font: ChatWidgetV2FontConfig,
    colorOverride?: string,
  ): HTMLElement {
    const el = document.createElement("span");
    el.style.display = "inline";
    el.textContent = text;
    this.applyFontStyle(el, font, colorOverride);
    return el;
  }

  private applyFontStyle(
    el: HTMLElement,
    font: ChatWidgetV2FontConfig,
    colorOverride?: string,
  ): void {
    el.style.fontSize = `${font.size}px`;
    el.style.fontFamily = `"${font.family}"`;
    el.style.fontWeight = font.weight ? "bolder" : "normal";
    el.style.fontStyle = font.italic ? "italic" : "normal";
    el.style.textDecoration = font.underline ? "underline" : "none";

    if (font.outline.enabled) {
      el.style.webkitTextStrokeWidth = `${font.outline.width}px`;
      el.style.webkitTextStrokeColor = font.outline.color;
    }

    const shadow = font.shadows
      .filter((it) => it.blur > 0)
      .map((it) => `${it.x}px ${it.y}px ${it.blur}px ${it.color}`)
      .join(",");
    if (shadow) {
      el.style.textShadow = shadow;
    }

    if (colorOverride) {
      el.style.color = colorOverride;
    } else if (font.gradient) {
      el.style.color = "transparent";
      el.style.webkitTextFillColor = "transparent";
      el.style.backgroundImage = font.color;
      el.style.backgroundClip = "text";
      el.style.setProperty("-webkit-background-clip", "text");
    } else {
      el.style.color = font.color;
    }
  }

  private applyContainerStyle(): void {
    if (!this._container) return;
    const config = this._config;
    this._container.style.display = "flex";
    this._container.style.flexDirection =
      config.layout === "vertical" ? "column" : "row";
    this._container.style.gap = `${config.totalGap}px`;
    this._container.style.alignItems =
      config.alignment === "left"
        ? "flex-start"
        : config.alignment === "center"
          ? "center"
          : "flex-end";
    this._container.style.overflowY = "auto";
  }
}
