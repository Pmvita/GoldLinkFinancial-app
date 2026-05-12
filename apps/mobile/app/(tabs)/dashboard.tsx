import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import {
  formatCurrency,
  formatRelativeDate,
  getAccountsForUser,
  getTransactionsForUser,
  getTierInfo,
} from "@goldlink/core";

import { Card } from "@/src/components/Card";
import { Logo } from "@/src/components/Logo";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { colors, gradients, radius, spacing, typography } from "@/src/theme";

export default function DashboardScreen() {
  const { user, loading } = useCurrentUser();

  const accounts = useMemo(
    () => (user ? getAccountsForUser(user.id) : []),
    [user],
  );
  const recent = useMemo(
    () => (user ? getTransactionsForUser(user.id, 6) : []),
    [user],
  );
  const tier = useMemo(
    () => (user ? getTierInfo(user.tier) : undefined),
    [user],
  );

  if (loading || !user) {
    return (
      <Screen>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.gold} />
        </View>
      </Screen>
    );
  }

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <Screen noPadding>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topRow}>
          <Logo size="sm" />
          <View style={styles.tierBadge}>
            <Feather name="award" size={12} color={colors.gold} />
            <Text style={styles.tierText}>{tier?.name ?? user.tierName}</Text>
          </View>
        </View>

        <View style={styles.greetingBlock}>
          <Text style={styles.greetingHello}>Good day,</Text>
          <Text style={styles.greetingName}>{user.firstName}.</Text>
        </View>

        <View style={styles.heroCard}>
          <LinearGradient
            colors={gradients.carbon as unknown as readonly [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroAccent}>
            <LinearGradient
              colors={
                gradients.goldFill as unknown as readonly [
                  string,
                  string,
                  string,
                ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <Text style={styles.heroLabel}>Total balance</Text>
          <Text style={styles.heroAmount}>{formatCurrency(totalBalance)}</Text>
          <Text style={styles.heroSub}>
            Across {accounts.length} active{" "}
            {accounts.length === 1 ? "account" : "accounts"}
          </Text>
        </View>

        <SectionHeader
          title="Recent activity"
          subtitle="Latest transactions across your accounts"
        />
        <Card>
          {recent.length === 0 ? (
            <Text style={styles.emptyText}>No recent transactions.</Text>
          ) : (
            recent.map((txn, idx) => (
              <View
                key={txn.id}
                style={[
                  styles.txnRow,
                  idx !== recent.length - 1 && styles.txnRowBorder,
                ]}
              >
                <View
                  style={[
                    styles.txnIcon,
                    {
                      backgroundColor:
                        txn.type === "credit"
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(204,168,88,0.10)",
                    },
                  ]}
                >
                  <Feather
                    name={txn.type === "credit" ? "arrow-down-left" : "arrow-up-right"}
                    size={14}
                    color={txn.type === "credit" ? colors.success : colors.gold}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txnMerchant} numberOfLines={1}>
                    {txn.merchant}
                  </Text>
                  <Text style={styles.txnDate}>
                    {formatRelativeDate(txn.date)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txnAmount,
                    {
                      color:
                        txn.type === "credit"
                          ? colors.success
                          : colors.textPrimary,
                    },
                  ]}
                >
                  {txn.amount >= 0 ? "+" : "−"}
                  {formatCurrency(Math.abs(txn.amount))}
                </Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(204,168,88,0.10)",
    borderColor: "rgba(204,168,88,0.3)",
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tierText: {
    color: colors.goldLight,
    fontSize: typography.size.xs,
    fontWeight: "500",
    letterSpacing: typography.letterSpacing.wide,
  },
  greetingBlock: {
    marginTop: spacing.sm,
  },
  greetingHello: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    fontWeight: "300",
  },
  greetingName: {
    color: colors.textPrimary,
    fontSize: typography.size.xxl,
    fontWeight: "300",
    letterSpacing: typography.letterSpacing.tight,
  },
  heroCard: {
    borderRadius: radius.lg,
    overflow: "hidden",
    padding: spacing.xl,
    borderColor: colors.border,
    borderWidth: 1,
    minHeight: 140,
    justifyContent: "center",
  },
  heroAccent: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.08,
    overflow: "hidden",
  },
  heroLabel: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroAmount: {
    color: colors.textPrimary,
    fontSize: typography.size.display,
    fontWeight: "300",
    letterSpacing: typography.letterSpacing.tight,
  },
  heroSub: {
    color: colors.textMuted,
    fontSize: typography.size.sm,
    marginTop: 8,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.size.sm,
  },
  txnRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  txnRowBorder: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  txnIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  txnMerchant: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: "500",
  },
  txnDate: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: typography.size.sm,
    fontWeight: "600",
  },
});
