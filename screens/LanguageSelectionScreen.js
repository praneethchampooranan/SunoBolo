import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LanguageContext } from '../utils/LanguageContext';
import CustomButton from '../components/CustomButton';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'bn', label: 'Bengali' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'mr', label: 'Marathi' },
  { code: 'te', label: 'Telugu' },
  { code: 'kn', label: 'Kannada' },
];

export default function LanguageSelectionScreen({ navigation }) {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Language</Text>
      <FlatList
        data={LANGUAGES}
        keyExtractor={item => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.languageButton, language === item.code && styles.selectedLanguage]}
            onPress={() => changeLanguage(item.code)}
          >
            <Text style={[styles.languageText, language === item.code && styles.selectedText]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <CustomButton title="Continue" onPress={() => navigation.replace('Main')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2563eb', marginBottom: 24 },
  languageButton: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 12, width: 200, alignItems: 'center' },
  selectedLanguage: { backgroundColor: '#2563eb' },
  languageText: { fontSize: 16, color: '#222' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
});
