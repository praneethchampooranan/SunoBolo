
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useIsFocused } from '@react-navigation/native';

import { useContext } from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import { LanguageContext } from '../utils/LanguageContext';

export default function ArchiveChatsScreen({ navigation }) {
  const { archivedChats, unarchiveChat, deleteChat } = useChatContext();
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#18181b' : '#f8fafc' }]}> 
      {/* Header Row */}
      <View style={[styles.headerRow, { marginTop: 24 }]}> 
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.headerIconBtn}>
          <Ionicons name="arrow-back" size={26} color={theme === 'dark' ? '#fff' : '#23232b'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#23232b', flex: 1, textAlign: 'center' }]}>Archived Chats</Text>
        <View style={{ width: 26 }} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={[styles.sectionBox, { marginTop: 30, backgroundColor: theme === 'dark' ? '#23232b' : '#fff', borderColor: theme === 'dark' ? '#393a41' : '#e5e7eb', borderWidth: 1 }]}> 
          <FlatList
            data={archivedChats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme === 'dark' ? '#bcbcbc' : '#888'} style={styles.icon} />
                <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#23232b' }]}>{item.title}</Text>
                <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                  <TouchableOpacity onPress={() => {
                    navigation.navigate('ArchivedChatViewScreen', { chat: item });
                  }} style={styles.actionBtn}>
                    <Ionicons name="eye-outline" size={22} color={theme === 'dark' ? '#fff' : '#23232b'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    Alert.alert(
                      'Confirm',
                      'Are you sure you want to permanently delete this archived chat? This cannot be undone.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => {
                          deleteChat(item.id);
                        }}
                      ]
                    );
                  }} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={22} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    unarchiveChat(item.id);
                    Alert.alert('Chat Restored', 'This chat has been moved back to your main chat list.');
                    navigation.navigate('Home');
                    setTimeout(() => {
                      navigation.openDrawer && navigation.openDrawer();
                      setTimeout(() => {
                        navigation.closeDrawer && navigation.closeDrawer();
                      }, 350);
                    }, 350);
                  }} style={styles.actionBtn}>
                    <Ionicons name="arrow-up-circle-outline" size={22} color={theme === 'dark' ? '#fff' : '#23232b'} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                <Text style={{ textAlign: 'center', color: theme === 'dark' ? '#bcbcbc' : '#888' }}>No archived chats.</Text>
              </View>
            }
          />
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
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginRight: 8,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 0, textAlign: 'center' },
  sectionBox: {
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 0,
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#393a41',
  },
  icon: { marginRight: 18 },
  label: { fontSize: 16, fontWeight: '500' },
  actionBtn: { marginLeft: 14, padding: 4 },
});
