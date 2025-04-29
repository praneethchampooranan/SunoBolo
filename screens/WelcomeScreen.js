import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={require('../assets/sunobolo_final.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Welcome to SunoBolo</Text>
      <Text style={styles.subtitle}>Your Multilingual AI Chat Companion</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Flow' }] })}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#a1a1aa',
    marginBottom: 36,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'linear-gradient(90deg, #2563eb 0%, #a21caf 100%)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
