import { StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Card } from "@/src/components/Card";
import { Screen } from "@/src/components/Screen";
import { colors, radius, spacing, typography } from "@/src/theme";

const META: Record<
  string,
  {
    title: string;
    description: string;
    icon: React.ComponentProps<typeof Feather>["name"];
  }
> = {
  billpay: {
    title: "Bill Pay",
    description:
      "Pay your payees, schedule recurring bills, and review payment history.",
    icon: "file-text",
  },
  deposit: {
    title: "Mobile Deposit",
    description:
      "Snap photos of the front and back of your check to deposit instantly.",
    icon: "camera",
  },
  budgeting: {
    title: "Budgeting",
    description:
      "Track your spending by category, set monthly budgets, and reach savings goals.",
    icon: "pie-chart",
  },
  settings: {
    title: "Settings",
    description:
      "Manage your profile, biometrics, two-factor auth, and notifications.",
    icon: "settings",
  },
};

export default function MorePlaceholderScreen() {
  const { screen } = useLocalSearchParams<{ screen: string }>();
  const key = (screen ?? "").toLowerCase();
  const meta = META[key] ?? {
    title: "Coming soon",
    description: "This screen isn't built yet.",
    icon: "clock" as const,
  };

  return (
    <>
      <Stack.Screen options={{ title: meta.title }} />
      <Screen>
        <View style={styles.wrap}>
          <Card elevated>
            <View style={styles.iconWrap}>
              <Feather name={meta.icon} size={22} color={colors.gold} />
            </View>
            <Text style={styles.title}>{meta.title}</Text>
            <Text style={styles.body}>{meta.description}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Coming soon</Text>
            </View>
          </Card>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", paddingVertical: spacing.xxl },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "rgba(204,168,88,0.10)",
    borderColor: "rgba(204,168,88,0.25)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: "500",
    marginBottom: 6,
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: "rgba(204,168,88,0.10)",
    borderColor: "rgba(204,168,88,0.3)",
    borderWidth: 1,
  },
  badgeText: {
    color: colors.goldLight,
    fontSize: typography.size.xs,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
  },
});
