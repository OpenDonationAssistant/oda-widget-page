import classes from "./DonationGoal.module.css";
import { DonationGoalWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";
import { observer } from "mobx-react-lite";
import { useVariableStore } from "../../stores/VariableStore";
import { AbstractDonationGoalState } from "./DonationGoalState";
import { TextRenderer } from "../../components/Renderer/TextRenderer";
import { AlignmentRenderer } from "../../components/Renderer/AlignmentRenderer";
import { uuidv7 } from "uuidv7";
import { VariableScope } from "../../components/ConfigurationPage/widgetsettings/VariableScope";

export const DonationGoal = observer(
  ({
    state,
    settings,
  }: {
    state: AbstractDonationGoalState;
    settings: DonationGoalWidgetSettings;
  }) => {
    const variables = useVariableStore().variablesStore;

    const ids = settings.goalProperty.value.map((goal) => {
      return goal.id;
    });

    return (
      <VariableScope
        variables={[
          {
            id: uuidv7(),
            value: goals,
            name: "items",
            type: "matrix",
          },
        ]}
      >
        {state.goals
          .filter((goal) => ids.includes(goal.id))
          .map((goal) => (
            <>
              <div className={`${classes.goalitem}`}>
                {settings.showTitle && (
                  <AlignmentRenderer alignment={settings.titleTextAlign}>
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
      </VariableScope>
    );
  },
);
