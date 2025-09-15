"use client";

import { ReactNode, useState, useCallback } from "react";
import { AuthContext, UserT } from "./AuthContext";
import { useRouter } from "next/navigation";
import { signoutAction } from "@/app/actions/auth/authActions";
import Cookies from "js-cookie";
import { ActiveBoardT } from "@/app/(auth)/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserT | null>(null);
  const [activeBoard, setActiveBoard] = useState<ActiveBoardT>(null);
  const [loading, setLoading] = useState(false);
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

  const setUserActiveBoard = useCallback((activeBoard: ActiveBoardT) => {
    setActiveBoard(activeBoard);
  }, []);

  // // useMemo so the context value is stable
  // const value = useMemo(
  //   () => ({ user, setUserAuth, logout }),
  //   [user, setUserAuth]
  // );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserAuth,
        logout,
        loadingLogout: loading,
        activeBoard,
        setUserActiveBoard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
