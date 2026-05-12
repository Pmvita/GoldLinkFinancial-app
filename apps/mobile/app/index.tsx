import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";

import { Logo } from "@/src/components/Logo";
import { getSession } from "@/src/session";
import { colors, gradients, typography } from "@/src/theme";

type Status = "checking" | "in" | "out";

export default function SplashIndex() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();
    (async () => {
      const session = await getSession();
      const elapsed = Date.now() - start;
      const minMs = 800;
      if (elapsed < minMs) {
        await new Promise((r) => setTimeout(r, minMs - elapsed));
      }
      if (cancelled) return;
      setStatus(session ? "in" : "out");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "in") return <Redirect href="/(tabs)/dashboard" />;
  if (status === "out") return <Redirect href="/login" />;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.splash as unknown as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>
        <Logo size="lg" />
        <Text style={styles.tagline}>
          Private banking for the extraordinary.
        </Text>
        <ActivityIndicator color={colors.gold} style={{ marginTop: 24 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    letterSpacing: typography.letterSpacing.wide,
    marginTop: 18,
    textAlign: "center",
  },
});
