import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { setupCommandListener, subscribe } from "../../socket";
import { log } from "../../logging";
import classes from "./DonationGoal.module.css";
import { findSetting } from "../utils";
import { PaymentPageConfig } from "../MediaWidget/PaymentPageConfig";
import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";
import FontImport from "../FontImport/FontImport";

export default function DonationGoal({}) {
  const { recipientId, settings, conf, widgetId } =
    useLoaderData() as WidgetData;
  const navigate = useNavigate();
  const paymentPageConfig = useRef<PaymentPageConfig | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    subscribe(widgetId, conf.topic.goal, (message) => {
      log.debug({ goalCommand: message }, "received goals command");
      message.ack();
      navigate(0);
    });
    setupCommandListener(widgetId, () => navigate(0));
  }, [recipientId]);

  useEffect(() => {
    paymentPageConfig.current = new PaymentPageConfig(recipientId);
  }, [recipientId]);

  function listenPaymentPageConfigUpdated() {
    const goals = paymentPageConfig.current?.goals ?? [];
    setGoals(goals);
    log.debug({ goals: goals });
  }

  useEffect(() => {
    document.addEventListener(
      "paymentPageUpdated",
      listenPaymentPageConfigUpdated,
    );
    return () =>
      document.removeEventListener(
        "paymentPageUpdated",
        listenPaymentPageConfigUpdated,
      );
  }, [recipientId]);

  const fontSize = findSetting(settings, "fontSize", "24");
  const font = findSetting(settings, "font", "Alice");
  const textColor = findSetting(settings, "textColor", "black");
  const textStyle = {
    fontSize: fontSize ? fontSize + "px" : "unset",
    fontFamily: font ? font : "unset",
    fontWeight: 600,
    color: textColor,
  };

  const backgroundColor = findSetting(settings, "backgroundColor", "lightgray");
  const progressbarStyle = {
    backgroundColor: backgroundColor,
  };

  const filledColor = findSetting(settings, "filledColor", "green");
  const filledStyle = {
    backgroundColor: filledColor,
  };
  const filledTextColor = findSetting(settings, "filledTextColor", "white");
  const filledFontSize = findSetting(settings, "filledFontSize", "24");
  const filledFont = findSetting(settings, "font", "Russo One");
  const filledTextStyle = {
    fontSize: filledFontSize ? filledFontSize + "px" : "unset",
    fontFamily: filledFont ? filledFont : "unset",
    color: filledTextColor,
  };

  return (
    <>
      <FontImport font={font} />
      <FontImport font={filledFont} />
      {goals.map((goal) => (
        <>
          <div className={`${classes.goalitem}`}>
            <div style={textStyle} className={`${classes.goaldescription}`}>
              {goal.briefDescription}
            </div>
            <div
              style={{
                backgroundColor: backgroundColor,
              }}
              className={`${classes.goalprogressbar}`}
            ></div>
            <div
              style={{
                width: `${
                  goal.accumulatedAmount.major / goal.requiredAmount.major * 100
                }%`,
                backgroundColor: filledColor
              }}
              className={`${classes.goalfilled}`}
            ></div>
            <div style={filledTextStyle} className={`${classes.goalamount}`}>
              {goal.accumulatedAmount.major} / {goal.requiredAmount.major} RUB
            </div>
          </div>
        </>
      ))}
    </>
  );
}
