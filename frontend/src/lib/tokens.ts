// Typed JS mirror of the @theme token block in globals.css.
// Use these for dynamic styles, tests, or canvas-drawing where CSS vars can't reach.

export const colors = {
  primary:        "#9fe870",
  onPrimary:      "#0e0f0c",
  primaryActive:  "#cdffad",
  primaryNeutral: "#c5edab",
  primaryPale:    "#e2f6d5",

  canvas:     "#ffffff",
  canvasSoft: "#e8ebe6",

  ink:     "#0e0f0c",
  inkDeep: "#163300",
  body:    "#454745",
  mute:    "#868685",

  positive:     "#2ead4b",
  positiveDeep: "#054d28",

  warning:        "#ffd11a",
  warningDeep:    "#b86700",
  warningContent: "#4a3b1c",

  negative:        "#d03238",
  negativeDeep:    "#a72027",
  negativeDarkest: "#a7000d",
  negativeBg:      "#320707",

  accentOrange: "#ffc091",
  accentCyan:   "#38c8ff",
} as const;

export const radius = {
  none: "0px",
  sm:   "8px",
  md:   "12px",
  lg:   "16px",
  xl:   "24px",
  pill: "9999px",
  full: "9999px",
} as const;

export const spacing = {
  xxs: "2px",
  xs:  "4px",
  sm:  "8px",
  md:  "12px",
  lg:  "16px",
  xl:  "24px",
  "2xl": "32px",
  "3xl": "48px",
} as const;

export const fontWeight = {
  regular:  400,
  semibold: 600,
  black:    900,
} as const;
