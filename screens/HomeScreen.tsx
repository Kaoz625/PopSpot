import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import AvailabilityToggle from '../components/AvailabilityToggle';

// Conditionally import MapView so it doesn't crash on Web
let MapView, Marker;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

// Mock Data for "PopSpots"
const MOCK_SPOTS = [
  { id: '1', title: 'Fresh Lasagna Plates', price: '$15', seller: 'Mama Maria', coords: { latitude: 40.7128, longitude: -74.0060 } },
  { id: '2', title: 'Dog Walking (Available Now)', price: '$20/hr', seller: 'NYCTailblazers', coords: { latitude: 40.7138, longitude: -74.0070 } },
  { id: '3', title: 'Drywall Repair', price: 'Quote', seller: 'Handy Joe', coords: { latitude: 40.7118, longitude: -74.0050 } },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header / Toggle Section */}
      <View style={styles.header}>
        <Text style={styles.title}>PopSpot 📍</Text>
        <AvailabilityToggle />
      </View>

      {/* Map View (Native) or Placeholder (Web) */}
      {Platform.OS === 'web' ? (
        <View style={[styles.map, styles.webMapPlaceholder]}>
          <Text style={styles.webMapText}>🗺️ Interactive Map (Mobile Only)</Text>
        </View>
      ) : (
        <MapView 
          style={styles.map} 
          initialRegion={{
            latitude: 40.7128,
            longitude: -74.0060,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {MOCK_SPOTS.map(spot => (
            <Marker
              key={spot.id}
              coordinate={spot.coords}
              title={spot.title}
              description={spot.seller}
            />
          ))}
        </MapView>
      )}

      {/* List of Active Spots */}
      <Text style={styles.sectionTitle}>Nearby Pops</Text>
      <FlatList
        data={MOCK_SPOTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSeller}>{item.seller}</Text>
            </View>
            <Text style={styles.cardPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '900', color: '#ff4757', textAlign: 'center', marginBottom: 10 },
  map: { width: '100%', height: 250 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 15, color: '#333' },
  list: { paddingHorizontal: 15 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSeller: { color: '#666', marginTop: 4 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#2ed573' },
  webMapPlaceholder: { backgroundColor: '#e1e1e1', alignItems: 'center', justifyContent: 'center' },
  webMapText: { fontSize: 18, color: '#666' },
});