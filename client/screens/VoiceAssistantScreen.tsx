import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import Voice from "@react-native-voice/voice";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl, apiRequest } from "@/lib/query-client";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Message {
  role: "user" | "assistant";
  content: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const aiBackground = require("@assets/images/ai-background.png");

export default function VoiceAssistantScreen() {
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const responseOpacity = useRef(new Animated.Value(0)).current;
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    startGlowAnimation();

    // Initialize voice recognition for mobile (iOS/Android)
    if (Platform.OS !== "web") {
      const initVoice = async () => {
        try {
          Voice.onSpeechStart = () => {
            setIsListening(true);
            startPulseAnimation();
          };

          Voice.onSpeechEnd = () => {
            setIsListening(false);
            stopPulseAnimation();
          };

          Voice.onSpeechResults = (e: any) => {
            if (e.value && e.value.length > 0) {
              const transcript = e.value[0];
              setIsListening(false);
              stopPulseAnimation();
              sendMessage(transcript);
            }
          };

          Voice.onSpeechError = (e: any) => {
            console.log("Speech error:", e);
            setIsListening(false);
            stopPulseAnimation();
            setCurrentResponse(
              "Voice recognition error. Please check microphone permissions.",
            );
          };

          // Check if speech recognition is available
          const available = await Voice.isAvailable();
          // Voice.isAvailable() returns different types on different platforms
          setVoiceSupported(Boolean(available));
        } catch (e) {
          console.log("Error initializing voice:", e);
          setVoiceSupported(false);
        }
      };

      initVoice();

      return () => {
        Voice.destroy()
          .then(Voice.removeAllListeners)
          .catch((e) => console.log("Voice cleanup error:", e));
      };
    }

    // Web speech recognition
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          stopPulseAnimation();
          sendMessage(transcript);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          stopPulseAnimation();
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          stopPulseAnimation();
        };
      }
    }
  }, []);

  useEffect(() => {
    if (currentResponse) {
      Animated.timing(responseOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      responseOpacity.setValue(0);
    }
  }, [currentResponse]);

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const toggleListening = async () => {
    if (!voiceSupported) {
      setCurrentResponse("Voice recognition is not available on this device.");
      return;
    }

    if (isListening) {
      // Stop listening
      if (Platform.OS !== "web") {
        try {
          await Voice.stop();
        } catch (e) {
          console.log("Error stopping voice:", e);
        }
      } else {
        recognitionRef.current?.stop();
      }
      setIsListening(false);
      stopPulseAnimation();
    } else {
      // Start listening
      try {
        setCurrentResponse(null);

        if (Platform.OS !== "web") {
          await Voice.start("en-US");
        } else {
          recognitionRef.current?.start();
        }

        setIsListening(true);
        startPulseAnimation();
      } catch (e) {
        console.log("Speech recognition error:", e);
        setCurrentResponse(
          "Failed to start voice recognition. Please try again.",
        );
      }
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setCurrentResponse(null);

    try {
      const response = await apiRequest("POST", "/api/voice-assistant", {
        message: messageText,
        conversationHistory: messages,
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentResponse(data.response);
    } catch (error) {
      console.error("Error sending message:", error);
      setCurrentResponse("I couldn't process that. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const micGlowOpacity = glowAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <ImageBackground
      source={aiBackground}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.overlay]} />

      {currentResponse ? (
        <Animated.View
          style={[
            styles.responseContainer,
            {
              paddingTop: insets.top + Spacing.lg,
              opacity: responseOpacity,
            },
          ]}
        >
          <BlurView intensity={40} tint="dark" style={styles.glassCard}>
            <ThemedText style={styles.responseText}>
              {currentResponse}
            </ThemedText>
          </BlurView>
        </Animated.View>
      ) : null}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <ThemedText style={styles.loadingText}>Thinking...</ThemedText>
        </View>
      ) : null}

      {isListening ? (
        <View style={styles.listeningIndicator}>
          <ThemedText style={styles.listeningText}>Listening...</ThemedText>
        </View>
      ) : null}

      <View style={[styles.micContainer, { bottom: insets.bottom + 120 }]}>
        <Animated.View
          style={[
            styles.micGlow,
            {
              opacity: micGlowOpacity,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.micGlowOuter,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: [0.1, 0.4],
              }),
            },
          ]}
        />
        <Pressable
          onPress={toggleListening}
          style={({ pressed }) => [
            styles.micButton,
            pressed && styles.micButtonPressed,
            isListening && styles.micButtonActive,
          ]}
        >
          <Animated.View
            style={{ transform: [{ scale: isListening ? pulseAnim : 1 }] }}
          >
            <Feather
              name="mic"
              size={36}
              color={isListening ? "#FF5A5F" : "#FFFFFF"}
            />
          </Animated.View>
        </Pressable>
      </View>

      {!voiceSupported ? (
        <View style={[styles.hintContainer, { bottom: insets.bottom + 80 }]}>
          <ThemedText style={styles.hintText}>
            Voice recognition not available
          </ThemedText>
        </View>
      ) : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 30, 0.3)",
  },
  responseContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  glassCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  responseText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    fontWeight: "500",
  },
  loadingContainer: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: Spacing.md,
    opacity: 0.8,
  },
  listeningIndicator: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  listeningText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    textShadowColor: "rgba(255, 90, 95, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  micContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  micGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 90, 95, 0.4)",
  },
  micGlowOuter: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 90, 95, 0.2)",
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  micButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    transform: [{ scale: 0.95 }],
  },
  micButtonActive: {
    backgroundColor: "rgba(255, 90, 95, 0.3)",
    borderColor: "rgba(255, 90, 95, 0.6)",
  },
  hintContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
});
