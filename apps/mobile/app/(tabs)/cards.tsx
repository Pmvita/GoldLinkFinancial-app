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
  getCardsForUser,
  type Card as CardModel,
} from "@goldlink/core";

import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { colors, gradients, radius, spacing, typography } from "@/src/theme";

export default function CardsScreen() {
  const { user, loading } = useCurrentUser();
  const cards = useMemo(
    () => (user ? getCardsForUser(user.id) : []),
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
          title="Your cards"
          subtitle={`${cards.length} ${cards.length === 1 ? "card" : "cards"} on file`}
        />
        {cards.map((card) => (
          <CreditCardTile key={card.id} card={card} />
        ))}
      </ScrollView>
    </Screen>
  );
}

function CreditCardTile({ card }: { card: CardModel }) {
  const isCredit = card.type === "credit";
  return (
    <View style={styles.cardWrap}>
      <LinearGradient
        colors={
          card.status === "active"
            ? (gradients.carbon as unknown as readonly [string, string])
            : (["#2a1f1f", "#1a1216"] as unknown as readonly [string, string])
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardTopRow}>
        <Text style={styles.cardName}>{card.name}</Text>
        <View
          style={[
            styles.statusBadge,
            card.status === "active"
              ? styles.statusActive
              : styles.statusFrozen,
          ]}
        >
          <Feather
            name={card.status === "active" ? "check" : "lock"}
            size={10}
            color={card.status === "active" ? colors.success : colors.danger}
          />
          <Text
            style={[
              styles.statusText,
              {
                color:
                  card.status === "active" ? colors.success : colors.danger,
              },
            ]}
          >
            {card.status}
          </Text>
        </View>
      </View>

      <Text style={styles.cardNumber}>
        {`\u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  ${card.lastFour}`}
      </Text>

      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardMetaLabel}>Network</Text>
          <Text style={styles.cardMetaValue}>{card.network}</Text>
        </View>
        <View>
          <Text style={styles.cardMetaLabel}>Expires</Text>
          <Text style={styles.cardMetaValue}>{card.expiryDate}</Text>
        </View>
        {isCredit && card.availableCredit !== null ? (
          <View>
            <Text style={styles.cardMetaLabel}>Available</Text>
            <Text style={[styles.cardMetaValue, { color: colors.gold }]}>
              {formatCurrency(card.availableCredit)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  cardWrap: {
    borderRadius: radius.lg,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: "hidden",
    padding: spacing.lg,
    minHeight: 170,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  statusActive: {
    backgroundColor: "rgba(16,185,129,0.10)",
    borderColor: "rgba(16,185,129,0.35)",
  },
  statusFrozen: {
    backgroundColor: "rgba(239,68,68,0.10)",
    borderColor: "rgba(239,68,68,0.35)",
  },
  statusText: {
    fontSize: typography.size.xs,
    textTransform: "uppercase",
    letterSpacing: typography.letterSpacing.wide,
    fontWeight: "600",
  },
  cardNumber: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    letterSpacing: typography.letterSpacing.wider,
    marginVertical: spacing.md,
    fontVariant: ["tabular-nums"],
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  cardMetaLabel: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  cardMetaValue: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: "500",
  },
});
