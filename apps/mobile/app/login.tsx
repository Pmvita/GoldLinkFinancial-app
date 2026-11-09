import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputKeyPressEventData,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { findUserByCredentials, type User } from "@goldlink/core";

import { GoldButton } from "@/src/components/GoldButton";
import { Logo } from "@/src/components/Logo";
import { getMaskedContact } from "@/src/auth";
import { saveSession } from "@/src/session";
import {
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  typography,
} from "@/src/theme";

type LoginStep = "credentials" | "otp" | "biometric";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const BIOMETRIC_DELAY_MS = 1500;

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Step 1 — credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [credentialsSubmitting, setCredentialsSubmitting] = useState(false);

  // Step 2 — OTP
  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendSecondsLeft, setResendSecondsLeft] = useState<number>(
    RESEND_SECONDS,
  );
  const otpInputRefs = useRef<Array<TextInput | null>>(
    Array.from({ length: OTP_LENGTH }, () => null),
  );

  // Step 3 — biometric
  const [biometricBusy, setBiometricBusy] = useState(false);

  // Tick the resend countdown only while we're on the OTP step.
  useEffect(() => {
    if (step !== "otp") return;
    if (resendSecondsLeft <= 0) return;
    const timer = setTimeout(
      () => setResendSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [step, resendSecondsLeft]);

  const clearOtpState = (): void => {
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    setOtpError(null);
    setResendSecondsLeft(RESEND_SECONDS);
  };

  const goBackToCredentials = (): void => {
    setStep("credentials");
    setPendingUser(null);
    setUsername("");
    setPassword("");
    setCredentialsError(null);
    setBiometricBusy(false);
    clearOtpState();
  };

  const handleCredentialsSubmit = async (): Promise<void> => {
    setCredentialsError(null);
    if (!username.trim() || !password) {
      setCredentialsError("Please enter your username and password.");
      return;
    }
    setCredentialsSubmitting(true);
    const user = findUserByCredentials(username, password);
    setCredentialsSubmitting(false);
    if (!user) {
      setCredentialsError("Invalid credentials. Try demo / demo123.");
      return;
    }
    setPendingUser(user);
    clearOtpState();
    setStep("otp");
    // Defer focus until the OTP inputs have actually mounted.
    setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
  };

  const handleOtpDigitChange = (index: number, raw: string): void => {
    const sanitized = raw.replace(/\D/g, "");
    setOtpError(null);

    if (sanitized.length === 0) {
      setOtpDigits((current) => {
        const next = [...current];
        next[index] = "";
        return next;
      });
      return;
    }

    // Single digit: write and advance focus.
    if (sanitized.length === 1) {
      setOtpDigits((current) => {
        const next = [...current];
        next[index] = sanitized;
        return next;
      });
      if (index < OTP_LENGTH - 1) {
        otpInputRefs.current[index + 1]?.focus();
      }
      return;
    }

    // Multi-digit (e.g. iOS autofill / paste): distribute starting from this box.
    setOtpDigits((current) => {
      const next = [...current];
      let cursor = index;
      for (const ch of sanitized) {
        if (cursor >= OTP_LENGTH) break;
        next[cursor] = ch;
        cursor += 1;
      }
      return next;
    });
    const focusTarget = Math.min(index + sanitized.length, OTP_LENGTH - 1);
    otpInputRefs.current[focusTarget]?.focus();
  };

  const handleOtpKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ): void => {
    if (e.nativeEvent.key !== "Backspace") return;
    // If the current box is already empty, move focus back and clear the
    // previous box so the user can keep deleting.
    if (otpDigits[index]) return;
    if (index === 0) return;
    setOtpDigits((current) => {
      const next = [...current];
      next[index - 1] = "";
      return next;
    });
    otpInputRefs.current[index - 1]?.focus();
  };

  const handleOtpSubmit = (): void => {
    const code = otpDigits.join("");
    if (!/^\d{6}$/.test(code)) {
      setOtpError("Please enter the full 6-digit code.");
      return;
    }
    setOtpError(null);
    setStep("biometric");
  };

  const handleResend = (): void => {
    if (resendSecondsLeft > 0) return;
    setResendSecondsLeft(RESEND_SECONDS);
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    setOtpError(null);
    otpInputRefs.current[0]?.focus();
  };

  const finishLogin = async (): Promise<void> => {
    if (!pendingUser) return;
    await saveSession(pendingUser);
    router.replace("/(tabs)/dashboard");
  };

  const handleBiometric = async (): Promise<void> => {
    if (!pendingUser || biometricBusy) return;
    setBiometricBusy(true);
    await new Promise((r) => setTimeout(r, BIOMETRIC_DELAY_MS));
    try {
      await finishLogin();
    } finally {
      setBiometricBusy(false);
    }
  };

  const handleSkipBiometric = async (): Promise<void> => {
    if (!pendingUser || biometricBusy) return;
    await finishLogin();
  };

  const maskedContact = useMemo<string>(
    () =>
      pendingUser
        ? getMaskedContact(pendingUser)
        : "your registered device",
    [pendingUser],
  );

  const subtitle =
    step === "credentials"
      ? "Enter your credentials to access your wealth."
      : step === "otp"
        ? "Please complete two-factor authentication."
        : "One final step to secure your sign-in.";

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

        {step === "credentials" ? (
          <View style={styles.demoBanner}>
            <Feather name="info" size={14} color={colors.gold} />
            <Text style={styles.demoText}>
              Demo only — not for production. Plaintext credentials.
            </Text>
          </View>
        ) : null}

        <StepIndicator step={step} />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {step === "credentials" ? (
          <View>
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

            {credentialsError ? (
              <Text style={styles.error}>{credentialsError}</Text>
            ) : null}

            <GoldButton
              label="Sign In"
              onPress={handleCredentialsSubmit}
              loading={credentialsSubmitting}
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
          </View>
        ) : null}

        {step === "otp" ? (
          <View>
            <Text style={styles.otpHelp}>
              We sent a 6-digit code to{" "}
              <Text style={styles.otpContact}>{maskedContact}</Text>
            </Text>

            <View style={styles.otpRow}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(node) => {
                    otpInputRefs.current[index] = node;
                  }}
                  value={digit}
                  onChangeText={(t) => handleOtpDigitChange(index, t)}
                  onKeyPress={(e) => handleOtpKeyPress(index, e)}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  maxLength={1}
                  textContentType={index === 0 ? "oneTimeCode" : "none"}
                  selectTextOnFocus
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : null,
                  ]}
                  placeholder="•"
                  placeholderTextColor={colors.textFaint}
                />
              ))}
            </View>

            {otpError ? <Text style={styles.error}>{otpError}</Text> : null}

            <GoldButton
              label="Verify code"
              onPress={handleOtpSubmit}
              style={{ marginTop: spacing.lg }}
            />

            <Pressable
              onPress={handleResend}
              disabled={resendSecondsLeft > 0}
              style={({ pressed }) => [
                styles.resendButton,
                pressed && resendSecondsLeft === 0
                  ? styles.resendPressed
                  : null,
              ]}
            >
              <Text
                style={[
                  styles.resendText,
                  resendSecondsLeft > 0 ? styles.resendTextDisabled : null,
                ]}
              >
                {resendSecondsLeft > 0
                  ? `Resend in ${formatCountdown(resendSecondsLeft)}`
                  : "Resend code"}
              </Text>
            </Pressable>

            <Pressable
              onPress={goBackToCredentials}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.resendPressed,
              ]}
            >
              <Feather name="arrow-left" size={14} color={colors.textSecondary} />
              <Text style={styles.backText}>Back to sign-in</Text>
            </Pressable>
          </View>
        ) : null}

        {step === "biometric" ? (
          <View>
            <View style={styles.biometricBadge}>
              <Ionicons
                name="finger-print"
                size={48}
                color={colors.gold}
              />
            </View>

            <Text style={styles.biometricHeadline}>
              Use Face ID / Touch ID to continue
            </Text>
            <Text style={styles.biometricSubcopy}>
              Quickly and securely access your accounts using your device's
              biometrics.
            </Text>

            <Pressable
              onPress={handleBiometric}
              disabled={biometricBusy}
              style={({ pressed }) => [
                styles.biometricButton,
                pressed && !biometricBusy
                  ? styles.biometricButtonPressed
                  : null,
                biometricBusy ? styles.biometricButtonDisabled : null,
              ]}
            >
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
              <View style={styles.biometricButtonInner}>
                {biometricBusy ? (
                  <>
                    <ActivityIndicator color={colors.card} />
                    <Text style={styles.biometricButtonLabel}>
                      Authenticating…
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="finger-print"
                      size={20}
                      color={colors.card}
                    />
                    <Text style={styles.biometricButtonLabel}>
                      Authenticate
                    </Text>
                  </>
                )}
              </View>
            </Pressable>

            <Pressable
              onPress={handleSkipBiometric}
              disabled={biometricBusy}
              style={({ pressed }) => [
                styles.skipButton,
                pressed && !biometricBusy ? styles.resendPressed : null,
              ]}
            >
              <Text style={styles.skipText}>Skip biometric</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (biometricBusy) return;
                setStep("otp");
              }}
              disabled={biometricBusy}
              style={({ pressed }) => [
                styles.backButton,
                pressed && !biometricBusy ? styles.resendPressed : null,
              ]}
            >
              <Feather
                name="arrow-left"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.backText}>Back to verification</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function StepIndicator({ step }: { step: LoginStep }) {
  const order: LoginStep[] = ["credentials", "otp", "biometric"];
  const currentIndex = order.indexOf(step);
  return (
    <View style={styles.stepRow} accessibilityRole="progressbar">
      {order.map((label, i) => {
        const state =
          i < currentIndex ? "done" : i === currentIndex ? "active" : "future";
        return (
          <View
            key={label}
            style={[
              styles.stepDot,
              state === "active" ? styles.stepDotActive : null,
              state === "done" ? styles.stepDotDone : null,
            ]}
          />
        );
      })}
    </View>
  );
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
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
  stepRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: spacing.lg,
  },
  stepDot: {
    height: 4,
    flex: 1,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  stepDotActive: {
    backgroundColor: colors.gold,
  },
  stepDotDone: {
    backgroundColor: colors.goldDark,
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
  otpHelp: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  otpContact: {
    color: colors.gold,
    fontWeight: "600",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: spacing.sm,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.textPrimary,
    textAlign: "center",
    fontSize: typography.size.xl,
    fontWeight: "500",
  },
  otpBoxFilled: {
    borderColor: colors.gold,
  },
  resendButton: {
    alignSelf: "center",
    marginTop: spacing.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resendPressed: {
    opacity: 0.6,
  },
  resendText: {
    color: colors.gold,
    fontSize: typography.size.sm,
    fontWeight: "600",
    letterSpacing: typography.letterSpacing.wide,
  },
  resendTextDisabled: {
    color: colors.textMuted,
    fontWeight: "400",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: 8,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  biometricBadge: {
    alignSelf: "center",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(204, 168, 88, 0.08)",
    borderColor: "rgba(204, 168, 88, 0.35)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.goldGlow,
  },
  biometricHeadline: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  biometricSubcopy: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  biometricButton: {
    height: 56,
    borderRadius: radius.md,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.goldGlow,
  },
  biometricButtonPressed: {
    opacity: 0.9,
  },
  biometricButtonDisabled: {
    opacity: 0.85,
  },
  biometricButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    flex: 1,
    width: "100%",
  },
  biometricButtonLabel: {
    color: colors.card,
    fontSize: typography.size.md,
    fontWeight: "600",
    letterSpacing: typography.letterSpacing.wide,
  },
  skipButton: {
    alignSelf: "center",
    marginTop: spacing.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    color: colors.gold,
    fontSize: typography.size.sm,
    fontWeight: "600",
    letterSpacing: typography.letterSpacing.wide,
  },
});
