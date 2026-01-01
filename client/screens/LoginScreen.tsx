import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Image, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { Spacing, Colors } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { handleAuthToken, isLoading } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const extractTokenFromUrl = useCallback((url: string): string | null => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("authToken");
    } catch {
      const match = url.match(/[?&]authToken=([^&]+)/);
      return match ? match[1] : null;
    }
  }, []);

  const handleUrl = useCallback(async (event: { url: string }) => {
    const token = extractTokenFromUrl(event.url);
    if (token) {
      await WebBrowser.dismissBrowser();
      await handleAuthToken(token);
      setIsAuthenticating(false);
    }
  }, [extractTokenFromUrl, handleAuthToken]);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleUrl);
    
    Linking.getInitialURL().then((url) => {
      if (url) {
        const token = extractTokenFromUrl(url);
        if (token) {
          handleAuthToken(token);
        }
      }
    });

    return () => subscription.remove();
  }, [handleUrl, extractTokenFromUrl, handleAuthToken]);

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("authToken");
      if (token) {
        handleAuthToken(token);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [handleAuthToken]);

  const handleReplitLogin = async () => {
    try {
      setIsAuthenticating(true);
      
      const currentUrl = Platform.OS === "web" 
        ? window.location.origin 
        : Linking.createURL("/");
      
      const loginUrl = new URL("/__replauthlogin", getApiUrl());
      loginUrl.searchParams.set("redirect", new URL("/api/auth/login", getApiUrl()).toString());
      loginUrl.searchParams.set("redirect", `${getApiUrl()}/api/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
      
      if (Platform.OS === "web") {
        window.location.href = loginUrl.toString();
      } else {
        const result = await WebBrowser.openAuthSessionAsync(
          loginUrl.toString(),
          currentUrl
        );
        
        if (result.type === "success" && result.url) {
          const token = extractTokenFromUrl(result.url);
          if (token) {
            await handleAuthToken(token);
          }
        }
        setIsAuthenticating(false);
      }
    } catch (error) {
      console.log("Login error:", error);
      setIsAuthenticating(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing["4xl"],
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.heroSection}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="h1" style={styles.title}>
            PopSpot
          </ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            Discover local gigs and side-hustles in your neighborhood
          </ThemedText>
        </View>

        <View style={styles.buttonSection}>
          <Button 
            onPress={handleReplitLogin} 
            style={styles.loginButton}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? "Connecting..." : "Login with Replit"}
          </Button>
          <ThemedText type="small" style={styles.disclaimer}>
            Sign in with your Replit account to continue
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: "space-between",
  },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.xl,
    borderRadius: 24,
  },
  title: {
    marginBottom: Spacing.sm,
    color: Colors.light.primary,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    maxWidth: 280,
  },
  buttonSection: {
    alignItems: "center",
    paddingBottom: Spacing.xl,
  },
  loginButton: {
    width: "100%",
    backgroundColor: Colors.light.primary,
  },
  disclaimer: {
    marginTop: Spacing.md,
    opacity: 0.5,
  },
});
