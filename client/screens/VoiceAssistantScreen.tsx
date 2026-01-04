import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl, apiRequest } from "@/lib/query-client";

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

export default function VoiceAssistantScreen() {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webSpeechSupported, setWebSpeechSupported] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setWebSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          stopPulseAnimation();
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

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const toggleListening = () => {
    if (!webSpeechSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      stopPulseAnimation();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        startPulseAnimation();
      } catch (e) {
        console.log("Speech recognition error:", e);
      }
    }
  };

  const sendMessage = async () => {
    const messageText = inputText.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/voice-assistant", {
        message: messageText,
        conversationHistory: messages,
      });
      
      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.md,
            paddingBottom: tabBarHeight + 100,
          },
        ]}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.light.primary + "20" }]}>
              <Feather name="mic" size={48} color={Colors.light.primary} />
            </View>
            <ThemedText style={styles.emptyTitle}>PopSpot Assistant</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              {webSpeechSupported
                ? "Tap the microphone or type to ask me anything!"
                : "Type your message to get help with posting, searching, or navigating PopSpot."}
            </ThemedText>
            <View style={styles.suggestionsContainer}>
              <Pressable
                style={[styles.suggestion, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => setInputText("Help me post a gig for homemade cookies")}
              >
                <ThemedText style={styles.suggestionText}>Help me post a gig</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.suggestion, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => setInputText("I'm looking for a dog walker")}
              >
                <ThemedText style={styles.suggestionText}>Find a service</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.suggestion, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => setInputText("How do I use PopSpot?")}
              >
                <ThemedText style={styles.suggestionText}>How to use PopSpot</ThemedText>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.role === "user" ? styles.userBubble : styles.assistantBubble,
                  msg.role === "user"
                    ? { backgroundColor: Colors.light.primary }
                    : { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <ThemedText
                  style={[
                    styles.messageText,
                    msg.role === "user" && { color: "#FFFFFF" },
                  ]}
                >
                  {msg.content}
                </ThemedText>
              </View>
            ))}
            {isLoading ? (
              <View style={[styles.messageBubble, styles.assistantBubble, { backgroundColor: theme.backgroundSecondary }]}>
                <ActivityIndicator size="small" color={Colors.light.primary} />
              </View>
            ) : null}
          </View>
        )}
      </KeyboardAwareScrollViewCompat>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingBottom: tabBarHeight + Spacing.md,
          },
        ]}
      >
        <View style={[styles.inputRow, { backgroundColor: theme.backgroundSecondary }]}>
          {webSpeechSupported ? (
            <Pressable onPress={toggleListening} style={styles.micButton}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Feather
                  name={isListening ? "mic" : "mic-off"}
                  size={24}
                  color={isListening ? Colors.light.primary : theme.textSecondary}
                />
              </Animated.View>
            </Pressable>
          ) : null}
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder={isListening ? "Listening..." : "Type a message..."}
            placeholderTextColor={theme.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isListening}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? Colors.light.primary : theme.backgroundTertiary,
              },
            ]}
          >
            <Feather name="send" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
        {!webSpeechSupported && Platform.OS !== "web" ? (
          <ThemedText style={styles.webHint}>
            Voice input available on web version
          </ThemedText>
        ) : null}
      </View>

      {isListening ? (
        <View style={styles.listeningOverlay}>
          <Animated.View
            style={[
              styles.listeningCircle,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Feather name="mic" size={64} color="#FFFFFF" />
          </Animated.View>
          <ThemedText style={styles.listeningText}>Listening...</ThemedText>
          <Pressable onPress={toggleListening} style={styles.stopButton}>
            <ThemedText style={styles.stopButtonText}>Tap to stop</ThemedText>
          </Pressable>
        </View>
      ) : null}
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: Spacing.xl,
  },
  suggestionsContainer: {
    width: "100%",
    gap: Spacing.sm,
  },
  suggestion: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  suggestionText: {
    fontSize: 15,
    textAlign: "center",
  },
  messagesContainer: {
    gap: Spacing.md,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  micButton: {
    padding: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  webHint: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.5,
    marginTop: Spacing.xs,
  },
  listeningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  listeningCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  listeningText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: Spacing.lg,
  },
  stopButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  stopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
