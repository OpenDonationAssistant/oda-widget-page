import React, {
  CSSProperties,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLoaderData } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { log } from "../../logging";
import classes from "./DonationGoal.module.css";
import { findSetting } from "../utils";
import { PaymentPageConfig } from "../MediaWidget/PaymentPageConfig";
import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";
import { produce } from "immer";
import { AnimatedFontProperty } from "../ConfigurationPage/widgetproperties/AnimatedFontProperty";
import { WidgetSettingsContext } from "../../contexts/WidgetSettingsContext";
import {
  BorderProperty, BorderPropertyValue,
} from "../ConfigurationPage/widgetproperties/BorderProperty";
import {
  RoundingProperty,
} from "../ConfigurationPage/widgetproperties/RoundingProperty";
import { ColorProperty, ColorPropertyTarget, DEFAULT_COLOR_PROPERTY_VALUE } from "../ConfigurationPage/widgetproperties/ColorProperty";

export default function DonationGoal({}) {
  const { recipientId, conf } = useLoaderData() as WidgetData;
  const paymentPageConfig = useRef<PaymentPageConfig | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const { widgetId, settings, subscribe, unsubscribe } = useContext(
    WidgetSettingsContext,
  );

  useEffect(() => {
    subscribe(conf.topic.goal, (message) => {
      log.debug({ goalCommand: message }, "received goals command");
      const updatedGoal = JSON.parse(message.body) as any;
      setGoals((actualGoals) => {
        const updatedGoals = actualGoals.map((goal) => {
          if (goal.id === updatedGoal.goalId) {
            const update = produce(goal, (draft) => {
              draft.accumulatedAmount.major =
                updatedGoal.accumulatedAmount.major;
            });
            return update;
          }
          return goal;
        });
        return updatedGoals;
      });
      message.ack();
    });
    return () => {
      unsubscribe(conf.topic.goal);
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
    value: findSetting(settings, "descriptionFont", null),
  });
  const amountFont = new AnimatedFontProperty({
    widgetId: widgetId,
    name: "amountFont",
    value: findSetting(settings, "amountFont", null),
  });
  const titleTextAlign = findSetting(settings, "titleTextAlign", "left");
  const labelTemplate = findSetting(
    settings,
    "labelTemplate",
    "<collected> / <required> <currency>",
  );
  const textStyle = produce(titleFont.calcStyle(), (draft) => {
    draft.textAlign = titleTextAlign;
  });

  const backgroundColor = new ColorProperty({
    widgetId: widgetId,
    name: "backgroundColor",
    value: findSetting(
      settings,
      "backgroundColor",
      DEFAULT_COLOR_PROPERTY_VALUE,
    ),
    displayName: "",
    target: ColorPropertyTarget.BACKGROUND
  }).calcCss();

  const progressBarBorderStyle = new BorderProperty({
    widgetId: widgetId,
    name: "outerBorder",
    value: findSetting(settings, "outerBorder", new BorderPropertyValue()),
  }).calcCss();

  const outerRoundingStyle = new RoundingProperty({
    widgetId: widgetId,
    name: "outerRounding",
    value: findSetting(
      settings,
      "outerRounding",
      DEFAULT_ROUNDING_PROPERTY_VALUE,
    ),
  }).calcCss();

  const progressbarStyle = {
    ...backgroundColor,
    ...progressBarBorderStyle,
    ...outerRoundingStyle,
  };

  const filledColor = new ColorProperty({
    widgetId: widgetId,
    name: "filledColor",
    value: findSetting(settings, "filledColor", DEFAULT_COLOR_PROPERTY_VALUE),
    displayName: "",
    target: ColorPropertyTarget.BACKGROUND,
  }).calcCss();

  let filledTextAlign = findSetting(settings, "filledTextAlign", "left");
  switch (filledTextAlign) {
    case "left":
      filledTextAlign = "flex-start";
      break;
    case "right":
      filledTextAlign = "flex-end";
      break;
  }
  const filledTextStyle = produce(amountFont.calcStyle(), (draft) => {
    draft.justifyContent = filledTextAlign;
  });

  const filledBorderStyle = new BorderProperty({
    widgetId: widgetId,
    name: "innerBorder",
    value: findSetting(settings, "innerBorder", new BorderPropertyValue()),
  }).calcCss();

  const filledRoundingStyle = new RoundingProperty({
    widgetId: widgetId,
    name: "innerRounding",
    value: findSetting(
      settings,
      "innerRounding",
      new BorderPropertyValue(),
    ),
  }).calcCss();

  function calcBarStyle(goal: Goal) {
    const style: CSSProperties = {
      width: `${
        (goal.accumulatedAmount.major / goal.requiredAmount.major) * 100
      }%`,
    };
    const result = {
      ...style,
      ...filledBorderStyle,
      ...filledRoundingStyle,
      ...filledColor,
    };
    return result;
  }

  const widgetBorderStyle = new BorderProperty({
    widgetId: widgetId,
    name: "border",
    value: findSetting(settings, "border", new BorderPropertyValue()),
  }).calcCss();

  return (
    <div style={widgetBorderStyle}>
      {amountFont.createFontImport()}
      {titleFont.createFontImport()}
      {goals.map((goal) => (
        <>
          <div className={`${classes.goalitem}`}>
            <div
              style={textStyle}
              className={`${
                classes.goaldescription
              } ${titleFont.calcClassName()}`}
            >
              {goal.briefDescription}
            </div>
            <div
              style={progressbarStyle}
              className={`${classes.goalprogressbar}`}
            ></div>
            <div
              style={calcBarStyle(goal)}
              className={`${classes.goalfilled}`}
            ></div>
            <div
              style={filledTextStyle}
              className={`${classes.goalamount} ${amountFont.calcClassName()}`}
            >
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
    </div>
  );
}
