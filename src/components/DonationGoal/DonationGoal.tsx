import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import {
  cleanupCommandListener,
  setupCommandListener,
  subscribe,
  unsubscribe,
} from "../../socket";
import { log } from "../../logging";
import classes from "./DonationGoal.module.css";
import { findSetting } from "../utils";
import { PaymentPageConfig } from "../MediaWidget/PaymentPageConfig";
import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";
import FontImport from "../FontImport/FontImport";
import { produce } from "immer";
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";

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
      setTimeout(() => navigate(0), 20000);
    });
    setupCommandListener(widgetId, () => navigate(0));
    return () => {
      unsubscribe(widgetId, conf.topic.goal);
      cleanupCommandListener(widgetId);
    };
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

  const titleFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "descriptionFont",
    value: findSetting(settings, "descriptionFont", null)
  });
  const amountFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "amountFont",
    value: findSetting(settings, "amountFont", null)
  });
  const titleTextAlign = findSetting(settings, "titleTextAlign", "left");
  const labelTemplate = findSetting(
    settings,
    "labelTemplate",
    "<collected> / <required> <currency>",
  );
  const textStyle = produce(titleFont.calcStyle(),(draft) => {
    draft.textAlign = titleTextAlign;
  });

  const backgroundColor = findSetting(settings, "backgroundColor", "lightgray");
  const progressbarStyle = {
    backgroundColor: backgroundColor,
  };

  const filledColor = findSetting(settings, "filledColor", "green");
  let filledTextAlign = findSetting(settings, "filledTextAlign", "left");
  switch (filledTextAlign) {
    case "left":
      filledTextAlign = "flex-start";
      break;
    case "right":
      filledTextAlign = "flex-end";
      break;
  }
  const filledTextStyle = produce(amountFont.calcStyle(),(draft) => {
    draft.justifyContent = filledTextAlign;
  });

  return (
    <>
      {amountFont.createFontImport()}
      {titleFont.createFontImport()}
      {goals.map((goal) => (
        <>
          <div className={`${classes.goalitem}`}>
            <div style={textStyle} className={`${classes.goaldescription} ${titleFont.calcClassName()}`}>
              {goal.briefDescription}
            </div>
            <div
              style={progressbarStyle}
              className={`${classes.goalprogressbar}`}
            ></div>
            <div
              style={{
                width: `${
                  (goal.accumulatedAmount.major / goal.requiredAmount.major) *
                  100
                }%`,
                backgroundColor: filledColor,
              }}
              className={`${classes.goalfilled}`}
            ></div>
            <div style={filledTextStyle} className={`${classes.goalamount} ${amountFont.calcClassName()}`}>
              {labelTemplate
                .replaceAll("<collected>", goal.accumulatedAmount.major)
                .replaceAll("<required>", goal.requiredAmount.major)
                .replaceAll("<currency>", "RUB")
                .replaceAll(
                  "<proportion>",
                  Math.trunc(
                    (goal.accumulatedAmount.major / goal.requiredAmount.major) *
                    100,
                  ),
                )}
            </div>
          </div>
        </>
      ))}
    </>
  );
}
