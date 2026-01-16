import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

type AuthMode = "welcome" | "email" | "phone" | "verify";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const {
    isConfigured,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    verifyPhoneOtp,
    signInWithGoogle,
    signInWithApple,
    demoLogin,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setIsLoading(true);
    setError(null);

    const { error } = isSignUp
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);

    setIsLoading(false);
    if (error) {
      setError(error.message);
    }
  };

  const handlePhoneAuth = async () => {
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    setIsLoading(true);
    setError(null);

    const { error } = await signInWithPhone(phone);
    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMode("verify");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }
    setIsLoading(true);
    setError(null);

    const { error } = await verifyPhoneOtp(phone, otp);
    setIsLoading(false);

    if (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      Alert.alert(
        "Not Configured",
        "Supabase authentication is not configured. Using demo mode.",
      );
      demoLogin();
      return;
    }
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);
    if (error) {
      setError(error.message);
    }
  };

  const handleAppleSignIn = async () => {
    if (Platform.OS === "android") {
      Alert.alert(
        "Not Available",
        "Apple Sign In is only available on iOS devices.",
      );
      return;
    }
    if (!isConfigured) {
      Alert.alert(
        "Not Configured",
        "Supabase authentication is not configured. Using demo mode.",
      );
      demoLogin();
      return;
    }
    setIsLoading(true);
    const { error } = await signInWithApple();
    setIsLoading(false);
    if (error) {
      setError(error.message);
    }
  };

  const renderWelcome = () => (
    <View style={styles.authOptions}>
      <Pressable
        style={({ pressed }) => [
          styles.authButton,
          styles.googleButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <View style={styles.authButtonContent}>
          <View style={styles.googleIconContainer}>
            <ThemedText style={styles.googleIcon}>G</ThemedText>
          </View>
          <ThemedText style={styles.authButtonText}>
            Continue with Google
          </ThemedText>
        </View>
      </Pressable>

      {Platform.OS !== "android" ? (
        <Pressable
          style={({ pressed }) => [
            styles.authButton,
            styles.appleButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAppleSignIn}
          disabled={isLoading}
        >
          <View style={styles.authButtonContent}>
            <Feather name="command" size={20} color="#FFFFFF" />
            <ThemedText style={[styles.authButtonText, styles.appleButtonText]}>
              Continue with Apple
            </ThemedText>
          </View>
        </Pressable>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.authButton,
          styles.phoneButton,
          { backgroundColor: theme.backgroundSecondary },
          pressed && styles.buttonPressed,
        ]}
        onPress={() => {
          if (!isConfigured) {
            Alert.alert(
              "Not Configured",
              "Supabase authentication is not configured. Using demo mode.",
            );
            demoLogin();
            return;
          }
          setMode("phone");
          setError(null);
        }}
        disabled={isLoading}
      >
        <View style={styles.authButtonContent}>
          <Feather name="phone" size={20} color={theme.text} />
          <ThemedText style={styles.authButtonTextDark}>
            Continue with Phone
          </ThemedText>
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.authButton,
          styles.emailButton,
          { backgroundColor: theme.backgroundSecondary },
          pressed && styles.buttonPressed,
        ]}
        onPress={() => {
          if (!isConfigured) {
            Alert.alert(
              "Not Configured",
              "Supabase authentication is not configured. Using demo mode.",
            );
            demoLogin();
            return;
          }
          setMode("email");
          setError(null);
        }}
        disabled={isLoading}
      >
        <View style={styles.authButtonContent}>
          <Feather name="mail" size={20} color={theme.text} />
          <ThemedText style={styles.authButtonTextDark}>
            Continue with Email
          </ThemedText>
        </View>
      </Pressable>

      <View style={styles.divider}>
        <View
          style={[
            styles.dividerLine,
            { backgroundColor: theme.backgroundTertiary },
          ]}
        />
        <ThemedText style={styles.dividerText}>or</ThemedText>
        <View
          style={[
            styles.dividerLine,
            { backgroundColor: theme.backgroundTertiary },
          ]}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.authButton,
          styles.demoButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={demoLogin}
        disabled={isLoading}
      >
        <View style={styles.authButtonContent}>
          <Feather name="play" size={20} color="#FFFFFF" />
          <ThemedText style={[styles.authButtonText, styles.demoButtonText]}>
            Try Demo Mode
          </ThemedText>
        </View>
      </Pressable>
    </View>
  );

  const renderEmailForm = () => (
    <View style={styles.formContainer}>
      <Pressable onPress={() => setMode("welcome")} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color={theme.text} />
      </Pressable>

      <ThemedText style={styles.formTitle}>
        {isSignUp ? "Create Account" : "Sign In with Email"}
      </ThemedText>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.backgroundSecondary, color: theme.text },
        ]}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.backgroundSecondary, color: theme.text },
        ]}
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />

      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: Colors.light.primary },
          pressed && styles.buttonPressed,
        ]}
        onPress={handleEmailAuth}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.submitButtonText}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </ThemedText>
        )}
      </Pressable>

      <Pressable onPress={() => setIsSignUp(!isSignUp)}>
        <ThemedText style={styles.switchText}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </ThemedText>
      </Pressable>
    </View>
  );

  const renderPhoneForm = () => (
    <View style={styles.formContainer}>
      <Pressable onPress={() => setMode("welcome")} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color={theme.text} />
      </Pressable>

      <ThemedText style={styles.formTitle}>Sign In with Phone</ThemedText>
      <ThemedText style={styles.formSubtitle}>
        Enter your phone number to receive a verification code
      </ThemedText>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.backgroundSecondary, color: theme.text },
        ]}
        placeholder="+1 (555) 123-4567"
        placeholderTextColor={theme.textSecondary}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
      />

      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: Colors.light.primary },
          pressed && styles.buttonPressed,
        ]}
        onPress={handlePhoneAuth}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.submitButtonText}>Send Code</ThemedText>
        )}
      </Pressable>
    </View>
  );

  const renderVerifyForm = () => (
    <View style={styles.formContainer}>
      <Pressable onPress={() => setMode("phone")} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color={theme.text} />
      </Pressable>

      <ThemedText style={styles.formTitle}>Verify Your Phone</ThemedText>
      <ThemedText style={styles.formSubtitle}>
        Enter the 6-digit code sent to {phone}
      </ThemedText>

      <TextInput
        style={[
          styles.input,
          styles.otpInput,
          { backgroundColor: theme.backgroundSecondary, color: theme.text },
        ]}
        placeholder="000000"
        placeholderTextColor={theme.textSecondary}
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />

      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: Colors.light.primary },
          pressed && styles.buttonPressed,
        ]}
        onPress={handleVerifyOtp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.submitButtonText}>Verify</ThemedText>
        )}
      </Pressable>

      <Pressable onPress={handlePhoneAuth}>
        <ThemedText style={styles.switchText}>Resend Code</ThemedText>
      </Pressable>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="map-pin" size={48} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.title}>PopSpot</ThemedText>
          <ThemedText style={styles.subtitle}>
            Discover local gigs and services in your neighborhood
          </ThemedText>
        </View>

        {mode === "welcome" ? renderWelcome() : null}
        {mode === "email" ? renderEmailForm() : null}
        {mode === "phone" ? renderPhoneForm() : null}
        {mode === "verify" ? renderVerifyForm() : null}

        {isLoading && mode === "welcome" ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : null}
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl * 2,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: `${Colors.light.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: Spacing.sm,
    color: Colors.light.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    maxWidth: 280,
  },
  authOptions: {
    gap: Spacing.md,
  },
  authButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.lg,
  },
  authButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  phoneButton: {},
  emailButton: {},
  demoButton: {
    backgroundColor: Colors.light.primary,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  appleButtonText: {
    color: "#FFFFFF",
  },
  demoButtonText: {
    color: "#FFFFFF",
  },
  authButtonTextDark: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: 14,
    opacity: 0.5,
  },
  formContainer: {
    gap: Spacing.md,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: Spacing.md,
  },
  input: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: "600",
  },
  submitButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md + 4,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  switchText: {
    fontSize: 14,
    textAlign: "center",
    color: Colors.light.primary,
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
