import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Gig } from "@/context/GigContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type GigDetailRouteProp = RouteProp<RootStackParamList, "GigDetail">;

export default function GigDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<GigDetailRouteProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { gig } = route.params;

  const handleContact = () => {
    Alert.alert(
      "Contact Seller",
      `This would open a chat with ${gig.sellerName}. In a real app, you'd be able to message the seller directly.`,
      [{ text: "OK" }],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={gig.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <Pressable
            onPress={() => navigation.goBack()}
            style={[
              styles.closeButton,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <Feather name="x" size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.priceTag}>
              <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
                ${gig.price}
              </ThemedText>
            </View>
            <View
              style={[
                styles.categoryTag,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <ThemedText type="small">{gig.category}</ThemedText>
            </View>
          </View>

          <ThemedText type="h2" style={styles.title}>
            {gig.title}
          </ThemedText>

          <View style={styles.sellerRow}>
            <Image
              source={{ uri: gig.sellerAvatar }}
              style={styles.sellerAvatar}
            />
            <View style={styles.sellerInfo}>
              <ThemedText type="body" style={{ fontWeight: "600" }}>
                {gig.sellerName}
              </ThemedText>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color={theme.textSecondary} />
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}
                >
                  {gig.location}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <ThemedText type="h4" style={styles.sectionTitle}>
            About this gig
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {gig.description}
          </ThemedText>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.backgroundDefault,
            paddingBottom: insets.bottom + Spacing.md,
          },
        ]}
      >
        <Button onPress={handleContact} style={styles.contactButton}>
          Contact Seller
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 280,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  priceTag: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  categoryTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sellerInfo: {
    marginLeft: Spacing.md,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  contactButton: {
    backgroundColor: Colors.light.primary,
  },
});
