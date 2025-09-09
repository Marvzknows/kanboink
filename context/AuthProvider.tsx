"use client";

import { ReactNode, useState, useCallback } from "react";
import { AuthContext, UserT } from "./AuthContext";
import { useRouter } from "next/navigation";
import { signoutAction } from "@/app/actions/auth/authActions";
import Cookies from "js-cookie";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserT | null>(null);
  const [loading, setLoading] = useState(false); // ✅ track pending state
  const router = useRouter();

  // useCallback so it doesn't recreate on every render
  const setUserAuth = useCallback((user: UserT | null) => {
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await signoutAction();
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      if (res.success) {
        setUser(null);
        router.push("/auth/signin");
      } else {
        console.error("Logout failed:", res.error);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // // useMemo so the context value is stable
  // const value = useMemo(
  //   () => ({ user, setUserAuth, logout }),
  //   [user, setUserAuth]
  // );

  return (
    <AuthContext.Provider
      value={{ user, setUserAuth, logout, loadingLogout: loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
