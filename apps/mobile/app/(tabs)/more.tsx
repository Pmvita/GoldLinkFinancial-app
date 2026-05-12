import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Card } from "@/src/components/Card";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { clearSession } from "@/src/session";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { colors, radius, spacing, typography } from "@/src/theme";

interface MoreItem {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  route: string;
}

const ITEMS: MoreItem[] = [
  {
    key: "billpay",
    label: "Bill Pay",
    description: "Pay payees and manage recurring bills",
    icon: "file-text",
    route: "/more/billpay",
  },
  {
    key: "deposit",
    label: "Mobile Deposit",
    description: "Deposit a check using your camera",
    icon: "camera",
    route: "/more/deposit",
  },
  {
    key: "budgeting",
    label: "Budgeting",
    description: "Track spending by category and goal",
    icon: "pie-chart",
    route: "/more/budgeting",
  },
  {
    key: "settings",
    label: "Settings",
    description: "Profile, security, and preferences",
    icon: "settings",
    route: "/more/settings",
  },
];

export default function MoreScreen() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await clearSession();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <Screen noPadding>
      <ScrollView contentContainerStyle={styles.scroll}>
        {user ? (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{user.fullName}</Text>
              <Text style={styles.profileMeta}>{user.tierName}</Text>
              {user.relationshipManager ? (
                <Text style={styles.profileRm}>
                  RM: {user.relationshipManager}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        <SectionHeader title="More" subtitle="Banking tools & settings" />
        <Card>
          {ITEMS.map((item, idx) => (
            <Pressable
              key={item.key}
              onPress={() =>
                router.push(item.route as never)
              }
              style={({ pressed }) => [
                styles.row,
                idx !== ITEMS.length - 1 && styles.rowBorder,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.rowIcon}>
                <Feather name={item.icon} size={16} color={colors.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowDescription}>{item.description}</Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={colors.textMuted}
              />
            </Pressable>
          ))}
        </Card>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.signOut,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Feather name="log-out" size={16} color={colors.danger} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(204,168,88,0.10)",
    borderColor: "rgba(204,168,88,0.35)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.gold,
    fontSize: typography.size.md,
    fontWeight: "600",
    letterSpacing: typography.letterSpacing.wide,
  },
  profileName: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: "500",
  },
  profileMeta: {
    color: colors.gold,
    fontSize: typography.size.xs,
    marginTop: 2,
    letterSpacing: typography.letterSpacing.wide,
  },
  profileRm: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: "rgba(204,168,88,0.10)",
    borderColor: "rgba(204,168,88,0.25)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: "500",
  },
  rowDescription: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderColor: "rgba(239,68,68,0.25)",
    borderWidth: 1,
    backgroundColor: "rgba(239,68,68,0.05)",
    marginTop: spacing.md,
  },
  signOutText: {
    color: colors.danger,
    fontSize: typography.size.sm,
    fontWeight: "600",
    letterSpacing: typography.letterSpacing.wide,
  },
});
