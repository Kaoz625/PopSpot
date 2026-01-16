import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Platform } from "react-native";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

// Safely import Apple Authentication (may not be available on all platforms)
let AppleAuthentication: any = null;
try {
  AppleAuthentication = require("expo-apple-authentication");
} catch (e) {
  console.log("Apple Authentication not available");
}

WebBrowser.maybeCompleteAuthSession();

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
  login: () => void; // Alias for demoLogin
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Firebase config (replace with your values or load from env)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const isSupabaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_SUPABASE_URL &&
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
);
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

let firebaseApp;
if (isFirebaseConfigured && getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Choose backend: "firebase" | "supabase"
  const backend = isFirebaseConfigured
    ? "firebase"
    : isSupabaseConfigured
      ? "supabase"
      : "demo";

  const demoLogin = () => {
    setUser({
      id: "demo-user-1",
      name: "Demo User",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (backend === "firebase") {
      try {
        const auth = getAuth();
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser({
          id: result.user.uid,
          name: result.user.displayName || "",
          email: result.user.email || email,
          avatar: result.user.photoURL || "",
        });
        return { error: null };
      } catch (error: any) {
        return { error };
      }
    } else if (backend === "supabase") {
      return {
        error: new Error(
          "Email authentication requires Supabase configuration.",
        ),
      };
    } else {
      return {
        error: new Error(
          "Authentication not configured. Please use Demo Mode.",
        ),
      };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (backend === "firebase") {
      try {
        const auth = getAuth();
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        setUser({
          id: result.user.uid,
          name: result.user.displayName || "",
          email: result.user.email || email,
          avatar: result.user.photoURL || "",
        });
        return { error: null };
      } catch (error: any) {
        return { error };
      }
    } else if (backend === "supabase") {
      return {
        error: new Error("Email sign up requires Supabase configuration."),
      };
    } else {
      return {
        error: new Error(
          "Authentication not configured. Please use Demo Mode.",
        ),
      };
    }
  };

  const signInWithPhone = async (_phone: string) => {
    if (backend === "firebase") {
      return {
        error: new Error(
          "Phone authentication with Firebase requires additional setup.",
        ),
      };
    } else if (backend === "supabase") {
      return {
        error: new Error(
          "Phone authentication requires Supabase configuration.",
        ),
      };
    } else {
      return {
        error: new Error(
          "Phone authentication not configured. Please use Demo Mode.",
        ),
      };
    }
  };

  const verifyPhoneOtp = async (_phone: string, _token: string) => {
    if (backend === "firebase") {
      return {
        error: new Error(
          "Phone OTP verification with Firebase requires additional setup.",
        ),
      };
    } else if (backend === "supabase") {
      return {
        error: new Error("Phone verification requires Supabase configuration."),
      };
    } else {
      return {
        error: new Error(
          "Phone verification not configured. Please use Demo Mode.",
        ),
      };
    }
  };

  const signInWithGoogle = async () => {
    if (backend === "firebase") {
      try {
        if (Platform.OS === "web") {
          const auth = getAuth();
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          setUser({
            id: result.user.uid,
            name: result.user.displayName || "",
            email: result.user.email || "",
            avatar: result.user.photoURL || "",
          });
          return { error: null };
        } else {
          // For mobile, we'll use demo mode for now until proper OAuth is configured
          // Proper implementation requires expo-auth-session with OAuth redirect
          return {
            error: new Error(
              "Google sign-in on mobile requires additional setup. Please use Email or Demo Mode.",
            ),
          };
        }
      } catch (error: any) {
        console.error("Google sign-in error:", error);
        return { error };
      }
    } else if (backend === "supabase") {
      return {
        error: new Error("Google sign-in requires Supabase configuration."),
      };
    } else {
      return {
        error: new Error(
          "Google sign-in not configured. Please use Demo Mode.",
        ),
      };
    }
  };

  const signInWithApple = async () => {
    try {
      if (Platform.OS === "ios") {
        if (!AppleAuthentication) {
          return {
            error: new Error("Apple Authentication module not loaded."),
          };
        }

        // Check if Apple Authentication is available
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        if (!isAvailable) {
          return {
            error: new Error("Apple Sign-In is not available on this device."),
          };
        }

        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        setUser({
          id: credential.user,
          name:
            credential.fullName?.givenName || credential.fullName?.familyName
              ? `${credential.fullName?.givenName || ""} ${credential.fullName?.familyName || ""}`.trim()
              : "Apple User",
          email: credential.email || "",
          avatar: "",
        });
        return { error: null };
      } else if (Platform.OS === "web" && backend === "firebase") {
        const auth = getAuth();
        const provider = new OAuthProvider("apple.com");
        const result = await signInWithPopup(auth, provider);
        setUser({
          id: result.user.uid,
          name: result.user.displayName || "",
          email: result.user.email || "",
          avatar: result.user.photoURL || "",
        });
        return { error: null };
      } else {
        return {
          error: new Error("Apple sign-in is only available on iOS and web."),
        };
      }
    } catch (error: any) {
      console.error("Apple sign-in error:", error);
      if (error.code === "ERR_REQUEST_CANCELED") {
        return { error: new Error("Sign in was cancelled") };
      }
      return { error };
    }
  };

  const logout = async () => {
    if (backend === "firebase") {
      const auth = getAuth();
      await signOut(auth);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isConfigured: backend !== "demo",
        signInWithEmail,
        signUpWithEmail,
        signInWithPhone,
        verifyPhoneOtp,
        signInWithGoogle,
        signInWithApple,
        demoLogin,
        login: demoLogin, // Alias for demoLogin
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
