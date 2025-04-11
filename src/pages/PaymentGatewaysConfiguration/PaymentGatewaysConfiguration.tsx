import classes from "./PaymentGatewaysConfiguration.module.css";
import { Button, Flex } from "antd";

export default function PaymentGatewaysConfiguration({}) {
  return (
    <Flex vertical gap={9}>
      <h1 className={`${classes.header}`}>Способы оплаты</h1>
      <div className={`${classes.sectionname}`}>
        Фиатная валюта (RUB, USD, etc)
      </div>
      <Flex>
        <Button className={`${classes.addbutton}`}>
          <Flex
            vertical
            justify="center"
            align="center"
            gap={3}
            className="full-height"
          >
            <span className="material-symbols-sharp">add</span>
            <div>Добавить</div>
          </Flex>
        </Button>
      </Flex>
      <div className={`${classes.sectionname}`}>
        Криптовалюта (Bitcoin, Etherium, TON, etc)
      </div>
      <Flex>
        <Button className={`${classes.addbutton}`}>
          <Flex
            vertical
            justify="center"
            align="center"
            gap={3}
            className="full-height"
          >
            <span className="material-symbols-sharp">add</span>
            <div>Добавить</div>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
}
