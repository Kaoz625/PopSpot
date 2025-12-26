import React from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import FeedScreen from "@/screens/FeedScreen";
import MapScreen from "@/screens/MapScreen";
import DashboardScreen from "@/screens/DashboardScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export type MainTabParamList = {
  FeedTab: undefined;
  MapTab: undefined;
  DashboardTab: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Tab = createBottomTabNavigator<MainTabParamList>();

function FloatingPostButton() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Pressable
      onPress={() => navigation.navigate("PostGig")}
      style={({ pressed }) => [
        styles.fab,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <Feather name="plus" size={28} color="#FFFFFF" />
    </Pressable>
  );
}

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const screenOptions = useScreenOptions();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="FeedTab"
        screenOptions={{
          ...screenOptions,
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
          name="DashboardTab"
          component={DashboardScreen}
          options={{
            title: "Dashboard",
            headerTitle: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <FloatingPostButton />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 100,
    right: Spacing.lg,
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
});
