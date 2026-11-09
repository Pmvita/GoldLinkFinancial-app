import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import type { User } from "@goldlink/core";

const SESSION_KEY = "goldlinkSession";

const isWeb = Platform.OS === "web";

// On web, expo-secure-store's shim is broken/incomplete, so we use
// window.localStorage. This is acceptable for the demo prototype (no real
// secrets — the login banner explicitly warns it's plaintext / demo only).
// On native (iOS/Android), we keep using expo-secure-store as before.
const hasWebStorage = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    if (hasWebStorage()) {
      window.localStorage.setItem(key, value);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    if (!hasWebStorage()) return null;
    return window.localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    if (hasWebStorage()) {
      window.localStorage.removeItem(key);
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Some SecureStore/native mismatch paths throw; overwriting is a plausible fallback for demo logout.
    try {
      await SecureStore.setItemAsync(key, "");
    } catch {
      // ignore — caller may still navigate away; hooks will bounce to login without a usable session JSON
    }
  }
}

export interface Session {
  userId: string;
  username: string;
  signedInAt: string;
}

export async function saveSession(user: User): Promise<void> {
  const session: Session = {
    userId: user.id,
    username: user.username,
    signedInAt: new Date().toISOString(),
  };
  await setItem(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<Session | null> {
  try {
    const raw = await getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await deleteItem(SESSION_KEY);
}
