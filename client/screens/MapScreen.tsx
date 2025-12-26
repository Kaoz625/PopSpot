import React, { useState } from "react";
import { View, StyleSheet, Platform, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGigs, Gig } from "@/context/GigContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function MiniGigCard({
  gig,
  onPress,
  onClose,
}: {
  gig: Gig;
  onPress: () => void;
  onClose: () => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.miniCard, { backgroundColor: theme.cardBackground }]}>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Feather name="x" size={20} color={theme.text} />
      </Pressable>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.miniCardContent,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Image source={gig.image} style={styles.miniCardImage} />
        <View style={styles.miniCardInfo}>
          <ThemedText type="h4" numberOfLines={1}>
            {gig.title}
          </ThemedText>
          <ThemedText type="body" style={{ color: Colors.light.primary }}>
            ${gig.price}
          </ThemedText>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color={theme.textSecondary} />
            <ThemedText
              type="small"
              numberOfLines={1}
              style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}
            >
              {gig.location}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default function MapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { gigs } = useGigs();
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  const handleGigPress = (gig: Gig) => {
    navigation.navigate("GigDetail", { gig });
  };

  const generateMapHtml = () => {
    const markers = gigs
      .map(
        (gig, index) => `
      L.marker([${gig.latitude}, ${gig.longitude}])
        .addTo(map)
        .bindPopup('<b>${gig.title.replace(/'/g, "\\'")}</b><br>$${gig.price}')
        .on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'marker_click', index: ${index} }));
        });
    `
      )
      .join("\n");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
          .leaflet-marker-icon {
            filter: hue-rotate(340deg) saturate(1.5);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([40.6892, -73.9442], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);
          ${markers}
        </script>
      </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "marker_click") {
        setSelectedGig(gigs[data.index]);
      }
    } catch (e) {
      console.log("Message parse error:", e);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.mapContainer,
          {
            marginTop: Platform.OS === "ios" ? headerHeight : 0,
          },
        ]}
      >
        <WebView
          source={{ html: generateMapHtml() }}
          style={styles.webview}
          onMessage={handleMessage}
          scrollEnabled={false}
          bounces={false}
        />
      </View>

      {selectedGig ? (
        <View style={[styles.miniCardContainer, { bottom: tabBarHeight + Spacing.lg }]}>
          <MiniGigCard
            gig={selectedGig}
            onPress={() => handleGigPress(selectedGig)}
            onClose={() => setSelectedGig(null)}
          />
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  miniCardContainer: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
  },
  miniCard: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    zIndex: 1,
    padding: Spacing.xs,
  },
  miniCardContent: {
    flexDirection: "row",
    padding: Spacing.md,
  },
  miniCardImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xs,
  },
  miniCardInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
});
