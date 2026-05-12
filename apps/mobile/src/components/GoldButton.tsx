import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, gradients, radius, typography } from "../theme";

interface GoldButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "solid" | "outline";
  style?: ViewStyle;
}

export function GoldButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "solid",
  style,
}: GoldButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === "outline") {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.outlineButton,
          pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.gold} />
        ) : (
          <Text style={styles.outlineLabel}>{label}</Text>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.solidButton,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={gradients.goldFill as unknown as readonly [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.solidInner}>
        {loading ? (
          <ActivityIndicator color={colors.card} />
        ) : (
          <Text style={styles.solidLabel}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  solidButton: {
    height: 52,
    borderRadius: radius.md,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  solidInner: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  solidLabel: {
    color: colors.card,
    fontSize: typography.size.md,
    fontWeight: "600",
    letterSpacing: typography.letterSpacing.wide,
  },
  outlineButton: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gold,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  outlineLabel: {
    color: colors.gold,
    fontSize: typography.size.md,
    fontWeight: "600",
    letterSpacing: typography.letterSpacing.wide,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
