"use client";

import { ReactNode, useState, useCallback, useMemo } from "react";
import { AuthContext, UserT } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserT | null>(null);

  // useCallback so it doesn't recreate on every render
  const setUserAuth = useCallback((user: UserT | null) => {
    setUser(user);
  }, []);

  // useMemo so the context value is stable
  const value = useMemo(() => ({ user, setUserAuth }), [user, setUserAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
