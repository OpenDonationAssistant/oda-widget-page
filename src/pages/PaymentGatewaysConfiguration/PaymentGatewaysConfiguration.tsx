import { observer } from "mobx-react-lite";
import classes from "./PaymentGatewaysConfiguration.module.css";
import { Flex } from "antd";
import { PaymentGatewayConfigurationStore } from "./PaymentGatewayConfigurationStore";
import { useRef } from "react";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { CryptoGatewaysSection, FiatGatewaysSection } from "./ExistingGateways";

const PaymentGatewaysConfiguration = observer(({}) => {
  const { recipientId } = useLoaderData() as WidgetData;
  const configuration = useRef(
    new PaymentGatewayConfigurationStore(recipientId),
  );

  return (
    <Flex vertical gap={9}>
      <h1 className={`${classes.header}`}>Способы оплаты</h1>
      <FiatGatewaysSection configuration={configuration.current} />
      <CryptoGatewaysSection configuration={configuration.current} />
    </Flex>
  );
});

export default PaymentGatewaysConfiguration;
