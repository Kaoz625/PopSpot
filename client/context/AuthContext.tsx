import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@supabase/supabase-js";

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
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyPhoneOtp: (
    phone: string,
    token: string,
  ) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  demoLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Initialize Supabase client
const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session and listen for auth state changes
  useEffect(() => {
    if (!supabase) return;

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "",
          email: session.user.email,
          phone: session.user.phone,
          avatar:
            session.user.user_metadata?.avatar_url ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        });
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "",
          email: session.user.email,
          phone: session.user.phone,
          avatar:
            session.user.user_metadata?.avatar_url ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const demoLogin = () => {
    setUser({
      id: "demo-user-1",
      name: "Demo User",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isConfigured || !supabase) {
      return {
        error: new Error(
          "Authentication not configured. Please use Demo Mode.",
        ),
      };
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      return { error: new Error(error.message) };
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || email.split("@")[0],
        email: data.user.email,
        avatar:
          data.user.user_metadata?.avatar_url ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      });
    }

    return { error: null };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!isConfigured || !supabase) {
      return {
        error: new Error(
          "Authentication not configured. Please use Demo Mode.",
        ),
      };
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      return { error: new Error(error.message) };
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || email.split("@")[0],
        email: data.user.email,
        avatar:
          data.user.user_metadata?.avatar_url ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      });
    }

    return { error: null };
  };

  const signInWithPhone = async (phone: string) => {
    if (!isConfigured || !supabase) {
      return {
        error: new Error(
          "Phone authentication not configured. Please use Demo Mode.",
        ),
      };
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    setIsLoading(false);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    if (!isConfigured || !supabase) {
      return {
        error: new Error(
          "Phone verification not configured. Please use Demo Mode.",
        ),
      };
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    setIsLoading(false);

    if (error) {
      return { error: new Error(error.message) };
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || phone,
        phone: data.user.phone,
        avatar:
          data.user.user_metadata?.avatar_url ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      });
    }

    return { error: null };
  };

  const signInWithGoogle = async () => {
    if (!isConfigured || !supabase) {
      return {
        error: new Error(
          "Google sign-in not configured. Please use Demo Mode.",
        ),
      };
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setIsLoading(false);

    if (error) {
      return { error: new Error(error.message) };
    }

    // OAuth redirects will be handled by auth state change listener
    return { error: null };
  };

  const signInWithApple = async () => {
    if (!isConfigured || !supabase) {
      return {
        error: new Error("Apple sign-in not configured. Please use Demo Mode."),
      };
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
    });
    setIsLoading(false);

    if (error) {
      return { error: new Error(error.message) };
    }

    // OAuth redirects will be handled by auth state change listener
    return { error: null };
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
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
