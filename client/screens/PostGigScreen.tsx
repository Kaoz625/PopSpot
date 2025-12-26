import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useGigs } from "@/context/GigContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

const categories = ["Food", "Services", "Art", "Tutoring", "Fitness", "Tech", "Other"];

export default function PostGigScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { addGig } = useGigs();
  const [permission, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Food");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      if (!permission?.granted) {
        if (permission?.status === "denied" && !permission?.canAskAgain) {
          Alert.alert(
            "Permission Required",
            "Photo library access is required to add images. Please enable it in Settings.",
            [
              { text: "Cancel", style: "cancel" },
              Platform.OS !== "web"
                ? {
                    text: "Open Settings",
                    onPress: async () => {
                      try {
                        await Linking.openSettings();
                      } catch (e) {
                        // Settings not available
                      }
                    },
                  }
                : { text: "OK" },
            ].filter(Boolean)
          );
          return;
        }

        const result = await requestPermission();
        if (!result.granted) {
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Unable to access photo library. Please try again.");
    }
  };

  const handlePost = () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a title for your gig.");
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert("Invalid Price", "Please enter a valid price.");
      return;
    }

    addGig({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      image: imageUri ? { uri: imageUri } : require("../../assets/images/icon.png"),
      location: "Brooklyn, NY",
      latitude: 40.6892 + (Math.random() - 0.5) * 0.05,
      longitude: -73.9442 + (Math.random() - 0.5) * 0.05,
    });

    navigation.goBack();
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <Pressable
          onPress={pickImage}
          style={[
            styles.imagePicker,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePickerContent}>
              <Feather name="camera" size={32} color={theme.textSecondary} />
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary, marginTop: Spacing.sm }}
              >
                Tap to add a photo
              </ThemedText>
            </View>
          )}
        </Pressable>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Title
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
              },
            ]}
            placeholder="What are you offering?"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Description
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
              },
            ]}
            placeholder="Describe your gig..."
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Price ($)
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
              },
            ]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Category
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor:
                      category === cat
                        ? Colors.light.primary
                        : theme.backgroundSecondary,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: category === cat ? "#FFFFFF" : theme.text,
                    fontWeight: category === cat ? "600" : "400",
                  }}
                >
                  {cat}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={styles.label}>
            Location
          </ThemedText>
          <View
            style={[
              styles.locationDisplay,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather name="map-pin" size={18} color={theme.textSecondary} />
            <ThemedText type="body" style={{ marginLeft: Spacing.sm }}>
              Brooklyn, NY
            </ThemedText>
          </View>
        </View>

        <Button onPress={handlePost} style={styles.postButton}>
          Post Gig
        </Button>
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  imagePicker: {
    height: 180,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  imagePickerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.md,
  },
  categoryScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  locationDisplay: {
    flexDirection: "row",
    alignItems: "center",
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
  },
  postButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.light.primary,
  },
});
