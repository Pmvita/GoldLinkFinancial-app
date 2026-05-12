import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  formatCurrency,
  formatDate,
  getAccountById,
  getTransactionsForAccount,
  maskAccountNumber,
} from "@goldlink/core";

import { Card } from "@/src/components/Card";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { colors, gradients, radius, spacing, typography } from "@/src/theme";

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const account = useMemo(
    () => (id ? getAccountById(id) : undefined),
    [id],
  );
  const txns = useMemo(
    () => (id ? getTransactionsForAccount(id) : []),
    [id],
  );

  if (!account) {
    return (
      <>
        <Stack.Screen options={{ title: "Account" }} />
        <Screen>
          <View style={styles.center}>
            <ActivityIndicator color={colors.gold} />
          </View>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: account.name }} />
      <Screen noPadding>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={gradients.carbon as unknown as readonly [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.heroLabel}>{account.name}</Text>
            <Text style={styles.heroAmount}>
              {formatCurrency(account.balance, account.currency)}
            </Text>
            <View style={styles.metaRow}>
              <Feather name="hash" size={12} color={colors.textMuted} />
              <Text style={styles.metaText}>
                {maskAccountNumber(account.accountNumber)}
              </Text>
              <Text style={styles.metaDivider}>·</Text>
              <Text style={styles.metaText}>
                Routing {account.routingNumber}
              </Text>
            </View>
            {account.interestRate ? (
              <View style={styles.rateBadge}>
                <Feather name="trending-up" size={12} color={colors.gold} />
                <Text style={styles.rateBadgeText}>
                  {account.interestRate.toFixed(2)}% APY
                </Text>
              </View>
            ) : null}
          </View>

          <SectionHeader
            title="Transactions"
            subtitle={`${txns.length} on this account`}
          />
          <Card>
            {txns.length === 0 ? (
              <Text style={styles.emptyText}>No transactions yet.</Text>
            ) : (
              txns.map((txn, idx) => (
                <View
                  key={txn.id}
                  style={[
                    styles.txnRow,
                    idx !== txns.length - 1 && styles.txnRowBorder,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txnDesc} numberOfLines={1}>
                      {txn.description}
                    </Text>
                    <Text style={styles.txnMeta}>
                      {formatDate(txn.date)} ·{" "}
                      <Text style={{ color: colors.gold }}>{txn.category}</Text>
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.txnAmount,
                      {
                        color:
                          txn.amount >= 0
                            ? colors.success
                            : colors.textPrimary,
                      },
                    ]}
                  >
                    {txn.amount >= 0 ? "+" : "−"}
                    {formatCurrency(Math.abs(txn.amount), account.currency)}
                  </Text>
                </View>
              ))
            )}
          </Card>
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  heroCard: {
    borderRadius: radius.lg,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: "hidden",
    padding: spacing.xl,
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
    flexWrap: "wrap",
  },
  metaText: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
  metaDivider: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
  },
  rateBadge: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
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
  rateBadgeText: {
    color: colors.goldLight,
    fontSize: typography.size.xs,
    fontWeight: "500",
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
  txnDesc: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: "500",
  },
  txnMeta: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: typography.size.sm,
    fontWeight: "600",
  },
});
