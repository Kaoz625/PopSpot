import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGigs, Gig } from "@/context/GigContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function GigCard({ gig, onPress }: { gig: Gig; onPress: () => void }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.cardBackground, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Image source={gig.image} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.priceTag}>
        <ThemedText type="body" style={styles.priceText}>
          ${gig.price}
        </ThemedText>
      </View>
      <View style={styles.cardContent}>
        <ThemedText type="h4" numberOfLines={1}>
          {gig.title}
        </ThemedText>
        <View style={styles.sellerRow}>
          <Image source={{ uri: gig.sellerAvatar }} style={styles.avatar} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {gig.sellerName}
          </ThemedText>
        </View>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={theme.textSecondary} />
          <ThemedText
            type="small"
            style={[styles.locationText, { color: theme.textSecondary }]}
          >
            {gig.location}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

export default function FeedScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { gigs } = useGigs();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleGigPress = (gig: Gig) => {
    navigation.navigate("GigDetail", { gig });
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={gigs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GigCard gig={item} onPress={() => handleGigPress(item)} />
        )}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
              No gigs available yet
            </ThemedText>
          </View>
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
    gap: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  priceTag: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  priceText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  cardContent: {
    padding: Spacing.lg,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  locationText: {
    marginLeft: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
});
