import React from "react";
import {
  View,
  StyleSheet,
  Switch,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { useGigs, Gig } from "@/context/GigContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function UserGigCard({ gig, onDelete }: { gig: Gig; onDelete: () => void }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.gigCard, { backgroundColor: theme.cardBackground }]}>
      <Image source={gig.image} style={styles.gigImage} />
      <View style={styles.gigInfo}>
        <ThemedText type="body" numberOfLines={1} style={{ fontWeight: "600" }}>
          {gig.title}
        </ThemedText>
        <ThemedText type="small" style={{ color: Colors.light.primary }}>
          ${gig.price}
        </ThemedText>
      </View>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Feather name="trash-2" size={18} color={Colors.light.primary} />
      </Pressable>
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { userGigs, isOnline, toggleOnline, deleteGig } = useGigs();

  const handleLogout = () => {
    logout();
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={userGigs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.profileSection}>
              <Image
                source={{ uri: user?.avatar }}
                style={styles.profileAvatar}
              />
              <ThemedText type="h3">{user?.name}</ThemedText>
            </View>

            <View
              style={[
                styles.onlineCard,
                {
                  backgroundColor: isOnline
                    ? Colors.light.online + "15"
                    : theme.backgroundSecondary,
                  borderColor: isOnline ? Colors.light.online : theme.border,
                },
              ]}
            >
              <View style={styles.onlineContent}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: isOnline
                        ? Colors.light.online
                        : Colors.light.offline,
                    },
                  ]}
                />
                <View style={styles.onlineText}>
                  <ThemedText type="h4">
                    {isOnline ? "You're Online" : "You're Offline"}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {isOnline
                      ? "Customers can see your gigs"
                      : "Go online to start receiving orders"}
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={isOnline}
                onValueChange={toggleOnline}
                trackColor={{
                  false: theme.backgroundTertiary,
                  true: Colors.light.online,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.sectionHeader}>
              <ThemedText type="h4">My Active Gigs</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {userGigs.length} {userGigs.length === 1 ? "gig" : "gigs"}
              </ThemedText>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <UserGigCard gig={item} onDelete={() => deleteGig(item.id)} />
        )}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="briefcase" size={40} color={theme.textSecondary} />
            <ThemedText
              type="body"
              style={{
                color: theme.textSecondary,
                marginTop: Spacing.md,
                textAlign: "center",
              }}
            >
              No active gigs yet.{"\n"}Post your first gig to get started!
            </ThemedText>
          </View>
        }
        ListFooterComponent={
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="log-out" size={18} color={Colors.light.primary} />
            <ThemedText
              type="body"
              style={{ color: Colors.light.primary, marginLeft: Spacing.sm }}
            >
              Log Out
            </ThemedText>
          </Pressable>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.lg,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.md,
  },
  onlineCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  onlineContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
  },
  onlineText: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  gigCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  gigImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xs,
  },
  gigInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    marginTop: Spacing.xl,
  },
});
