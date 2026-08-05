import { CSSProperties, FC, ReactNode } from "react";
import { VariableStoreContext } from "../../stores/VariableStore";
import type { Goal } from "../../components/ConfigurationPage/widgetproperties/DonationGoalProperty";

/* ──────────────────────────────────────────────
   Goal factories
   ────────────────────────────────────────────── */

export function createMockGoal(overrides?: Partial<Goal>): Goal {
  return {
    id: "goal-1",
    default: true,
    briefDescription: "Test Goal",
    fullDescription: "Long description of the goal",
    accumulatedAmount: { major: 50, currency: "RUB" },
    requiredAmount: { major: 100, currency: "RUB" },
    ...overrides,
  };
}

export function createMockGoals(): Goal[] {
  return [
    createMockGoal({
      id: "goal-1",
      briefDescription: "Goal 1",
      accumulatedAmount: { major: 40, currency: "RUB" },
    }),
    createMockGoal({
      id: "goal-2",
      briefDescription: "Goal 2",
      accumulatedAmount: { major: 150, currency: "RUB" },
      requiredAmount: { major: 200, currency: "RUB" },
    }),
    createMockGoal({
      id: "goal-3",
      briefDescription: "Goal 3 — Done!",
      accumulatedAmount: { major: 100, currency: "RUB" },
      requiredAmount: { major: 100, currency: "RUB" },
    }),
  ];
}

/* ──────────────────────────────────────────────
   CSS helper factories
   ────────────────────────────────────────────── */

function css(style?: CSSProperties): () => CSSProperties {
  return () => style ?? {};
}

function asyncCss(style?: CSSProperties): () => Promise<CSSProperties> {
  return async () => style ?? {};
}

/* ──────────────────────────────────────────────
   Mock font property (shape satisfies TextRenderer)
   ────────────────────────────────────────────── */

export function createMockFont(
  overrides?: Partial<{
    family: string;
    size: number;
    color: string;
    animation: string;
  }>,
) {
  const { family, size, color, animation } = overrides ?? {};
  return {
    value: {
      family: family ?? "Roboto",
      size: size ?? 24,
      color: {
        gradient: false,
        gradientType: 0,
        repeating: false,
        colors: [{ color: color ?? "#ffffff" }],
        angle: 0,
      },
      outline: { enabled: false, width: 0, color: "#000000" },
      weight: false,
      italic: false,
      underline: false,
      shadows: [],
      animation: animation ?? "none",
      animationType: "entire" as const,
      animationSpeed: "slow",
    },
    createFontImport: () => null,
    calcClassName: () => "",
  };
}

/* ──────────────────────────────────────────────
   Mock settings factory
   Every property the component touches gets a
   calcCss() stub (sync or async) + any extra fields.
   ────────────────────────────────────────────── */

export function createMockSettings(
  goals: Goal[],
  overrides?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    /* goals */
    goalProperty: { value: goals },

    /* widget sizing */
    width: { calcCss: css() },
    height: { calcCss: css() },

    /* toggles */
    showLabel: true,
    showTitle: true,

    /* title */
    titleFontProperty: createMockFont(),
    titleTextAlign: { value: "center" },
    titleWidth: { calcCss: css() },
    titleHeight: { calcCss: css() },
    titleBorderProperty: { calcCss: css() },
    titlePaddingProperty: { calcCss: css() },
    titleRoundingProperty: { calcCss: css() },
    titleBoxShadowProperty: {
      calcCss: css(),
      requiredHeight: 0,
      requiredWidth: 0,
    },
    titleBackgroundColorProperty: { calcCss: css() },
    titleBackgroundImageProperty: { calcCss: asyncCss() },

    /* widget container */
    borderProperty: { calcCss: css() },
    widgetBackgroundColor: { calcCss: css() },
    paddingProperty: { calcCss: css() },
    roundingProperty: { calcCss: css() },
    boxShadowProperty: {
      calcCss: css(),
      requiredHeight: 0,
      requiredWidth: 0,
    },
    backgroundImage: { calcCss: asyncCss() },

    /* progress bar outer */
    backgroundColor: { calcCss: css() },
    outerHeight: { calcCss: css() },
    outerBorderProperty: { calcCss: css() },
    outerRoundingProperty: { calcCss: css() },
    outerBoxShadowProperty: {
      calcCss: css(),
      requiredHeight: 0,
      requiredWidth: 0,
    },
    outerImageProperty: { calcCss: asyncCss() },

    /* progress bar filled */
    filledColorProperty: { calcCss: css({ background: "#00FF00" }) },
    filledTextAlign: "center",
    filledTextPlacement: "center",
    filledHeight: { calcCss: css() },
    innerBorderProperty: { calcCss: css() },
    innerRoundingProperty: { calcCss: css() },
    innerPaddingProperty: { calcCss: css() },
    innerBoxShadowProperty: {
      calcCss: css(),
      requiredHeight: 0,
      requiredWidth: 0,
    },
    innerImageProperty: { calcCss: asyncCss() },

    /* label */
    amountFontProperty: createMockFont(),
    labelTemplate: "<collected> / <required> <currency>",

    /* bar padding */
    barPadding: { calcCss: css() },

    ...overrides,
  };
}

/* ──────────────────────────────────────────────
   VariableStore provider (required by the component)
   ────────────────────────────────────────────── */

export const MockVariableStoreProvider: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <VariableStoreContext.Provider
    value={{
      variables: [],
      processTemplate: (t: string) => t,
      load: () => {},
    }}
  >
    {children}
  </VariableStoreContext.Provider>
);
