import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, Pressable, Image, Switch } from "react-native";
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
  const { gigs, isOnline, userLocation, toggleOnline } = useGigs();
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [webviewKey, setWebviewKey] = useState(0);

  useEffect(() => {
    setWebviewKey((prev) => prev + 1);
  }, [isOnline, userLocation]);

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

    const userMarker = isOnline && userLocation
      ? `
      var userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div style="width: 20px; height: 20px; background: #00A699; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      L.marker([${userLocation.latitude}, ${userLocation.longitude}], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>You are here</b><br>You are online!');
      `
      : "";

    const centerLat = userLocation ? userLocation.latitude : 40.6892;
    const centerLng = userLocation ? userLocation.longitude : -73.9442;

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
          .user-marker {
            background: transparent !important;
            border: none !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${centerLat}, ${centerLng}], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);
          ${markers}
          ${userMarker}
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
          styles.switchContainer,
          {
            top: Platform.OS === "ios" ? headerHeight + Spacing.sm : Spacing.lg,
            backgroundColor: theme.cardBackground,
          },
        ]}
      >
        <ThemedText type="body" style={styles.switchLabel}>
          Go Online
        </ThemedText>
        <Switch
          value={isOnline}
          onValueChange={toggleOnline}
          trackColor={{ false: theme.border, true: Colors.light.online }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={theme.border}
        />
      </View>

      <View
        style={[
          styles.mapContainer,
          {
            marginTop: Platform.OS === "ios" ? headerHeight : 0,
          },
        ]}
      >
        <WebView
          key={webviewKey}
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
  switchContainer: {
    position: "absolute",
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchLabel: {
    marginRight: Spacing.sm,
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
