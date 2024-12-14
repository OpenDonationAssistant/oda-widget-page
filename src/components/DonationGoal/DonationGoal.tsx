import { CSSProperties } from "react";
import classes from "./DonationGoal.module.css";
import { Goal } from "../ConfigurationPage/widgetproperties/DonationGoalProperty";
import { produce } from "immer";
import { DonationGoalWidgetSettings } from "../ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import {
  AbstractDonationGoalState,
  DonationGoalState,
} from "./DonationGoalState";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";

export const DonationGoal = observer(
  ({
    state,
    settings,
  }: {
    state: AbstractDonationGoalState;
    settings: DonationGoalWidgetSettings;
  }) => {
    const titleFont = settings.titleFontProperty;
    const titleTextStyle = titleFont.calcStyle();

    let titleTextAlign = { justifyContent: "center" };
    switch (settings.titleTextAlign) {
      case "left":
        titleTextAlign = { justifyContent: "flex-start" };
        break;
      case "right":
        titleTextAlign = { justifyContent: "flex-end" };
        break;
    }

    const backgroundColor = settings.backgroundColor.calcCss();
    const progressBarBorderStyle = settings.outerBorderProperty.calcCss();

    const outerRoundingStyle = settings.outerRoundingProperty.calcCss();
    const outerBoxShadowStyle = settings.outerBoxShadowProperty.calcCss();
    const outerImageStyle = settings.outerImageProperty.calcCss();

    const labelTemplate = settings.labelTemplate;
    const amountFont = settings.amountFontProperty;

    const filledColor = settings.filledColorProperty.calcCss();
    let filledTextAlign = "center";
    switch (settings.filledTextAlign) {
      case "left":
        filledTextAlign = "flex-start";
        break;
      case "right":
        filledTextAlign = "flex-end";
        break;
    }
    let filledTextPlacement: CSSProperties = { gridRow: "2" };
    switch (settings.filledTextPlacement) {
      case "top":
        filledTextPlacement = { gridRow: "1" };
        break;
      case "bottom":
        filledTextPlacement = { gridRow: "3" };
        break;
    }
    const filledTextStyle = produce(amountFont.calcStyle(), (draft) => {
      draft.justifyContent = filledTextAlign;
    });
    const filledBorderStyle = settings.innerBorderProperty.calcCss();
    const filledRoundingStyle = settings.innerRoundingProperty.calcCss();
    const filledPaddingStyle = settings.innerPaddingProperty.calcCss();
    const filledBoxShadowStyle = settings.innerBoxShadowProperty.calcCss();
    const filledImageStyle = settings.innerImageProperty.calcCss();

    function calcBarStyle(goal: Goal) {
      const filment = Math.floor(
        (goal.accumulatedAmount.major / goal.requiredAmount.major) * 100,
      );
      const style: CSSProperties = {
        width: `${filment < 100 ? filment + "%" : "unset"}`,
      };
      const result = {
        ...style,
        ...filledBorderStyle,
        ...filledRoundingStyle,
        ...filledColor,
        ...filledPaddingStyle,
        ...filledBoxShadowStyle,
        ...filledImageStyle,
      };
      return result;
    }

    const widgetBorderStyle = settings.borderProperty.calcCss();
    const widgetBackgroundColorStyle = settings.widgetBackgroundColor.calcCss();
    const widgetPaddingStyle = settings.paddingProperty.calcCss();
    const widgetRoundingStyle = settings.roundingProperty.calcCss();
    const widgetBoxShadowStyle = settings.boxShadowProperty.calcCss();
    const widgetMarginTopAndBottomStyle =
      settings.boxShadowProperty.requiredHeight;
    const widgetMarginLeftAndRightStyle =
      settings.boxShadowProperty.requiredWidth;

    const titleBorderStyle = settings.titleBorderProperty.calcCss();
    const titlePaddingStyle = settings.titlePaddingProperty.calcCss();
    const titleRoundingStyle = settings.titleRoundingProperty.calcCss();
    const titleBoxShadowStyle = settings.titleBoxShadowProperty.calcCss();
    const titleBackgroundColorStyle =
      settings.titleBackgroundColorProperty.calcCss();
    const titleBackgroundImageStyle =
      settings.titleBackgroundImageProperty.calcCss();

    const barPadding = settings.barPadding.calcCss();
    const backgroundImage = settings.backgroundImage.calcCss();

    return (
      <div
        style={{
          ...widgetBorderStyle,
          ...widgetBackgroundColorStyle,
          ...widgetPaddingStyle,
          ...widgetRoundingStyle,
          ...widgetBoxShadowStyle,
          ...backgroundImage,
          ...{
            marginTop: `${widgetMarginTopAndBottomStyle}px`,
            marginBottom: `${widgetMarginTopAndBottomStyle}px`,
            marginLeft: `${widgetMarginLeftAndRightStyle}px`,
            marginRight: `${widgetMarginLeftAndRightStyle}px`,
          },
          height: `calc(100% - ${widgetMarginTopAndBottomStyle * 2}px)`,
          width: `calc(100% - ${widgetMarginLeftAndRightStyle * 2}px)`,
        }}
      >
        {amountFont.createFontImport()}
        {titleFont.createFontImport()}
        {state.goals.map((goal) => (
          <>
            <div className={`${classes.goalitem}`}>
              {settings.showTitle && (
                <Flex className="full-width" style={titleTextAlign}>
                  <div
                    style={{
                      ...titleTextStyle,
                      ...titleBorderStyle,
                      ...titlePaddingStyle,
                      ...titleRoundingStyle,
                      ...titleBoxShadowStyle,
                      ...titleBackgroundColorStyle,
                      ...titleBackgroundImageStyle,
                    }}
                    className={`${classes.goaldescription}}`}
                  >
                    <div className={`${titleFont.calcClassName()}`}>
                      {goal.briefDescription}
                    </div>
                  </div>
                </Flex>
              )}
              <div
                style={{
                  ...{ display: "grid" },
                  ...barPadding,
                }}
              >
                <div
                  style={{
                    ...backgroundColor,
                    ...progressBarBorderStyle,
                    ...outerRoundingStyle,
                    ...outerBoxShadowStyle,
                    ...outerImageStyle,
                  }}
                  className={`${classes.goalprogressbar}`}
                ></div>
                <div
                  style={calcBarStyle(goal)}
                  className={`${classes.goalfilled}`}
                ></div>
                <div className={`${classes.goalunfilled}`}></div>
                {settings.showLabel && (
                  <div
                    style={{
                      ...filledTextStyle,
                      ...filledTextPlacement
                    }}
                    className={`${
                      classes.goalamount
                    } ${amountFont.calcClassName()}`}
                  >
                    {labelTemplate
                      .replaceAll(
                        "<collected>",
                        `${goal.accumulatedAmount.major}`,
                      )
                      .replaceAll("<required>", `${goal.requiredAmount.major}`)
                      .replaceAll("<currency>", "RUB")
                      .replaceAll(
                        "<proportion>",
                        `${Math.trunc(
                          (goal.accumulatedAmount.major /
                            goal.requiredAmount.major) *
                            100,
                        )}`,
                      )}
                  </div>
                )}
              </div>
            </div>
          </>
        ))}
      </div>
    );
  },
);
