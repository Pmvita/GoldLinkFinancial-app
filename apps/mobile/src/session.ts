import * as SecureStore from "expo-secure-store";
import type { User } from "@goldlink/core";

const SESSION_KEY = "goldlinkSession";

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
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<Session | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
