import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { Spacing, Colors } from "@/constants/theme";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

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
          <Button onPress={login} style={styles.loginButton}>
            Demo Login
          </Button>
          <ThemedText type="small" style={styles.disclaimer}>
            Tap to explore as a demo user
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
