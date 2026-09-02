import axios from "axios";
import { log as parent } from "../../logging";
import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";
import { createContext } from "react";

export class PaymentPageConfig {
  private _log = parent.child({ module: "paymentPageConfig" });

  config: any = {};
  email: string = "";
  fio: string = "";
  inn: string = "";
  arbitraryText: string | null = null;
  requestsEnabled = true;
  requestsDisabledPermanently = false;
  requestCost = 100;
  private _minimalAmount: number = 40;
  private _goals: Goal[] = [];
  private _recipientId: string = "";
  private _payButtonText: string = "";
  private _customCss: string = "";
  private _tooltip: string = "";
  private _url: string = "";
  private _displayName: string = "";
  private _description: string = "";
  private _socials: Map<string, string>[] = [];

  constructor(recipientId: string) {
    this._log.debug("Loading PaymentPageConfig");
    this._recipientId = recipientId;
    axios
      .get(
        `${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/paymentpage?ownerId=${recipientId}`,
      )
      .then((data) => data.data)
      .then((json) => {
        this.config = json;
        this.requestsEnabled = json.value["media.requests.enabled"] ?? true;
        this.requestsDisabledPermanently =
          json.value["media.requests.disabled.permanently"] ?? false;
        this.requestCost = json.value["media.requests.cost"] ?? 100;
        this.email = json.value["email"] ?? "";
        this.fio = json.value["fio"] ?? "";
        this.inn = json.value["inn"] ?? "";
        this.arbitraryText = json.value["arbitraryText"] ?? null;
        this._displayName = json.value["nickname"] ?? "";
        this.goals = json.value["goals"] ?? [];
        this._payButtonText = json.value["payButtonText"] ?? "";
        this.minimalAmount = json.value["minimalAmount"] ?? 40;
        this._customCss = json.value["customCss"] ?? [];
        this._tooltip = json.value["tooltip"] ?? "";
        this._url = json["url"] ?? "";
        this._description = json.value["streamer.description"] ?? "";
        if (json.value["url"] !== undefined) {
          const socials = json.value["url"] ?? [];
          socials.forEach((social) => {
            const link = new Map();
            Object.keys(social).forEach((key) => {
              link.set(key, social[key]);
              this._socials.push(link);
            });
          });
        }
        this.sendMediaRequestsEnabledState();
        this.sendEventPaymentPageUpdated();
        this._log.debug({ config: this }, "PaymentPageConfig loaded");
      });
  }

  sendMediaRequestsEnabledState() {
    this._log.debug(
      `send media-requests-enabled state: ${this.requestsEnabled}`,
    );
    document.dispatchEvent(
      new CustomEvent("toggleMediaRequests", {
        detail: this.requestsEnabled,
      }),
    );
  }

  sendEventPaymentPageUpdated() {
    this._log.debug(
      `send media-requests-enabled state: ${this.requestsEnabled}`,
    );
    document.dispatchEvent(new CustomEvent("paymentPageUpdated"));
  }

  toggleMediaRequests() {
    this.requestsEnabled = !this.requestsEnabled;
    this.config.value["media.requests.enabled"] = this.requestsEnabled;
    this.sendMediaRequestsEnabledState();
  }

  toggleRequestsPermanently() {
    this.requestsDisabledPermanently = !this.requestsDisabledPermanently;
    this.config.value["media.requests.disabled.permanently"] =
      this.requestsDisabledPermanently;
    this.sendEventPaymentPageUpdated();
  }

  setRequestsCost(cost: number) {
    this.requestCost = cost;
    this.config.value["media.requests.cost"] = this.requestCost;
    this.sendEventPaymentPageUpdated();
  }

  setDescription(description: string) {
    this._description = description;
    this.config.value["streamer.description"] = description;
    this.sendEventPaymentPageUpdated();
  }

  setEmail(email: string) {
    this.email = email;
    this.config.value["email"] = this.email;
    this.sendEventPaymentPageUpdated();
  }

  setFio(fio: string) {
    this.fio = fio;
    this.config.value["fio"] = this.fio;
    this.sendEventPaymentPageUpdated();
  }

  setInn(inn: string) {
    this.inn = inn;
    this.config.value["inn"] = this.inn;
    this.sendEventPaymentPageUpdated();
  }

  setArbitraryText(arbitraryText: string) {
    this.arbitraryText = arbitraryText;
    this.config.value["arbitraryText"] = arbitraryText;
    this.sendEventPaymentPageUpdated();
  }

  save() {
    this.updateConfig(this.config);
  }

  updateConfig(config: any) {
    return axios.post(
      `${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/${this.config.id}`,
      config,
    );
  }

  public get goals(): Goal[] {
    return this._goals;
  }
  public set goals(value: Goal[]) {
    this._goals = value;
  }
  public get description(): string {
    return this._description;
  }
  public get minimalAmount(): number {
    return this._minimalAmount;
  }
  public set minimalAmount(value) {
    this._minimalAmount = value;
    this.config.value["minimalAmount"] = value;
    this.sendEventPaymentPageUpdated();
  }
  public get payButtonText(): string {
    return this._payButtonText;
  }
  public set payButtonText(value: string) {
    this._payButtonText = value;
    this.config.value["payButtonText"] = value;
    this.sendEventPaymentPageUpdated();
  }
  public get customCss(): string {
    return this._customCss;
  }
  public set customCss(value: string) {
    this._customCss = value;
    this.config.value["customCss"] = value;
    this.sendEventPaymentPageUpdated();
  }

  public set tooltip(value: string) {
    this._tooltip = value;
    this.config.value["tooltip"] = value;
    this.sendEventPaymentPageUpdated();
  }

  public changeSocial(oldKey: string, newKey: string) {
    this._socials = this._socials.map((social) => {
      if (social.has(oldKey)) {
        social.set(newKey, social.get(oldKey));
        social.delete(oldKey);
      }
      return social;
    });
    this.config.value["url"] = this._socials;
    this.sendEventPaymentPageUpdated();
  }

  public addSocial(key: string, value: string) {
    const link = new Map();
    link.set(key, value);
    this._socials.push(link);
    const json = this._socials.map((social) => Object.fromEntries(social));
    this.config.value["url"] = json;
    this.sendEventPaymentPageUpdated();
  }

  public updateSocial(key: string, value: string) {
    this._socials = this._socials.map((social) => {
      if (social.has(key)) {
        social.set(key, value);
      }
      return social;
    });
    const json = this._socials.map((social) => Object.fromEntries(social));
    this.config.value["url"] = json;
    this.sendEventPaymentPageUpdated();
  }

  public deleteSocial(key: string) {
    this._socials = this._socials.filter((social) => !social.has(key));
    const json = this._socials.map((social) => Object.fromEntries(social));
    this.config.value["url"] = json;
    this.sendEventPaymentPageUpdated();
  }

  public get tooltip(): string {
    return this._tooltip;
  }

  public get recipientId(): string {
    return this._recipientId;
  }

  public get url(): string {
    return this._url;
  }

  public get displayName(): string {
    return this._displayName;
  }

  public get socials(): Map<string, string>[] {
    return this._socials;
  }

  async reloadConfig(): Promise<void> {
    const data = await axios.get(
      `${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/paymentpage?ownerId=${this._recipientId}`,
    );
    this.config = data.data;
    this.requestsEnabled = this.config.value["media.requests.enabled"] ?? true;
    this.requestsDisabledPermanently =
      this.config.value["media.requests.disabled.permanently"] ?? false;
    this.requestCost = this.config.value["media.requests.cost"] ?? 100;
    this.email = this.config.value["email"] ?? "";
    this.fio = this.config.value["fio"] ?? "";
    this.inn = this.config.value["inn"] ?? "";
    this.minimalAmount = this.config.value["minimalAmount"] ?? 40;
    this.arbitraryText = this.config.value["arbitraryText"] ?? null;
    this.tooltip = this.config.value["tooltip"] ?? "";
    this._socials = [];
    if (this.config.value["url"] !== undefined) {
      const socials = this.config.value["url"] ?? [];
      socials.forEach((social) => {
        const link = new Map();
        Object.keys(social).forEach((key) => {
          link.set(key, social[key]);
          this._socials.push(link);
        });
      });
    }
    this.sendMediaRequestsEnabledState();
    this.sendEventPaymentPageUpdated();
  }
}

export const PaymentPageConfigContext = createContext<PaymentPageConfig | null>(
  null,
);
