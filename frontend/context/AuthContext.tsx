"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { User, LoginPayload, RegisterPayload } from "@/types";
import { authApi } from "@/lib/authApi";
import { usePathname } from "next/navigation";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = useCallback(async () => {
    try {
      const user = await authApi.user();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    getUserData();
  }, [pathname, getUserData]);

  const login = async (payload: LoginPayload) => {
    await authApi.login(payload);
    await getUserData();
  };

  const register = async (payload: RegisterPayload) => {
    await authApi.register(payload);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}