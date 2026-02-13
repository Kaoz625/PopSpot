import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function PostScreen() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handlePost = () => {
    Alert.alert("Pop!", `Your listing for "${title}" at ${price} is now LIVE nearby!`);
    setTitle('');
    setPrice('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a PopSpot ⚡️</Text>
      
      <Text style={styles.label}>What are you offering?</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. 5 Plates of Arroz con Pollo" 
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput 
        style={styles.input} 
        placeholder="$15" 
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>GO LIVE 🚀</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 80, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff4757',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});