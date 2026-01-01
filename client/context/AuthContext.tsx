import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl } from "@/lib/query-client";

interface User {
  id: string;
  name: string;
  profileImage: string;
  url: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleAuthToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AUTH_TOKEN_KEY = "popspot_auth_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        setAuthToken(token);
        await fetchUser(token);
      }
    } catch (error) {
      console.log("Error loading auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(new URL("/api/auth/user", getApiUrl()).toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        return true;
      } else {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthToken(null);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.log("Error fetching user:", error);
      return false;
    }
  };

  const handleAuthToken = async (token: string) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      setAuthToken(token);
      await fetchUser(token);
    } catch (error) {
      console.log("Error handling auth token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    if (authToken) {
      await fetchUser(authToken);
    }
  };

  const logout = async () => {
    try {
      if (authToken) {
        await fetch(new URL("/api/auth/logout", getApiUrl()).toString(), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.log("Error logging out:", error);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      setAuthToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        handleAuthToken,
        logout,
        refreshAuth,
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
