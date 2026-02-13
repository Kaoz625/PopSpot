import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

export default function AvailabilityToggle() {
  const [isAvailable, setIsAvailable] = useState(false);

  const toggleSwitch = () => setIsAvailable(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isAvailable ? "🟢 You are ONLINE" : "🔴 You are OFFLINE"}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#4cd137" }}
        thumbColor={isAvailable ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isAvailable}
        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
      />
      {isAvailable && (
        <Text style={styles.subtext}>Your services are visible to neighbors!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtext: {
    marginTop: 10,
    color: '#4cd137',
    fontWeight: '600',
  }
});