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
  private _system: "donationalerts" | "donatepay" | null = null;
  private _accessToken: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  public set system(system: "donationalerts" | "donatepay" | null) {
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
        selected={context.system === "donatepay"}
        onClick={() => (context.system = "donatepay")}
      >
        <CardTitle>DonatePay</CardTitle>
      </Card>
    </CardList>
  );
});

export const AddDonatePayTokenComponent = observer(({}: {}) => {
  const context = useContext(IntegrationWizardStoreContext);

  return (
    <Flex vertical className={`${classes.content}`}>
      <Flex className="full-width" gap={12} vertical>
        <div className={`${classes.instruction}`}>
          1. Укажите API ключ. Скопировать API ключ можно на странице{" "}
          <a href="https://donatepay.ru/page/api">API DonatePay</a>
        </div>
        <Input
          value={context.accessToken}
          onChange={(value) => {
            context.accessToken = value.target.value;
          }}
        />
      </Flex>
    </Flex>
  );
});
