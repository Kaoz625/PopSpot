import React from "react";
import { View, StyleSheet, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants/theme";

export function HeaderTitle() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <ThemedText type="h4" style={styles.title}>
        PopSpot
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  title: {
    color: Colors.light.primary,
  },
});
