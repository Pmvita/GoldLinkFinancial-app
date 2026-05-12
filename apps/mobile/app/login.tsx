import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { findUserByCredentials } from "@goldlink/core";

import { GoldButton } from "@/src/components/GoldButton";
import { Logo } from "@/src/components/Logo";
import { saveSession } from "@/src/session";
import { colors, gradients, radius, spacing, typography } from "@/src/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setSubmitting(true);
    const user = findUserByCredentials(username, password);
    if (!user) {
      setSubmitting(false);
      setError("Invalid credentials. Try demo / demo123.");
      return;
    }
    await saveSession(user);
    router.replace("/(tabs)/dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={gradients.splash as unknown as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Logo size="md" />
        </View>

        <View style={styles.demoBanner}>
          <Feather name="info" size={14} color={colors.gold} />
          <Text style={styles.demoText}>
            Demo only — not for production. Plaintext credentials.
          </Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Enter your credentials to access your wealth.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Username or email</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="pmvita"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            textContentType="username"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textFaint}
            secureTextEntry
            style={styles.input}
            textContentType="password"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <GoldButton
          label="Sign In"
          onPress={handleSubmit}
          loading={submitting}
          style={{ marginTop: spacing.lg }}
        />

        <View style={styles.hintsCard}>
          <Text style={styles.hintsTitle}>Demo accounts</Text>
          <Text style={styles.hintsLine}>
            <Text style={styles.hintsTag}>UHNW</Text>  pmvita / admin123
          </Text>
          <Text style={styles.hintsLine}>
            <Text style={styles.hintsTag}>Private</Text>  sarah.johnson@email.com / demo123
          </Text>
          <Text style={styles.hintsLine}>
            <Text style={styles.hintsTag}>Platinum</Text>  demo@bank.com / demo123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: spacing.xxxl + spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(204, 168, 88, 0.08)",
    borderColor: "rgba(204, 168, 88, 0.35)",
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: spacing.xl,
  },
  demoText: {
    color: colors.goldLight,
    fontSize: typography.size.xs,
    letterSpacing: typography.letterSpacing.wide,
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.xxl,
    fontWeight: "300",
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 50,
    color: colors.textPrimary,
    fontSize: typography.size.md,
  },
  error: {
    color: colors.danger,
    fontSize: typography.size.sm,
    marginTop: spacing.sm,
  },
  hintsCard: {
    marginTop: spacing.xxl,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  hintsTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: "500",
    marginBottom: 8,
    letterSpacing: typography.letterSpacing.wide,
  },
  hintsLine: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
    lineHeight: 20,
  },
  hintsTag: {
    color: colors.gold,
    fontWeight: "600",
  },
});
