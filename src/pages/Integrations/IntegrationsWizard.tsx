import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { createContext, useContext } from "react";
import {
  Card,
  CardList,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { Flex, Input } from "antd";
import classes from "./IntegrationsWizard.module.css";

export class IntegrationWizardStore {
  private _system:
    | "donationalerts"
    | "donatepay.ru"
    | "donatepay.eu"
    | "donate.stream"
    | null = null;
  private _accessToken: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  public set system(
    system:
      | "donationalerts"
      | "donatepay.ru"
      | "donatepay.eu"
      | "donate.stream"
      | null,
  ) {
    this._system = system;
  }

  public get system() {
    return this._system;
  }

  public set accessToken(token: string) {
    this._accessToken = token;
  }

  public get accessToken(): string {
    return this._accessToken;
  }
}

export const IntegrationWizardStoreContext = createContext(
  new IntegrationWizardStore(),
);

export const ChooseDonationPlatformComponent = observer(({}: {}) => {
  const context = useContext(IntegrationWizardStoreContext);

  return (
    <CardList>
      <Card
        selected={context.system === "donationalerts"}
        onClick={() => (context.system = "donationalerts")}
      >
        <CardTitle>DonationAlerts</CardTitle>
      </Card>
      <Card
        selected={context.system === "donatepay.ru"}
        onClick={() => (context.system = "donatepay.ru")}
      >
        <CardTitle>DonatePay.ru</CardTitle>
      </Card>
      <Card
        selected={context.system === "donatepay.eu"}
        onClick={() => (context.system = "donatepay.eu")}
      >
        <CardTitle>DonatePay.eu</CardTitle>
      </Card>
    </CardList>
  );
});

export const AddDonatePayTokenComponent = observer(({}: {}) => {
  const context = useContext(IntegrationWizardStoreContext);

  return (
    <Flex vertical className={`${classes.content}`}>
      {context.system === "donatepay.eu" && (
        <Flex className="full-width" gap={12} vertical>
          <div className={`${classes.instruction}`}>
            1. Укажите API ключ. Скопировать API ключ можно на странице{" "}
            <a href="https://donatepay.eu/page/api">API DonatePay.eu</a>
          </div>
          <Input
            value={context.accessToken}
            onChange={(value) => {
              context.accessToken = value.target.value;
            }}
          />
        </Flex>
      )}
      {context.system === "donatepay.ru" && (
        <Flex className="full-width" gap={12} vertical>
          <div className={`${classes.instruction}`}>
            1. Укажите API ключ. Скопировать API ключ можно на странице{" "}
            <a href="https://donatepay.ru/page/api">API DonatePay.ru</a>
          </div>
          <Input
            value={context.accessToken}
            onChange={(value) => {
              context.accessToken = value.target.value;
            }}
          />
        </Flex>
      )}
    </Flex>
  );
});
