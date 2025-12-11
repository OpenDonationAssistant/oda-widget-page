import { CSSProperties, useContext, useEffect, useState } from "react";
import classes from "./DonationGoal.module.css";
import { Goal } from "../../components/ConfigurationPage/widgetproperties/DonationGoalProperty";
import { DonationGoalWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { observer } from "mobx-react-lite";
import { VariableStoreContext } from "../../stores/VariableStore";
import { AbstractDonationGoalState } from "./DonationGoalState";
import { TextRenderer } from "../../components/Renderer/TextRenderer";
import { AlignmentRenderer } from "../../components/Renderer/AlignmentRenderer";

export const DonationGoal = observer(
  ({
    state,
    settings,
  }: {
    state: AbstractDonationGoalState;
    settings: DonationGoalWidgetSettings;
  }) => {
    const variables = useContext(VariableStoreContext);

    const [innerBackgroundImage, setInnerBackgroundImage] =
      useState<CSSProperties>({});
    const [outerBackgroundImage, setOuterBackgroundImage] =
      useState<CSSProperties>({});
    const [titleBackgroundImage, setTitleBackgroundImage] =
      useState<CSSProperties>({});
    const [backgroundImage, setBackgroundImage] = useState<CSSProperties>({});

    const backgroundColor = settings.backgroundColor.calcCss();
    const progressBarBorderStyle = settings.outerBorderProperty.calcCss();

    const outerHeight = {
      ...{ minHeight: "50px" },
      ...settings.outerHeight.calcCss(),
    };
    const outerRoundingStyle = settings.outerRoundingProperty.calcCss();
    const outerBoxShadowStyle = settings.outerBoxShadowProperty.calcCss();
    useEffect(() => {
      settings.outerImageProperty.calcCss().then(setOuterBackgroundImage);
    }, [settings.outerImageProperty.value]);

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
    const filledTextStyle = { justifyContent: filledTextAlign };
    const filledBorderStyle = settings.innerBorderProperty.calcCss();
    const filledRoundingStyle = settings.innerRoundingProperty.calcCss();
    const filledPaddingStyle = settings.innerPaddingProperty.calcCss();
    const filledBoxShadowStyle = settings.innerBoxShadowProperty.calcCss();

    useEffect(() => {
      settings.innerImageProperty.calcCss().then(setInnerBackgroundImage);
    }, [settings.innerImageProperty.value]);

    function calcBarStyle(goal: Goal) {
      const filment = Math.floor(
        ((goal.accumulatedAmount?.major ?? 0) / goal.requiredAmount.major) *
          100,
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
        ...innerBackgroundImage,
        zIndex: 1,
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
    useEffect(() => {
      settings.titleBackgroundImageProperty
        .calcCss()
        .then(setTitleBackgroundImage);
    }, [settings.titleBackgroundImageProperty.value]);

    const barPadding = settings.barPadding.calcCss();
    useEffect(() => {
      settings.backgroundImage.calcCss().then(setBackgroundImage);
    }, [settings.backgroundImage.value]);

    const ids = settings.goalProperty.value.map((goal) => {
      return goal.id;
    });

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
          ...settings.width.calcCss(),
          ...settings.height.calcCss(),
        }}
      >
        {state.goals
          .filter((goal) => ids.includes(goal.id))
          .map((goal) => (
            <>
              <div className={`${classes.goalitem}`}>
                {settings.showTitle && (
                  <AlignmentRenderer
                    alignment={settings.titleTextAlign}>
                    <div
                      style={{
                        ...titleBorderStyle,
                        ...titlePaddingStyle,
                        ...titleRoundingStyle,
                        ...titleBoxShadowStyle,
                        ...titleBackgroundColorStyle,
                        ...titleBackgroundImage,
                        ...settings.titleHeight.calcCss(),
                        ...settings.titleWidth.calcCss(),
                      }}
                      className={`${classes.goaldescription}}`}
                    >
                      <TextRenderer
                        text={variables.processTemplate(goal.briefDescription)}
                        font={settings.titleFontProperty}
                      />
                    </div>
                  </AlignmentRenderer>
                )}
                <div
                  style={{
                    ...{ display: "grid" },
                    ...barPadding,
                  }}
                >
                  <div
                    style={{
                      ...progressBarBorderStyle,
                      ...outerRoundingStyle,
                      ...outerHeight,
                      zIndex: 0,
                    }}
                    className={`${classes.goalprogressbar}`}
                  >
                    <div
                      style={{
                        zIndex: 0,
                        ...{ width: "100%", height: "100%" },
                        ...outerRoundingStyle,
                        ...backgroundColor,
                        ...outerBoxShadowStyle,
                        ...outerBackgroundImage,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      ...calcBarStyle(goal),
                      ...{
                        ...{ minHeight: "50px" },
                        ...settings.filledHeight.calcCss(),
                      },
                    }}
                    className={`${classes.goalfilled}`}
                  />
                  <div className={`${classes.goalunfilled}`}></div>
                  {settings.showLabel && (
                    <div
                      style={{
                        ...filledTextStyle,
                        ...filledTextPlacement,
                        zIndex: 3,
                      }}
                      className={`${classes.goalamount}`}
                    >
                      <TextRenderer
                        font={settings.amountFontProperty}
                        text={variables
                          .processTemplate(settings.labelTemplate)
                          .replaceAll(
                            "<collected>",
                            `${goal.accumulatedAmount?.major ?? 0}`,
                          )
                          .replaceAll(
                            "<required>",
                            `${goal.requiredAmount.major}`,
                          )
                          .replaceAll("<currency>", "RUB")
                          .replaceAll(
                            "<proportion>",
                            `${Math.trunc(
                              ((goal.accumulatedAmount?.major ?? 0) /
                                goal.requiredAmount.major) *
                                100,
                            )}`,
                          )}
                      />
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
