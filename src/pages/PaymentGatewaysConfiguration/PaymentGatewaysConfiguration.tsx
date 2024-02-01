import React, { useState } from "react";
import Toolbar, { Page } from "../../components/ConfigurationPage/Toolbar";
import classes from "./PaymentGatewaysConfiguration.module.css";

const backgroundColor = (
  <style
    dangerouslySetInnerHTML={{
      __html: `html, body {background-color: #0c122e; height: 100%;}`,
    }}
  />
);

export default function PaymentGatewaysConfiguration({}) {
  const [shopId, setShopId] = useState<string>("");
  const [shopToken, setShopToken] = useState<string>("");
  return (
    <>
      {backgroundColor}
      <Toolbar page={Page.GATEWAYS} />
      <div className={classes.gatewaysconfig}>
        <h2 className={classes.configsectiontitle}>Настройки YooKassa</h2>
        <div className={classes.configitem}>
          <div className={classes.configname}>Shop Id</div>
          <input
            value={shopId}
            className={classes.configvalue}
          />
        </div>
        <div className={classes.configitem}>
          <div className={classes.configname}>Shop Token</div>
          <input
            value={shopToken}
            className={classes.configvalue}
          />
        </div>
      </div>
    </>
  );
}
