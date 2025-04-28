import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../utils/ThemeContext';
import { LanguageContext } from '../utils/LanguageContext';
import { t } from '../utils/translations';
import { useAuth } from '../utils/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

export default function SettingsScreen(props) {
  const [showLangDropdown, setShowLangDropdown] = React.useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, changeLanguage } = useContext(LanguageContext);
  const { user } = useAuth();
  const navigation = props.navigation || useNavigation();
  const [phone, setPhone] = useState(user?.phone || '');
  const [editPhone, setEditPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

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

  const handleAddPhone = () => {
    if (phoneInput.trim().length < 10) {
      Alert.alert('Invalid', 'Please enter a valid phone number.');
      return;
    }
    setPhone(phoneInput.trim());
    setEditPhone(false);
    setPhoneInput('');
    Alert.alert('Success', 'Phone number added! (Verification not implemented)');
  };

  return (
    <View style={[styles.modalBg, { backgroundColor: theme === 'dark' ? '#18181b' : '#f8fafc', flex: 1, minHeight: '100%', width: '100%', paddingTop: 28, paddingBottom: 28 }]}> 
      <View style={[styles.modalCard, { backgroundColor: theme === 'dark' ? '#23232b' : '#fff', borderColor: theme === 'dark' ? '#393a41' : '#e5e7eb', borderRadius: 22, width: '93%', marginTop: 0, marginBottom: 0, minHeight: undefined, shadowColor: '#000', shadowOpacity: 0.09, shadowRadius: 10, elevation: 6 }]}> 
        {/* Drag indicator */}
        <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 2 }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: theme === 'dark' ? '#33343a' : '#d1d5db', opacity: 0.7 }} />
        </View>
        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={theme === 'dark' ? '#aaa' : '#222'} />
        </TouchableOpacity>
        {/* Centered Title */}
        <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#23232b', textAlign: 'center', fontSize: 22, marginTop: 0, marginBottom: 8, fontWeight: 'bold', letterSpacing: 0.2 }]}>{t(language, 'settings')}</Text>
        {/* ACCOUNT Section */}
        <Text style={[styles.sectionHeader, { color: theme === 'dark' ? '#aaa' : '#888', marginTop: 18 }]}>{t(language, 'account').toUpperCase()}</Text>
        <View style={[styles.sectionBox, { backgroundColor: theme === 'dark' ? '#23232b' : '#fff', borderColor: theme === 'dark' ? '#393a41' : '#e5e7eb', borderWidth: 1 }]}>
          <View style={styles.settingRow}>
            <Ionicons name="mail-outline" size={22} color={theme === 'dark' ? '#8ab4f8' : '#2563eb'} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{t(language, 'email')}</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.rowValue, { color: theme === 'dark' ? '#bcbcbc' : '#757575' }]}>{user?.email || 'No email'}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Ionicons name="call-outline" size={22} color={theme === 'dark' ? '#8ab4f8' : '#2563eb'} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{t(language, 'phone')}</Text>
            <View style={{ flex: 1 }} />
          </View>
        </View>
        {/* APP Section */}
        <Text style={[styles.sectionHeader, { color: theme === 'dark' ? '#aaa' : '#888', marginTop: 22 }]}>{t(language, 'app').toUpperCase()}</Text>
        <View style={[styles.sectionBox, { backgroundColor: theme === 'dark' ? '#23232b' : '#fff', borderColor: theme === 'dark' ? '#393a41' : '#e5e7eb', borderWidth: 1 }]}>
          <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
            <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={22} color={theme === 'dark' ? '#fff' : '#23232b'} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{t(language, 'colorScheme')}</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.rowValue, { color: theme === 'dark' ? '#fff' : '#757575' }]}>{theme === 'dark' ? t(language, 'dark') : t(language, 'light')}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? '#fff' : '#23232b'} style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={() => setShowLangDropdown(true)}>
  <Ionicons name="language" size={22} color={theme === 'dark' ? '#fff' : '#23232b'} style={styles.rowIcon} />
  <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{t(language, 'appLanguage')}</Text>
  <View style={{ flex: 1 }} />
  <Text style={[styles.rowValue, { color: theme === 'dark' ? '#fff' : '#23232b', fontWeight: 'bold' }]}>{
    languageOptions.find(l => l.code === language)?.label || t(language, 'appLanguage')
  }</Text>
  <Ionicons name="chevron-down" size={20} color={theme === 'dark' ? '#fff' : '#23232b'} style={styles.chevron} />
</TouchableOpacity>

{/* Language Dropdown Modal */}
{showLangDropdown && (
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme === 'dark' ? 'rgba(24,24,27,0.93)' : 'rgba(248,250,252,0.96)', zIndex: 99, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: '88%', borderRadius: 16, backgroundColor: theme === 'dark' ? '#23232b' : '#fff', borderWidth: 1, borderColor: theme === 'dark' ? '#393a41' : '#e5e7eb', maxHeight: 340, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.13, shadowRadius: 10, elevation: 8 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: theme === 'dark' ? '#fff' : '#23232b', textAlign: 'center' }}>{t(language, 'selectLanguage')}</Text>
      <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={true} indicatorStyle={theme === 'dark' ? 'white' : 'black'}>
        {languageOptions.map((opt, idx) => (
  <View key={opt.code}>
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 18,
        backgroundColor:
          language === opt.code
            ? (theme === 'dark' ? '#393a41' : '#e5e7eb')
            : (theme === 'dark' ? '#23232b' : '#fff'),
        borderRadius: 10,
        marginBottom: 0,
        borderWidth: language === opt.code ? 1.5 : 1,
        borderColor: language === opt.code
          ? (theme === 'dark' ? '#fff' : '#23232b')
          : (theme === 'dark' ? '#393a41' : '#e5e7eb'),
        marginTop: idx === 0 ? 0 : 8,
      }}
      onPress={() => {
        changeLanguage(opt.code);
        setShowLangDropdown(false);
      }}
    >
      <Text
        style={{
          color:
            language === opt.code
              ? (theme === 'dark' ? '#fff' : '#23232b')
              : (theme === 'dark' ? '#bcbcbc' : '#757575'),
          fontWeight: language === opt.code ? 'bold' : 'normal',
          fontSize: 16,
          textAlign: 'center',
        }}
      >
        {opt.label}
      </Text>
    </TouchableOpacity>
    {idx !== languageOptions.length - 1 && (
      <View style={{ height: 1, backgroundColor: theme === 'dark' ? '#33343a' : '#e5e7eb', marginVertical: 5, marginHorizontal: 5, borderRadius: 1 }} />
    )}
  </View>
))}
      </ScrollView>
      <TouchableOpacity onPress={() => setShowLangDropdown(false)} style={{ marginTop: 16, alignSelf: 'center' }}>
        <Ionicons name="close-circle" size={32} color={theme === 'dark' ? '#aaa' : '#888'} />
      </TouchableOpacity>
    </View>
  </View>
)}


          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('DataControlScreen')}>
            <Ionicons name="settings-outline" size={22} color={theme === 'dark' ? '#fff' : '#23232b'} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{t(language, 'dataControls')}</Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-forward" size={20} style={styles.chevron} />
          </TouchableOpacity>

          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('ArchiveChatsScreen')}>
            <Ionicons name="archive-outline" size={22} color={theme === 'dark' ? '#fff' : '#23232b'} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{t(language, 'archivedChats')}</Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-forward" size={20} style={styles.chevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={handleClearHistory}>
            <Ionicons name="trash-outline" size={22} color={theme === 'dark' ? '#ef4444' : '#ef4444'} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{t(language, 'clearChatHistory')}</Text>
            <View style={{ flex: 1 }} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={theme === 'dark' ? '#aaa' : '#2563eb'} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{t(language, 'logout')}</Text>
            <View style={{ flex: 1 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  modalCard: {
    width: '93%',
    borderRadius: 22,
    paddingVertical: 0,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    marginBottom: 12,
    marginTop: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 2,
    padding: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 14,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 22,
    marginTop: 18,
    marginBottom: 6,
    letterSpacing: 1,
    opacity: 0.7,
  },
  sectionBox: {
    borderRadius: 16,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 18,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 52,
    backgroundColor: 'transparent',
  },
  rowIcon: {
    marginRight: 16,
    width: 26,
    textAlign: 'center',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#23232b',
    flexShrink: 1,
  },
  rowValue: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 12,
    fontWeight: '400',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f1f6',
    marginHorizontal: 12,
  },
  chevron: {
    marginLeft: 10,
    color: '#bcbcbc',
  },
});
