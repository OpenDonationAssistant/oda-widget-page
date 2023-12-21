import axios from "axios";
import { log } from "../../logging";

export class PaymentPageConfig {
  config: any = {};
  requestsEnabled: boolean = true;
  constructor() {
    log.debug("Loading PaymentPageConfig");
    axios
      .get(`${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/paymentpage`)
      .then((data) => data.data)
      .then((json) => {
        this.config = json;
        this.requestsEnabled = json.value["media.requests.enabled"];
        this.sendMediaRequestsEnabledState();
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

  toggleMediaRequests() {
    this.requestsEnabled = !this.requestsEnabled;
    this.config.value["media.requests.enabled"] = this.requestsEnabled;
    axios.post(
      `${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/${this.config.id}`,
      this.config,
    );
    this.sendMediaRequestsEnabledState();
  }
}
