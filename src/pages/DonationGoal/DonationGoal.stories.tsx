import type { Meta, StoryObj } from "@storybook/react";
import { DonationGoal } from "./DonationGoal";
import { createMockGoal, createMockGoals, createMockSettings, MockVariableStoreProvider } from "./DonationGoal.test-utils";
import type { AbstractDonationGoalState } from "./DonationGoalState";
import type { DonationGoalWidgetSettings } from "../../components/ConfigurationPage/widgetsettings/DonationGoalWidgetSettings";

const meta: Meta<typeof DonationGoal> = {
  title: "Widgets/DonationGoal",
  component: DonationGoal,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <MockVariableStoreProvider>
        <div
          style={{
            width: "500px",
            height: "200px",
            padding: "16px",
            fontFamily: "sans-serif",
          }}
        >
          <Story />
        </div>
      </MockVariableStoreProvider>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DonationGoal>;

/* ──────────────────────────────────────────────
   Default — 1 goal, 50% progress
   ────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    state: { goals: [createMockGoal()] } as AbstractDonationGoalState,
    settings: createMockSettings([createMockGoal()]) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   MultipleGoals — three goals at various stages
   ────────────────────────────────────────────── */
export const MultipleGoals: Story = {
  args: {
    state: { goals: createMockGoals() } as AbstractDonationGoalState,
    settings: createMockSettings(createMockGoals()) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   Complete — goal at 100 %
   ────────────────────────────────────────────── */
export const Complete: Story = {
  args: {
    state: {
      goals: [
        createMockGoal({
          id: "goal-complete",
          briefDescription: "Goal Complete!",
          accumulatedAmount: { major: 100, currency: "RUB" },
          requiredAmount: { major: 100, currency: "RUB" },
        }),
      ],
    } as AbstractDonationGoalState,
    settings: createMockSettings([
      createMockGoal({
        id: "goal-complete",
        briefDescription: "Goal Complete!",
        accumulatedAmount: { major: 100, currency: "RUB" },
        requiredAmount: { major: 100, currency: "RUB" },
      }),
    ]) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   ZeroProgress — goal with 0 accumulated
   ────────────────────────────────────────────── */
export const ZeroProgress: Story = {
  args: {
    state: {
      goals: [
        createMockGoal({
          id: "goal-zero",
          briefDescription: "Fresh Goal",
          accumulatedAmount: { major: 0, currency: "RUB" },
          requiredAmount: { major: 100, currency: "RUB" },
        }),
      ],
    } as AbstractDonationGoalState,
    settings: createMockSettings([
      createMockGoal({
        id: "goal-zero",
        briefDescription: "Fresh Goal",
        accumulatedAmount: { major: 0, currency: "RUB" },
        requiredAmount: { major: 100, currency: "RUB" },
      }),
    ]) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   NoLabel — label overlay hidden
   ────────────────────────────────────────────── */
export const NoLabel: Story = {
  args: {
    state: { goals: [createMockGoal()] } as AbstractDonationGoalState,
    settings: createMockSettings([createMockGoal()], {
      showLabel: false,
    }) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   NoTitle — goal title hidden
   ────────────────────────────────────────────── */
export const NoTitle: Story = {
  args: {
    state: { goals: [createMockGoal()] } as AbstractDonationGoalState,
    settings: createMockSettings([createMockGoal()], {
      showTitle: false,
    }) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   FilledTextPlacementTop — label above the bar
   ────────────────────────────────────────────── */
export const FilledTextPlacementTop: Story = {
  args: {
    state: { goals: [createMockGoal()] } as AbstractDonationGoalState,
    settings: createMockSettings([createMockGoal()], {
      filledTextPlacement: "top",
      filledTextAlign: "center",
    }) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   FilledTextPlacementBottom — label below the bar
   ────────────────────────────────────────────── */
export const FilledTextPlacementBottom: Story = {
  args: {
    state: { goals: [createMockGoal()] } as AbstractDonationGoalState,
    settings: createMockSettings([createMockGoal()], {
      filledTextPlacement: "bottom",
      filledTextAlign: "center",
    }) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   RightAligned — label text aligned to the right
   ────────────────────────────────────────────── */
export const RightAligned: Story = {
  args: {
    state: { goals: [createMockGoal()] } as AbstractDonationGoalState,
    settings: createMockSettings([createMockGoal()], {
      filledTextAlign: "right",
    }) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   CustomLabel — custom label template
   ────────────────────────────────────────────── */
export const CustomLabel: Story = {
  args: {
    state: { goals: [createMockGoal()] } as AbstractDonationGoalState,
    settings: createMockSettings([createMockGoal()], {
      labelTemplate: "<collected> <currency> of <required> <currency>",
    }) as unknown as DonationGoalWidgetSettings,
  },
};

/* ──────────────────────────────────────────────
   CustomStyling — custom background, borders,
   rounded corners, padding, and box-shadows
   ────────────────────────────────────────────── */
export const CustomStyling: Story = {
  args: {
    state: {
      goals: [
        createMockGoal({
          briefDescription: "Custom Styled Goal",
          accumulatedAmount: { major: 75, currency: "RUB" },
        }),
      ],
    } as AbstractDonationGoalState,
  },
  render: (args) => (
    <DonationGoal
      {...args}
      settings={
        createMockSettings([
          createMockGoal({
            briefDescription: "Custom Styled Goal",
            accumulatedAmount: { major: 75, currency: "RUB" },
          }),
        ], {
          // widget container
          widgetBackgroundColor: {
            calcCss: () => ({ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }),
          },
          borderProperty: { calcCss: () => ({ border: "2px solid #e94560" }) },
          paddingProperty: { calcCss: () => ({ padding: "16px" }) },
          roundingProperty: { calcCss: () => ({ borderRadius: "12px" }) },
          boxShadowProperty: {
            calcCss: () => ({ boxShadow: "0 8px 32px rgba(233, 69, 96, 0.3)" }),
            requiredHeight: 0,
            requiredWidth: 0,
          },
          // title
          showTitle: true,
          titleFontProperty: {
            value: {
              family: "Roboto",
              size: 26,
              color: {
                gradient: false,
                gradientType: 0,
                repeating: false,
                colors: [{ color: "#ffd700" }],
                angle: 0,
              },
              outline: { enabled: false, width: 0, color: "#000000" },
              weight: true,
              italic: false,
              underline: false,
              shadows: [],
              animation: "none",
              animationType: "entire" as const,
              animationSpeed: "slow",
            },
            createFontImport: () => null,
            calcClassName: () => "",
          },
          titleBackgroundColorProperty: {
            calcCss: () => ({ background: "rgba(233, 69, 96, 0.15)" }),
          },
          titleBorderProperty: {
            calcCss: () => ({ borderBottom: "2px solid #e94560" }),
          },
          titlePaddingProperty: { calcCss: () => ({ padding: "8px 12px" }) },
          titleRoundingProperty: { calcCss: () => ({ borderRadius: "8px" }) },
          backgroundColor: {
            calcCss: () => ({ background: "rgba(255,255,255,0.05)" }),
          },
          // progress bar outer
          outerBorderProperty: {
            calcCss: () => ({ border: "1px solid rgba(233, 69, 96, 0.3)" }),
          },
          outerRoundingProperty: { calcCss: () => ({ borderRadius: "8px" }) },
          outerBoxShadowProperty: {
            calcCss: () => ({ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)" }),
            requiredHeight: 0,
            requiredWidth: 0,
          },
          // filled bar
          filledColorProperty: {
            calcCss: () => ({ background: "linear-gradient(90deg, #e94560, #ff6b6b)" }),
          },
          innerRoundingProperty: { calcCss: () => ({ borderRadius: "8px" }) },
          innerBoxShadowProperty: {
            calcCss: () => ({ boxShadow: "0 0 12px rgba(233, 69, 96, 0.6)" }),
            requiredHeight: 0,
            requiredWidth: 0,
          },
          // label
          amountFontProperty: {
            value: {
              family: "Roboto",
              size: 22,
              color: {
                gradient: false,
                gradientType: 0,
                repeating: false,
                colors: [{ color: "#ffffff" }],
                angle: 0,
              },
              outline: { enabled: true, width: 1, color: "#000000" },
              weight: true,
              italic: false,
              underline: false,
              shadows: [],
              animation: "none",
              animationType: "entire" as const,
              animationSpeed: "slow",
            },
            createFontImport: () => null,
            calcClassName: () => "",
          },
          filledTextAlign: "center",
          labelTemplate: "<proportion>%",
        } as Record<string, unknown>) as unknown as DonationGoalWidgetSettings
      }
    />
  ),
};

/* ──────────────────────────────────────────────
   DarkTheme — fully dark themed variant
   ────────────────────────────────────────────── */
export const DarkTheme: Story = {
  args: {
    state: {
      goals: [
        createMockGoal({
          briefDescription: "Dark Theme Goal",
          accumulatedAmount: { major: 60, currency: "RUB" },
        }),
      ],
    } as AbstractDonationGoalState,
  },
  render: (args) => (
    <DonationGoal
      {...args}
      settings={
        createMockSettings([
          createMockGoal({
            briefDescription: "Dark Theme Goal",
            accumulatedAmount: { major: 60, currency: "RUB" },
          }),
        ], {
          widgetBackgroundColor: {
            calcCss: () => ({ background: "#0d0d0d" }),
          },
          borderProperty: { calcCss: () => ({ border: "1px solid #333" }) },
          paddingProperty: { calcCss: () => ({ padding: "20px" }) },
          roundingProperty: { calcCss: () => ({ borderRadius: "8px" }) },
          boxShadowProperty: {
            calcCss: () => ({ boxShadow: "0 4px 24px rgba(0,0,0,0.6)" }),
            requiredHeight: 0,
            requiredWidth: 0,
          },
          titleFontProperty: {
            value: {
              family: "Roboto",
              size: 26,
              color: {
                gradient: false,
                gradientType: 0,
                repeating: false,
                colors: [{ color: "#ffd700" }],
                angle: 0,
              },
              outline: { enabled: false, width: 0, color: "#000000" },
              weight: true,
              italic: false,
              underline: false,
              shadows: [],
              animation: "none",
              animationType: "entire" as const,
              animationSpeed: "slow",
            },
            createFontImport: () => null,
            calcClassName: () => "",
          },
          titleBackgroundColorProperty: {
            calcCss: () => ({ background: "rgba(255,215,0,0.08)" }),
          },
          titleBorderProperty: {
            calcCss: () => ({ borderBottom: "2px solid #ffd700" }),
          },
          titlePaddingProperty: { calcCss: () => ({ padding: "10px 14px" }) },
          titleRoundingProperty: { calcCss: () => ({ borderRadius: "6px" }) },
          backgroundColor: {
            calcCss: () => ({ background: "rgba(255,255,255,0.04)" }),
          },
          outerBorderProperty: { calcCss: () => ({ border: "1px solid #444" }) },
          outerRoundingProperty: { calcCss: () => ({ borderRadius: "6px" }) },
          filledColorProperty: {
            calcCss: () => ({ background: "linear-gradient(90deg, #ffd700, #ffaa00)" }),
          },
          innerRoundingProperty: { calcCss: () => ({ borderRadius: "6px" }) },
          amountFontProperty: {
            value: {
              family: "Roboto",
              size: 22,
              color: {
                gradient: false,
                gradientType: 0,
                repeating: false,
                colors: [{ color: "#ffd700" }],
                angle: 0,
              },
              outline: { enabled: true, width: 1, color: "#000000" },
              weight: true,
              italic: false,
              underline: false,
              shadows: [],
              animation: "none",
              animationType: "entire" as const,
              animationSpeed: "slow",
            },
            createFontImport: () => null,
            calcClassName: () => "",
          },
          filledTextAlign: "center",
          labelTemplate: "<collected> / <required> <currency>",
        } as Record<string, unknown>) as unknown as DonationGoalWidgetSettings
      }
    />
  ),
};
