import React from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import FeedScreen from "@/screens/FeedScreen";
import MapScreen from "@/screens/MapScreen";
import NotesScreen from "@/screens/NotesScreen";
import VoiceAssistantScreen from "@/screens/VoiceAssistantScreen";
import DashboardScreen from "@/screens/DashboardScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

export type MainTabParamList = {
  FeedTab: undefined;
  MapTab: undefined;
  AssistantTab: undefined;
  NotesTab: undefined;
  DashboardTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function AssistantTabButton({ onPress, accessibilityState }: any) {
  const isSelected = accessibilityState?.selected;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.postButton,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <View
        style={[styles.postButtonInner, isSelected && styles.postButtonActive]}
      >
        <Feather name="mic" size={28} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="FeedTab"
      screenOptions={{
        headerTitleAlign: "center",
        headerTransparent: true,
        headerTintColor: theme.text,
        headerStyle: {
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
            web: theme.backgroundRoot,
          }),
        },
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedScreen}
        options={{
          title: "Feed",
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          title: "Map",
          headerTitle: "Brooklyn, NY",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AssistantTab"
        component={VoiceAssistantScreen}
        options={{
          title: "",
          headerShown: false,
          tabBarButton: (props) => <AssistantTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="NotesTab"
        component={NotesScreen}
        options={{
          title: "Posts",
          headerTitle: "Community Posts",
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: "Profile",
          headerTitle: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  postButton: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  postButtonActive: {
    backgroundColor: Colors.light.secondary,
  },
});
