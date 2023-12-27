import axios from "axios";
import { log } from "../../logging";

export class PaymentPageConfig {
  config: any = {};
  requestsEnabled = true;
  requestsDisabledPermanently = false;
  requestCost = 100;

  constructor() {
    log.debug("Loading PaymentPageConfig");
    axios
      .get(`${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/paymentpage`)
      .then((data) => data.data)
      .then((json) => {
        this.config = json;
        this.requestsEnabled = json.value["media.requests.enabled"];
        this.requestsEnabled = this.requestsEnabled
          ? this.requestsEnabled
          : true;
        this.requestsDisabledPermanently =
          json.value["media.requests.disabled.permanently"];
        this.requestsDisabledPermanently = this.requestsDisabledPermanently
          ? this.requestsDisabledPermanently
          : false;
        this.requestCost = json.value["media.requests.cost"];
        this.requestCost = this.requestCost ? this.requestCost : 100;
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
    this.updateConfig(this.config);
    this.sendMediaRequestsEnabledState();
  }

  toggleRequestsPermanently() {
    this.requestsDisabledPermanently = !this.requestsDisabledPermanently;
    this.config.value["media.requests.disabled.permanently"] =
      this.requestsDisabledPermanently;
    this.updateConfig(this.config);
    this.sendEventPaymentPageUpdated();
  }

  setRequestsCost(cost: number) {
    this.requestCost = cost;
    this.config.value["media.requests.cost"] = this.requestCost;
    this.updateConfig(this.config);
    this.sendEventPaymentPageUpdated();
  }

  updateConfig(config: any) {
    axios.post(
      `${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/${this.config.id}`,
      config,
    );
  }
}
