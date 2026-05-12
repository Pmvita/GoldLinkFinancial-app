import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { colors } from "../theme";

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
  noPadding?: boolean;
}

export function Screen({
  children,
  style,
  edges = ["top", "left", "right"],
  noPadding,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <StatusBar style="light" />
      <View style={[styles.inner, !noPadding && styles.padding, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: 20,
  },
});
