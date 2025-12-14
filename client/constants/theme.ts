import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: "#1976D2",
    link: "#1976D2",
    backgroundRoot: "#FAFAFA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    backgroundTertiary: "#EEEEEE",
    primary: "#1976D2",
    secondary: "#00897B",
    error: "#D32F2F",
    success: "#388E3C",
    warning: "#F57C00",
    bkash: "#E2136E",
    nagad: "#EE4023",
    rocket: "#8B3A9C",
    upay: "#D91E3A",
    border: "#E0E0E0",
    divider: "#EEEEEE",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#42A5F5",
    link: "#42A5F5",
    backgroundRoot: "#121212",
    backgroundDefault: "#1E1E1E",
    backgroundSecondary: "#2C2C2C",
    backgroundTertiary: "#3A3A3A",
    primary: "#42A5F5",
    secondary: "#26A69A",
    error: "#EF5350",
    success: "#66BB6A",
    warning: "#FFA726",
    bkash: "#E2136E",
    nagad: "#EE4023",
    rocket: "#8B3A9C",
    upay: "#D91E3A",
    border: "#3A3A3A",
    divider: "#2C2C2C",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 56,
  "5xl": 64,
  inputHeight: 48,
  buttonHeight: 56,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  full: 9999,
};

export const Typography = {
  headlineMedium: {
    fontSize: 28,
    fontWeight: "500" as const,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: "500" as const,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: "500" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
};

export const Elevation = {
  level1: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 2,
  },
  level2: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 2,
    elevation: 4,
  },
  level3: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "Roboto",
    serif: "serif",
    rounded: "Roboto",
    mono: "monospace",
  },
  web: {
    sans: "Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "Roboto, sans-serif",
    mono: "Roboto Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
