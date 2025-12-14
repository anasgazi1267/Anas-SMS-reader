import { Text, type TextProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Typography } from "@/constants/theme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "headlineMedium"
    | "titleLarge"
    | "titleMedium"
    | "bodyLarge"
    | "bodyMedium"
    | "labelLarge"
    | "labelSmall";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "bodyLarge",
  ...rest
}: ThemedTextProps) {
  const { theme, isDark } = useTheme();

  const getColor = () => {
    if (isDark && darkColor) {
      return darkColor;
    }

    if (!isDark && lightColor) {
      return lightColor;
    }

    return theme.text;
  };

  const getTypeStyle = () => {
    switch (type) {
      case "headlineMedium":
        return Typography.headlineMedium;
      case "titleLarge":
        return Typography.titleLarge;
      case "titleMedium":
        return Typography.titleMedium;
      case "bodyLarge":
        return Typography.bodyLarge;
      case "bodyMedium":
        return Typography.bodyMedium;
      case "labelLarge":
        return Typography.labelLarge;
      case "labelSmall":
        return Typography.labelSmall;
      default:
        return Typography.bodyLarge;
    }
  };

  return (
    <Text style={[{ color: getColor() }, getTypeStyle(), style]} {...rest} />
  );
}
