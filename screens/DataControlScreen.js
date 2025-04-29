import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChatContext } from '../context/ChatContext';
import { ThemeContext } from '../utils/ThemeContext';
import { LanguageContext } from '../utils/LanguageContext';
import { t } from '../utils/translations';

export default function DataControlScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  const { archiveAllChats, deleteAllChats } = useChatContext();

  const handleArchiveAll = () => {
    Alert.alert(
      'Archive All Chats',
      'Are you sure you want to archive all chats? This will move all your active chats to the archive. You can restore them from the archive later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: () => {
            archiveAllChats();
            Alert.alert(t(language, 'archiveAll'), t(language, 'allChatsArchived'));
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Chats',
      'Are you sure you want to permanently delete all chats? This cannot be undone and all your chat history will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAllChats();
            Alert.alert(t(language, 'deleteAll'), t(language, 'allChatsDeleted'));
            navigation.goBack();
          }
        }
      ]
    );
  };

  const { user } = require('../utils/useAuth').useAuth();
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account and all data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Delete user from Supabase via Edge Function
              let supabaseDeleteError = null;
              if (user && user.id) {
                try {
                  const response = await fetch('https://vucwanwlpkcwdbbjhovm.supabase.co/functions/v1/delete-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.id })
                  });
                  if (!response.ok) {
                    const errorText = await response.text();
                    supabaseDeleteError = errorText || 'Failed to delete user from Supabase';
                  }
                } catch (err) {
                  supabaseDeleteError = err.message;
                }
              }
              // 2. Remove all relevant AsyncStorage keys
              const keys = [
                'chats',
                'archivedChats',
                'messages',
                'archivedChatsMessages',
                'language',
                'theme',
                'profile',
                'hasLaunched',
              ];
              await Promise.all(keys.map(k => AsyncStorage.removeItem(k)));
              // 3. Sign out from Supabase
              if (typeof supabase !== 'undefined') {
                await supabase.auth.signOut();
              }
              // 4. Navigate to onboarding/auth screen (reset stack)
              navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
              if (supabaseDeleteError) {
                setTimeout(() => {
                  Alert.alert('Warning', 'Account deleted locally, but failed to delete from Supabase: ' + supabaseDeleteError);
                }, 1000);
              }
            } catch (e) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#18181b' : '#f8fafc' }]}> 
      {/* Header Row */}
      <View style={[styles.headerRow, { marginTop: 24 }]}> 
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.headerIconBtn}>
          <Ionicons name="arrow-back" size={26} color={theme === 'dark' ? '#fff' : '#23232b'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#23232b', flex: 1, textAlign: 'center' }]}>{t(language, 'dataControls')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
          <Ionicons name="close" size={26} color={theme === 'dark' ? '#fff' : '#23232b'} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexGrow: 1, paddingTop: 0, paddingBottom: 0, justifyContent: 'flex-start' }}>
          <View style={[styles.sectionBox, { marginTop: 30, backgroundColor: theme === 'dark' ? '#23232b' : '#fff', borderColor: theme === 'dark' ? '#393a41' : '#e5e7eb', borderWidth: 1 }]}> 
            {/* Archive All Chats */}
            <TouchableOpacity style={styles.settingRow} onPress={handleArchiveAll}>
              <Ionicons name="archive-outline" size={22} color={theme === 'dark' ? '#fff' : '#23232b'} style={styles.rowIcon} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>Archive all chats</Text>
                <Text style={[styles.rowDesc, { color: theme === 'dark' ? '#bcbcbc' : '#757575' }]}>Move all your chats to the archive. This action cannot be undone.</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#393a41' : '#e5e7eb' }]} />
            {/* Delete All Chats */}
            <TouchableOpacity style={styles.settingRow} onPress={handleDeleteAll}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" style={styles.rowIcon} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: '#ef4444' }]}>Delete all chats</Text>
                <Text style={[styles.rowDesc, { color: theme === 'dark' ? '#bcbcbc' : '#757575' }]}>Permanently delete all your chats. This cannot be undone.</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#393a41' : '#e5e7eb' }]} />
            {/* Delete Account */}
            <TouchableOpacity style={styles.settingRow} onPress={handleDeleteAccount}>
              <Ionicons name="person-remove-outline" size={22} color="#ef4444" style={styles.rowIcon} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: '#ef4444' }]}>Delete account</Text>
                <Text style={[styles.rowDesc, { color: theme === 'dark' ? '#bcbcbc' : '#757575' }]}>Permanently delete your account and all data. This cannot be undone.</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 40,
  },
  headerIconBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  sectionBox: {
    borderRadius: 18,
    paddingVertical: 2,
    paddingHorizontal: 0,
    marginBottom: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  rowIcon: {
    marginRight: 18,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowDesc: {
    fontSize: 13,
    marginTop: 2,
    marginLeft: 2,
    lineHeight: 17,
  },
  divider: {
    height: 1,
    width: '100%',
    alignSelf: 'center',
  },
});

