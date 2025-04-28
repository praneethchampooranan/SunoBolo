import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { archiveAllChats, deleteAllChats } from '../navigation/CustomDrawerContent';
import { ThemeContext } from '../utils/ThemeContext';
import { LanguageContext } from '../utils/LanguageContext';
import { t } from '../utils/translations';

export default function DataControlScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  const handleArchiveAll = async () => {
    await archiveAllChats();
    Alert.alert(t(language, 'archiveAll'), t(language, 'allChatsArchived'));
    navigation.goBack();
  };
  const handleDeleteAll = async () => {
    await deleteAllChats();
    Alert.alert(t(language, 'deleteAll'), t(language, 'allChatsDeleted'));
    navigation.goBack();
  };
  const handleDeleteAccount = () => {
    Alert.alert(t(language, 'deleteAccount'), t(language, 'accountDeletionNotImplemented'));
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

