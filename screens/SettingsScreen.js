import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemeContext } from '../utils/ThemeContext';
import { LanguageContext } from '../utils/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, changeLanguage } = useContext(LanguageContext);

  const handleClearHistory = async () => {
    try {
      await AsyncStorage.removeItem('chat_history');
      Alert.alert('Success', 'Chat history cleared.');
    } catch (e) {
      Alert.alert('Error', 'Failed to clear chat history.');
    }
  };

  const handleLogout = async () => {
    // Placeholder for future auth/logout logic
    Alert.alert('Logged out', 'You have been logged out.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.settingBtn} onPress={toggleTheme}>
        <Text style={styles.settingText}>Theme: {theme === 'light' ? 'Light' : 'Dark'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingBtn} onPress={() => changeLanguage(language === 'en' ? 'hi' : 'en')}>
        <Text style={styles.settingText}>Language: {language === 'en' ? 'English' : 'Hindi'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingBtn} onPress={handleClearHistory}>
        <Text style={styles.settingText}>Clear Chat History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingBtn} onPress={handleLogout}>
        <Text style={styles.settingText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2563eb', marginBottom: 24 },
  settingBtn: { padding: 16, borderRadius: 8, backgroundColor: '#f1f5f9', marginBottom: 16 },
  settingText: { fontSize: 16, color: '#222' },
});
