import { DefaultApiFactory as PaymentService } from "@opendonationassistant/oda-payment-service-client";
import { Flex } from "antd";
import { makeAutoObservable } from "mobx";
import { ReactNode } from "react";
import { uuidv7 } from "uuidv7";
import { log } from "../../logging";

export interface Instruction {
  statement: ReactNode;
  comment: ReactNode;
  screen?: string;
}

export interface GatewayInfo {
  name: string;
  id: string;
  type: "fiat" | "crypto";
  goodpoints: string[];
  badpoints: string[];
  fields: GatewayField[];
  instructions: Map<number, Instruction[]>;
}

export interface GatewayField {
  id: string;
  name: string;
  comment: string;
  value: string;
}

export interface GatewayConfiguration {
  id: string;
  type: string;
  enabled: boolean;
}

export class PaymentGatewayConfigurationStore {
  private _gateway: string | null = null;
  private _client = PaymentService(
    undefined,
    process.env.REACT_APP_PAYMENT_API_ENDPOINT,
  );
  private _step: number = 0;
  private _configurations: GatewayConfiguration[] = [];
  private _gateways: GatewayInfo[] = [
    {
      name: "Юмани",
      id: "yoomoney",
      type: "fiat",
      goodpoints: ["Не требуется самозанятость", "Комиссия 3% + 3% вывод"],
      badpoints: ["Нет СБП", "Не принимает зарубежные карты"],
      fields: [
        {
          id: "shopId",
          name: "Введите номер кошелька Юмани",
          comment: "Номер кошелька можно скопировать в личном кабинете Юмани",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "1. Создайте кошелек в Юмани",
              comment: (
                <div>
                  Оформить кошелек можно по{" "}
                  <a
                    target="_blank"
                    href="https://yoomoney.ru/yooid/signup/step/phone"
                  >
                    ссылке
                  </a>
                </div>
              ),
            },
          ],
        ],
        [
          3,
          [
            {
              statement: "2. Внесите нужные настройки",
              comment: (
                <>
                  <div>
                    Откройте{" "}
                    <a href="https://yoomoney.ru/transfer/myservices/http-notification?lang=ru">
                      настройки
                    </a>{" "}
                    и вставьте ссылку
                    "https://api.oda.digital/notification/yoomoney".
                  </div>
                  <div>Поставьте галку "Отправлять HTTP-уведомления".</div>
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
      name: "Юкасса",
      id: "yookassa",
      type: "fiat",
      goodpoints: [
        "Требуется самозанятость",
        "Комиссия 2.8% + 0% вывод",
        "Комиссия 0.4% на СБП + 0% вывод",
      ],
      badpoints: ["Не принимает зарубежные карты"],
      fields: [
        {
          id: "shopId",
          name: "Введите Идентификатор магазина",
          comment:
            "Идентификатор магазина можно скопировать в личном кабинете Юкассы, вверху рядом с надписью shopId, либо в разделе Настройки -> Магазин, под строчкой shopId",
          value: "",
        },
        {
          id: "apiKey",
          name: "Введите Секретный ключ",
          comment:
            "Секретный ключ можно скопировать в разделе Интеграции -> Ключи API под заголовком Секретный ключ",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "1. Оформите статус самозанятого",
              comment: "Оформить самозанятого можно на сайте Госуслуг",
            },
            {
              statement:
                "2. Перейдите по ссылке для регистрации аккаунта в Юкассе",
              comment: (
                <Flex vertical>
                  <div>
                    Используя полученный ИНН самозанятого зарегистрируйте акаунт
                    Юкассы используя ссылку ниже. Ссылка позволит уменьшить
                    коммиссию до 2,8 %
                  </div>
                  <a
                    target="_blank"
                    href="https://yookassa.ru/joinups/?source=oda.digital"
                  >
                    Зарегистрироваться в Юкассе
                  </a>
                </Flex>
              ),
            },
            {
              statement: "3. Заполните контактные данные",
              comment: (
                <Flex vertical>
                  <div>
                    В{" "}
                    <a href="https://widgets.oda.digital/configuration/payment-page">
                      ЛК ОДЫ
                    </a>{" "}
                    заполните контактные данные (ФИО, ИНН, E-Mail). Они будут
                    отображаться на странице доната в разделе "Пользовательское
                    соглашение" - это требование Юкассы.
                  </div>
                </Flex>
              ),
            },
            {
              statement: "4. Заполните анкету подключения.",
              comment: (
                <Flex vertical>
                  <div>
                    В пункте Прием платежей выберите "На сайте", указав адрес
                    страницы доната.
                  </div>
                  <div>Чеки подключать не надо.</div>
                  <div>
                    В "Цель деятельности" можно оставить пункт "Получение
                    прибыли от реализации основных видов деятельности"
                  </div>
                  <div>Отправьте анкету на проверку.</div>
                  <div>
                    Автоматический валидатор будет ругаться, что на странице не
                    хватает контактных данных - игнорируем эту ошибку.
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
              statement: "1. Пропишите URL ОДЫ для HTTP уведомлений",
              comment:
                "В разделе 'Интеграции' -> 'HTTP уведомления' в строке 'URL для уведомлений' вставьте адрес 'https://api.oda.digital/notification/yookassa'",
              image:
                "https://api.oda.digital/assets/photo_2024-03-03_10-32-18.jpg",
            },
          ],
        ],
      ]),
    },
    {
      name: "Робокасса",
      id: "robokassa",
      type: "fiat",
      goodpoints: [
        "Требуется самозанятость",
        "Комиссия 3% на банк.карты",
        "Комиссия 2.8% на СБП",
        "Принимает зарубежные карты",
      ],
      badpoints: ["При выводе менее 10000 рублей комиссия 50 рублей"],
      fields: [
        {
          id: "shopId",
          name: "Введите Идентификатор магазина",
          comment:
            "Идентификатор магазина можно скопировать в Настройках магазина во вкладке Технические настройки",
          value: "",
        },
        {
          id: "apiKey",
          name: "Введите Пароль #1",
          comment:
            "В Настройках магазина во вкладке Технические настройки сгенерируйте и скопируйте сюда Пароль #1",
          value: "",
        },
        {
          id: "secret",
          name: "Введите Пароль #2",
          comment:
            "В Настройках магазина во вкладке Технические настройки сгенерируйте и скопируйте сюда Пароль #2",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "1. Оформите статус самозанятого",
              comment: "Оформить самозанятого можно на сайте Госуслуг",
            },
            {
              statement:
                "2. Перейдите по ссылке для регистрации аккаунта в Робокассе",
              comment: (
                <Flex vertical>
                  <div>
                    Используя полученный ИНН самозанятого, зарегистрируйте
                    акаунт Робокассы используя ссылку ниже. Ссылка позволит
                    уменьшить коммиссию до 3%
                  </div>
                  <a
                    target="_blank"
                    href={`https://partner.robokassa.ru/Reg/Register?PromoCode=odadonation&culture=ru`}
                  >
                    Зарегистрироваться в Робокассе
                  </a>
                </Flex>
              ),
            },
            {
              statement: "3. Добавьте магазин",
              comment:
                "В разделе 'Мои магазины' добавьте новый. Заполните необходимые данные, указав адрес страницы доната в строке 'Ссылка на ваш сайт'. После заполнения всех данных, отправьте анкету на подтверждение.",
            },
          ],
        ],
      ]),
    },
    {
      name: "CryptoCloud",
      id: "cryptocloud",
      type: "crypto",
      goodpoints: ["Не требуется самозанятость", "Комиссия от 0.4% до 1.9%"],
      badpoints: [],
      fields: [
        {
          id: "shopId",
          name: "Введите Shop ID",
          comment: "Shop ID можно скопировать в ",
          value: "",
        },
        {
          id: "apiKey",
          name: "Введите Пароль #1",
          comment:
            "В Настройках магазина во вкладке Технические настройки сгенерируйте и скопируйте сюда Пароль #1",
          value: "",
        },
        {
          id: "secret",
          name: "Введите Пароль #2",
          comment:
            "В Настройках магазина во вкладке Технические настройки сгенерируйте и скопируйте сюда Пароль #2",
          value: "",
        },
      ],
      instructions: new Map([
        [
          2,
          [
            {
              statement: "1. Перейдите по ссылке для регистрации аккаунта",
              comment: (
                <a
                  target="_blank"
                  href="https://app.cryptocloud.plus/?ref=0C1K5OW5US"
                >
                  Зарегистрировать аккаунт
                </a>
              ),
            },
            {
              statement: "2. Создайте проект",
              comment: (
                <>
                  <div>
                    После регистрации аккаунта, в разделе Мои проекты добавьте
                    новый проект и заполните всю информацию.
                  </div>
                  <div>
                    В настройке "Как вы хотите принимать платежи" должен быть
                    выбран пункт "На своем сайте".
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
              statement: "2. Настройте проект",
              comment: (
                <>
                  <div>
                    В созданном проекте во вкладке "Интеграция и API" заполните
                    поля следующим образом:
                  </div>
                  <div>Настройки CMS - Other CMS</div>
                  <div>Успешный URL - https://stcarolas.oda.digital/</div>
                  <div>Неудачный URL - https://stcarolas.oda.digital/</div>
                  <div>
                    URL для уведомлений - https://stcarolas.oda.digital/
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
        this.configurations = data.map((it) => {
          return {
            id: it.id,
            type: it.type,
            enabled: it.enabled,
          };
        }).reverse();
      });
  }

  public toggle(id: string) {
    const conf = this._configurations.find((conf) => conf.id === id);
    if (conf) {
      this._client.toggleGateway({ id: conf.id }).then(() => this.load());
    }
  }

  public save() {
    this._gateways
      .filter((it) => it.id === this._gateway)
      .forEach((gateway) => {
        log.debug({ fields: gateway.fields }, "saving gateway");
        this._client
          .setGateway({
            id: uuidv7(),
            gateway: gateway.id,
            gatewayId:
              gateway.fields.find((field) => field.id === "shopId")?.value ??
              "",
            token:
              gateway.fields.find((field) => field.id === "apiKey")?.value ??
              "",
            secret:
              gateway.fields.find((field) => field.id === "secret")?.value ??
              "",
            enabled: true,
          })
          .then(() => this.load());
      });
  }

  public set configurations(configurations: GatewayConfiguration[]) {
    this._configurations = configurations;
  }

  public get configurations() {
    return this._configurations;
  }

  public get gateway(): string | null {
    return this._gateway;
  }

  public set gateway(gateway: string | null) {
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
