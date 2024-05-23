import axios from "axios";
import { log } from "../../logging";
import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";

export class PaymentPageConfig {
  config: any = {};
  email: string = "";
  fio: string = "";
  inn: string = "";
  arbitraryText: string | null = null;
  requestsEnabled = true;
  requestsDisabledPermanently = false;
  requestCost = 100;
  private _minimalAmount: Number = 40;
  private _goals: Goal[] = [];
  private _recipientId: string = "";
  private _payButtonText: string = "";
  private _customCss: string = "";

  constructor(recipientId: string) {
    log.debug("Loading PaymentPageConfig");
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
        this.goals = json.value["goals"] ?? [];
        this._payButtonText = json.value["payButtonText"] ?? "";
        this.minimalAmount = json.value["minimalAmount"] ?? 40;
        this._customCss = json.value["customCss"] ?? [];
        this.sendMediaRequestsEnabledState();
        this.sendEventPaymentPageUpdated();
      });
  }

  sendMediaRequestsEnabledState() {
    log.debug(`send media-requests-enabled state: ${this.requestsEnabled}`);
    document.dispatchEvent(
      new CustomEvent("toggleMediaRequests", {
        detail: this.requestsEnabled,
      }),
    );
  }

  sendEventPaymentPageUpdated() {
    log.debug(`send media-requests-enabled state: ${this.requestsEnabled}`);
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
  public get minimalAmount() {
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
    this.sendMediaRequestsEnabledState();
    this.sendEventPaymentPageUpdated();
  }
}
