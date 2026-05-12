import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  formatCurrency,
  getAccountsForUser,
  maskAccountNumber,
  type AccountType,
} from "@goldlink/core";

import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { colors, gradients, radius, spacing, typography } from "@/src/theme";

const ACCOUNT_LABELS: Record<AccountType, string> = {
  checking: "Checking",
  savings: "Savings",
  investment: "Investment",
  money_market: "Money Market",
};

const ACCOUNT_ICONS: Record<
  AccountType,
  React.ComponentProps<typeof Feather>["name"]
> = {
  checking: "credit-card",
  savings: "trending-up",
  investment: "bar-chart-2",
  money_market: "dollar-sign",
};

export default function AccountsScreen() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  const accounts = useMemo(
    () => (user ? getAccountsForUser(user.id) : []),
    [user],
  );

  if (loading || !user) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.gold} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen noPadding>
      <ScrollView contentContainerStyle={styles.scroll}>
        <SectionHeader
          title="Your accounts"
          subtitle={`${accounts.length} active ${accounts.length === 1 ? "account" : "accounts"}`}
        />

        {accounts.map((acc) => (
          <Pressable
            key={acc.id}
            onPress={() => router.push(`/accounts/${acc.id}`)}
            style={({ pressed }) => [
              styles.card,
              pressed && { opacity: 0.85 },
            ]}
          >
            <LinearGradient
              colors={gradients.carbon as unknown as readonly [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardHeader}>
              <View style={styles.iconWrap}>
                <Feather
                  name={ACCOUNT_ICONS[acc.type]}
                  size={16}
                  color={colors.gold}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.accountName}>{acc.name}</Text>
                <Text style={styles.accountMeta}>
                  {ACCOUNT_LABELS[acc.type]} · {maskAccountNumber(acc.accountNumber)}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textMuted}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.balanceLabel}>Available balance</Text>
              <Text style={styles.balance}>
                {formatCurrency(acc.balance, acc.currency)}
              </Text>
              {acc.interestRate ? (
                <Text style={styles.rate}>
                  {acc.interestRate.toFixed(2)}% APY
                </Text>
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: "hidden",
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: "rgba(204,168,88,0.10)",
    borderColor: "rgba(204,168,88,0.25)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  accountName: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: "500",
  },
  accountMeta: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    marginTop: 2,
    letterSpacing: typography.letterSpacing.wide,
  },
  cardBody: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
  },
  balance: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: "300",
    marginTop: 4,
  },
  rate: {
    color: colors.gold,
    fontSize: typography.size.xs,
    fontWeight: "500",
    marginTop: 4,
    letterSpacing: typography.letterSpacing.wide,
  },
});
