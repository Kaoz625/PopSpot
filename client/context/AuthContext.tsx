import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  demoLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoLogin = () => {
    setUser({
      id: "demo-user-1",
      name: "Demo User",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    });
  };

  const signInWithEmail = async (_email: string, _password: string) => {
    if (!isConfigured) {
      return { error: new Error("Authentication not configured. Please use Demo Mode.") };
    }
    return { error: new Error("Email authentication requires Supabase configuration.") };
  };

  const signUpWithEmail = async (_email: string, _password: string) => {
    if (!isConfigured) {
      return { error: new Error("Authentication not configured. Please use Demo Mode.") };
    }
    return { error: new Error("Email sign up requires Supabase configuration.") };
  };

  const signInWithPhone = async (_phone: string) => {
    if (!isConfigured) {
      return { error: new Error("Phone authentication not configured. Please use Demo Mode.") };
    }
    return { error: new Error("Phone authentication requires Supabase configuration.") };
  };

  const verifyPhoneOtp = async (_phone: string, _token: string) => {
    if (!isConfigured) {
      return { error: new Error("Phone verification not configured. Please use Demo Mode.") };
    }
    return { error: new Error("Phone verification requires Supabase configuration.") };
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      return { error: new Error("Google sign-in not configured. Please use Demo Mode.") };
    }
    return { error: new Error("Google sign-in requires Supabase configuration.") };
  };

  const signInWithApple = async () => {
    if (!isConfigured) {
      return { error: new Error("Apple sign-in not configured. Please use Demo Mode.") };
    }
    return { error: new Error("Apple sign-in requires Supabase configuration.") };
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithPhone,
        verifyPhoneOtp,
        signInWithGoogle,
        signInWithApple,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
