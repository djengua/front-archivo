// src/theme/typography.ts
import { TypographyOptions } from "@mui/material/styles";

export const typography: TypographyOptions = {
  fontFamily: [
    "Inter",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ].join(","),

  h1: {
    fontSize: "2.5rem",
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },

  h2: {
    fontSize: "2rem",
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
  },

  h3: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.3,
  },

  h4: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.35,
  },

  h5: {
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  h6: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  body1: {
    fontSize: "1rem",
    lineHeight: 1.5,
    letterSpacing: "0.01em",
  },

  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.43,
    letterSpacing: "0.01em",
  },

  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.5,
    letterSpacing: "0.02em",
    color: "#757575",
  },

  overline: {
    fontSize: "0.75rem",
    lineHeight: 2,
    letterSpacing: "0.08em",
    fontWeight: 500,
    textTransform: "uppercase",
  },
};
