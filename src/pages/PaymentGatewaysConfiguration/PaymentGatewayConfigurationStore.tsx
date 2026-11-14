import { DefaultApiFactory as PaymentService } from "@opendonationassistant/oda-payment-service-client";
import { Flex } from "antd";
import { makeAutoObservable } from "mobx";
import { ReactNode } from "react";
import { Trans } from "react-i18next";
import { uuidv7 } from "uuidv7";
import { log } from "../../logging";

export interface Instruction {
  /** i18n key */
  statement: string;
  /** i18n key for plain text, or a <Trans> node for rich text */
  comment: ReactNode;
  screen?: string;
}

export interface GatewayInfo {
  /** i18n key */
  name: string;
  id: string;
  type: "fiat" | "crypto";
  /** i18n keys */
  goodpoints: string[];
  /** i18n keys */
  badpoints: string[];
  fields: GatewayField[];
  instructions: Map<number, Instruction[]>;
}

export interface GatewayField {
  id: string;
  /** i18n key */
  name: string;
  /** i18n key, empty when there is no comment */
  comment: string;
  value: string;
}

export interface GatewayConfiguration {
  id: string;
  gateway: string;
  type: string;
  enabled: boolean;
}

export class PaymentGatewayConfigurationStore {
  private _gateway: GatewayInfo | null = null;
  private _client = PaymentService(
    undefined,
    process.env.REACT_APP_PAYMENT_API_ENDPOINT,
  );
  private _step: number = 0;
  private _configurations: GatewayConfiguration[] = [];
  private _gateways: GatewayInfo[] = [
    {
      name: "gateway-yoomoney-name",
      id: "yoomoney",
      type: "fiat",
      goodpoints: [
        "gateway-goodpoint-self-employment-not-required",
        "gateway-yoomoney-goodpoint-fee",
      ],
      badpoints: [
        "gateway-yoomoney-badpoint-no-sbp",
        "gateway-badpoint-no-foreign-cards",
      ],
      fields: [
        {
          id: "shopId",
          name: "gateway-field-yoomoney-wallet-name",
          comment: "gateway-field-yoomoney-wallet-comment",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "gateway-yoomoney-instruction-create-wallet",
              comment: (
                <div>
                  <Trans
                    i18nKey="gateway-yoomoney-instruction-create-wallet-comment"
                    components={{
                      lnk: (
                        <a
                          target="_blank"
                          href="https://yoomoney.ru/yooid/signup/step/phone"
                        />
                      ),
                    }}
                  />
                </div>
              ),
            },
          ],
        ],
        [
          3,
          [
            {
              statement: "gateway-yoomoney-instruction-configure",
              comment: (
                <>
                  <div>
                    <Trans
                      i18nKey="gateway-yoomoney-instruction-webhook"
                      components={{
                        lnk: (
                          <a href="https://yoomoney.ru/transfer/myservices/http-notification?lang=ru" />
                        ),
                      }}
                    />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-yoomoney-instruction-http-notifications" />
                  </div>
                </>
              ),
              screen:
                "https://api.oda.digital/assets/photo_2025-03-21_16-52-10.jpg",
            },
          ],
        ],
      ]),
    },
    {
      name: "gateway-yookassa-name",
      id: "yookassa",
      type: "fiat",
      goodpoints: [
        "gateway-goodpoint-self-employment-required",
        "gateway-yookassa-goodpoint-fee",
        "gateway-yookassa-goodpoint-sbp-fee",
      ],
      badpoints: ["gateway-badpoint-no-foreign-cards"],
      fields: [
        {
          id: "shopId",
          name: "gateway-field-shop-id-name",
          comment: "gateway-field-yookassa-shop-id-comment",
          value: "",
        },
        {
          id: "apiKey",
          name: "gateway-field-yookassa-secret-key-name",
          comment: "gateway-field-yookassa-secret-key-comment",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "gateway-instruction-self-employment",
              comment: "gateway-instruction-self-employment-comment",
            },
            {
              statement: "gateway-yookassa-instruction-register",
              comment: (
                <Flex vertical>
                  <div>
                    <Trans i18nKey="gateway-yookassa-instruction-register-comment" />
                  </div>
                  <a
                    target="_blank"
                    href="https://yookassa.ru/joinups/?source=oda.digital"
                  >
                    <Trans i18nKey="gateway-yookassa-register-link" />
                  </a>
                </Flex>
              ),
            },
            {
              statement: "gateway-instruction-fill-contacts",
              comment: (
                <Flex vertical>
                  <div>
                    <Trans
                      i18nKey="gateway-yookassa-instruction-contacts-comment"
                      components={{
                        lnk: (
                          <a href="https://widgets.oda.digital/configuration/payment-page" />
                        ),
                      }}
                    />
                  </div>
                </Flex>
              ),
            },
            {
              statement: "gateway-yookassa-instruction-form",
              comment: (
                <Flex vertical>
                  <div>
                    <Trans i18nKey="gateway-yookassa-instruction-payments-site" />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-yookassa-instruction-receipts" />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-yookassa-instruction-purpose" />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-yookassa-instruction-submit" />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-yookassa-instruction-validator" />
                  </div>
                </Flex>
              ),
            },
          ],
        ],
        [
          3,
          [
            {
              statement: "gateway-yookassa-instruction-webhook-url",
              comment: "gateway-yookassa-instruction-webhook-url-comment",
              screen:
                "https://api.oda.digital/assets/photo_2024-03-03_10-32-18.jpg",
            },
          ],
        ],
      ]),
    },
    {
      name: "gateway-robokassa-name",
      id: "robokassa",
      type: "fiat",
      goodpoints: [
        "gateway-goodpoint-self-employment-required",
        "gateway-robokassa-goodpoint-card-fee",
        "gateway-robokassa-goodpoint-sbp-fee",
        "gateway-robokassa-goodpoint-foreign-cards",
      ],
      badpoints: ["gateway-robokassa-badpoint-withdrawal-fee"],
      fields: [
        {
          id: "shopId",
          name: "gateway-field-shop-id-name",
          comment: "gateway-field-robokassa-shop-id-comment",
          value: "",
        },
        {
          id: "apiKey",
          name: "gateway-field-robokassa-password1-name",
          comment: "gateway-field-robokassa-password1-comment",
          value: "",
        },
        {
          id: "secret",
          name: "gateway-field-robokassa-password2-name",
          comment: "gateway-field-robokassa-password2-comment",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "gateway-instruction-self-employment",
              comment: "gateway-instruction-self-employment-comment",
            },
            {
              statement: "gateway-robokassa-instruction-register",
              comment: (
                <Flex vertical>
                  <div>
                    <Trans i18nKey="gateway-robokassa-instruction-register-comment" />
                  </div>
                  <a
                    target="_blank"
                    href={`https://partner.robokassa.ru/Reg/Register?PromoCode=odadonation&culture=ru`}
                  >
                    <Trans i18nKey="gateway-robokassa-register-link" />
                  </a>
                </Flex>
              ),
            },
            {
              statement: "gateway-instruction-fill-contacts",
              comment: (
                <Flex vertical>
                  <div>
                    <Trans
                      i18nKey="gateway-robokassa-instruction-contacts-comment"
                      components={{
                        lnk: (
                          <a href="https://widgets.oda.digital/configuration/payment-page" />
                        ),
                      }}
                    />
                  </div>
                </Flex>
              ),
            },
            {
              statement: "gateway-robokassa-instruction-add-shop",
              comment: "gateway-robokassa-instruction-add-shop-comment",
            },
          ],
        ],
        [
          3,
          [
            {
              statement: "gateway-robokassa-instruction-result-url",
              comment: "gateway-robokassa-instruction-result-url-comment",
            },
            {
              statement: "gateway-robokassa-instruction-success-url",
              comment: "gateway-robokassa-instruction-success-url-comment",
            },
            {
              statement: "gateway-robokassa-instruction-fail-url",
              comment: "gateway-robokassa-instruction-fail-url-comment",
            },
          ],
        ],
      ]),
    },
    {
      name: "gateway-rahmat-name",
      id: "rahmat",
      type: "fiat",
      goodpoints: ["gateway-rahmat-goodpoint-uzbekistan"],
      badpoints: ["gateway-rahmat-badpoint-sums"],
      fields: [
        {
          id: "shopId",
          name: "gateway-field-rahmat-store-id-name",
          comment: "",
          value: "",
        },
        {
          id: "appId",
          name: "gateway-field-rahmat-app-id-name",
          comment: "",
          value: "",
        },
        {
          id: "appSecret",
          name: "gateway-field-rahmat-app-secret-name",
          comment: "",
          value: "",
        },
        {
          id: "mxik",
          name: "gateway-field-rahmat-mxik-name",
          comment: "",
          value: "",
        },
        {
          id: "packageCode",
          name: "gateway-field-rahmat-package-code-name",
          comment: "",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "gateway-instruction-self-employment",
              comment: "gateway-instruction-self-employment-comment",
            },
          ],
        ],
        [
          3,
          [
            {
              statement: "gateway-rahmat-instruction-nothing",
              comment: "",
            },
          ],
        ],
      ]),
    },
    {
      name: "gateway-cryptocloud-name",
      id: "cryptocloud",
      type: "crypto",
      goodpoints: [
        "gateway-goodpoint-self-employment-not-required",
        "gateway-cryptocloud-goodpoint-fee",
      ],
      badpoints: [],
      fields: [
        {
          id: "shopId",
          name: "gateway-field-cryptocloud-shop-id-name",
          comment: "gateway-field-cryptocloud-shop-id-comment",
          value: "",
        },
        {
          id: "apiKey",
          name: "gateway-field-cryptocloud-api-key-name",
          comment: "gateway-field-cryptocloud-api-key-comment",
          value: "",
        },
        {
          id: "secret",
          name: "gateway-field-cryptocloud-secret-name",
          comment: "gateway-field-cryptocloud-secret-comment",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "gateway-cryptocloud-instruction-register",
              comment: (
                <a
                  target="_blank"
                  href="https://app.cryptocloud.plus/?ref=0C1K5OW5US"
                >
                  <Trans i18nKey="gateway-cryptocloud-register-link" />
                </a>
              ),
            },
            {
              statement: "gateway-cryptocloud-instruction-create-project",
              comment: (
                <>
                  <div>
                    <Trans i18nKey="gateway-cryptocloud-instruction-create-project-comment" />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-cryptocloud-instruction-payment-method" />
                  </div>
                </>
              ),
            },
          ],
        ],
        [
          3,
          [
            {
              statement: "gateway-cryptocloud-instruction-configure",
              screen:
                "https://api.oda.digital/assets/2025-11-15_15-11-1763210389.png",
              comment: (
                <>
                  <div>
                    <Trans i18nKey="gateway-cryptocloud-instruction-configure-comment" />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-cryptocloud-instruction-site" />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-cryptocloud-instruction-cms" />
                  </div>
                  <div>
                    <Trans i18nKey="gateway-cryptocloud-instruction-success-url-label" />{" "}
                    {"<"}
                    <Trans i18nKey="gateway-cryptocloud-your-donation-page" />
                    {">"}/payment/cryptocloud/result
                  </div>
                  <div>
                    <Trans i18nKey="gateway-cryptocloud-instruction-fail-url-label" />{" "}
                    {"<"}
                    <Trans i18nKey="gateway-cryptocloud-your-donation-page" />
                    {">"}/payment/cryptocloud/result
                  </div>
                  <div>
                    <Trans i18nKey="gateway-cryptocloud-instruction-notification-url" />
                  </div>
                </>
              ),
            },
          ],
        ],
      ]),
    },
  ];
  private _recipientId: string;

  constructor(recipientId: string) {
    this._recipientId = recipientId;
    this.load();
    makeAutoObservable(this);
  }

  private load() {
    this._client
      .listGateways(this._recipientId)
      .then((response) => response.data)
      .then((data) => {
        this.configurations = data
          .map((it) => {
            return {
              id: it.id,
              gateway: it.gateway,
              type: it.type,
              enabled: it.enabled,
            };
          })
          .reverse();
      });
  }

  public toggle(id: string) {
    const conf = this._configurations.find((conf) => conf.id === id);
    if (conf) {
      this._client.toggleGateway({ id: conf.id }).then(() => this.load());
    }
  }

  public delete(id: string) {
    const conf = this._configurations.find((conf) => conf.id === id);
    if (conf) {
      this._client.deleteGateway({ id: conf.id }).then(() => this.load());
    }
  }

  public save() {
    if (!this._gateway) {
      log.error("no gateway selected");
      return;
    }
    this._client
      .setGateway({
        id: uuidv7(),
        gateway: this._gateway.id,
        gatewayId:
          this._gateway.fields.find((field) => field.id === "shopId")?.value ??
          "",
        token:
          this._gateway.fields.find((field) => field.id === "apiKey")?.value ??
          "",
        secret:
          this._gateway.fields.find((field) => field.id === "secret")?.value ??
          "",
        settings: this.getSettings(),
        type: this._gateway.type,
        enabled: true,
      })
      .then(() => this.load());
  }

  private getSettings(): { [key: string]: string } {
    if (!this._gateway) {
      return {};
    }
    switch (this._gateway.id) {
      case "rahmat":
        return {
          appSecret:
            this._gateway.fields.find((field) => field.id === "appSecret")
              ?.value ?? "",
          appId:
            this._gateway.fields.find((field) => field.id === "appId")?.value ??
            "",
          mxik:
            this._gateway.fields.find((field) => field.id === "mxik")?.value ??
            "",
          packageCode:
            this._gateway.fields.find((field) => field.id === "packageCode")
              ?.value ?? "",
        };
      default:
        return {};
    }
  }

  public set configurations(configurations: GatewayConfiguration[]) {
    this._configurations = configurations;
  }

  public get configurations() {
    return this._configurations;
  }

  public get gateway(): GatewayInfo | null {
    return this._gateway;
  }

  public set gateway(gateway: GatewayInfo | null) {
    this._gateway = gateway;
  }

  public set step(step: number) {
    this._step = step;
  }

  public get gateways() {
    return this._gateways;
  }

  public get step() {
    return this._step;
  }
}
