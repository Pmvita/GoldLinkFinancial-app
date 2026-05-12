import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getUserById, type User } from "@goldlink/core";

import { getSession } from "../session";

interface UseCurrentUserResult {
  user: User | null;
  loading: boolean;
}

export function useCurrentUser(): UseCurrentUserResult {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await getSession();
      if (cancelled) return;
      if (!session) {
        setLoading(false);
        router.replace("/login");
        return;
      }
      const found = getUserById(session.userId) ?? null;
      if (!cancelled) {
        setUser(found);
        setLoading(false);
        if (!found) router.replace("/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { user, loading };
}
