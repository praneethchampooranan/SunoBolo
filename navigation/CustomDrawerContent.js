import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, useColorScheme, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../utils/ThemeContext';
import { useChatContext } from '../context/ChatContext';
import { t } from '../utils/translations';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Removed DEMO_CHATS. Chats will now persist only via AsyncStorage.

// Export helpers for archive/delete
export async function archiveAllChats() {
  const stored = await AsyncStorage.getItem('chats');
  const archived = await AsyncStorage.getItem('archivedChats');
  let chats = stored ? JSON.parse(stored) : [];
  let arch = archived ? JSON.parse(archived) : [];
  arch = [...chats, ...arch];
  await AsyncStorage.setItem('archivedChats', JSON.stringify(arch));
  await AsyncStorage.setItem('chats', JSON.stringify([]));
}
export async function deleteAllChats() {
  await AsyncStorage.setItem('chats', JSON.stringify([]));
  await AsyncStorage.setItem('archivedChats', JSON.stringify([]));
}
export async function archiveChat(chatId, setArchivedChatsCallback) {
  const stored = await AsyncStorage.getItem('chats');
  const archived = await AsyncStorage.getItem('archivedChats');
  let chats = stored ? JSON.parse(stored) : [];
  let arch = archived ? JSON.parse(archived) : [];
  // Move chat object
  const idx = chats.findIndex(c => c.id === chatId);
  if (idx !== -1) {
    arch.unshift(chats[idx]);
    chats.splice(idx, 1);
    await AsyncStorage.setItem('archivedChats', JSON.stringify(arch));
    await AsyncStorage.setItem('chats', JSON.stringify(chats));
    console.log('archiveChat: archivedChats after update:', arch);
    console.log('archiveChat: chats after update:', chats);
    if (typeof setArchivedChatsCallback === 'function') setArchivedChatsCallback(arch);
    // Move messages as well
    const allMessagesRaw = await AsyncStorage.getItem('messages');
    const allMessages = allMessagesRaw ? JSON.parse(allMessagesRaw) : {};
    const archivedMessagesRaw = await AsyncStorage.getItem('archivedChatsMessages');
    const archivedMessages = archivedMessagesRaw ? JSON.parse(archivedMessagesRaw) : {};
    if (allMessages[chatId]) {
      console.log('archiveChat: moving messages for chatId', chatId, allMessages[chatId]);
      archivedMessages[chatId] = allMessages[chatId];
      delete allMessages[chatId];
      await AsyncStorage.setItem('messages', JSON.stringify(allMessages));
      await AsyncStorage.setItem('archivedChatsMessages', JSON.stringify(archivedMessages));
      console.log('archiveChat: archivedChatsMessages after update:', archivedMessages);
      console.log('archiveChat: messages after update:', allMessages);
    }
  }
}
export async function deleteChat(chatId) {
  const stored = await AsyncStorage.getItem('chats');
  let chats = stored ? JSON.parse(stored) : [];
  chats = chats.filter(c => c.id !== chatId);
  await AsyncStorage.setItem('chats', JSON.stringify(chats));
}
export async function unarchiveChat(chatId, setChatsCallback) {
  const archived = await AsyncStorage.getItem('archivedChats');
  const stored = await AsyncStorage.getItem('chats');
  let arch = archived ? JSON.parse(archived) : [];
  let chats = stored ? JSON.parse(stored) : [];
  const idx = arch.findIndex(c => c.id === chatId);
  if (idx !== -1) {
    chats.unshift(arch[idx]);
    arch.splice(idx, 1);
    await AsyncStorage.setItem('archivedChats', JSON.stringify(arch));
    await AsyncStorage.setItem('chats', JSON.stringify(chats));
    // Move messages back from archivedChatsMessages to messages
    const archivedMessagesRaw = await AsyncStorage.getItem('archivedChatsMessages');
    const archivedMessages = archivedMessagesRaw ? JSON.parse(archivedMessagesRaw) : {};
    const allMessagesRaw = await AsyncStorage.getItem('messages');
    const allMessages = allMessagesRaw ? JSON.parse(allMessagesRaw) : {};
    if (archivedMessages[chatId]) {
      allMessages[chatId] = archivedMessages[chatId];
      delete archivedMessages[chatId];
      await AsyncStorage.setItem('messages', JSON.stringify(allMessages));
      await AsyncStorage.setItem('archivedChatsMessages', JSON.stringify(archivedMessages));
    }
    console.log('unarchiveChat: archivedChats after update:', arch);
    console.log('unarchiveChat: chats after update:', chats);
    if (typeof setChatsCallback === 'function') setChatsCallback(chats);
  }
}

export async function deleteArchivedChat(chatId) {
  const archived = await AsyncStorage.getItem('archivedChats');
  let arch = archived ? JSON.parse(archived) : [];
  arch = arch.filter(c => c.id !== chatId);
  await AsyncStorage.setItem('archivedChats', JSON.stringify(arch));
}

export async function getArchivedChats() {
  const archived = await AsyncStorage.getItem('archivedChats');
  return archived ? JSON.parse(archived) : [];
}

export default function CustomDrawerContent(props) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [search, setSearch] = React.useState('');
  const { chats, archivedChats, addChat, deleteChat, archiveChat, unarchiveChat, renameChat } = useChatContext();
  const user = props?.user || { name: 'Friend' };
  const initials = getInitials(user?.name);

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  const { language } = useContext(require('../utils/LanguageContext').LanguageContext);

  const handleAddChat = async () => {
    // Always generate a fresh unique chat object
    // Always use 'New Chat' as the title for new chats (allowing duplicates)
    const newChat = { id: generateId(), title: 'New Chat' };
    addChat(newChat);
    setSearch('');
    // Always set unique welcome message in selected language for every new chat
    try {
      const allMessagesRaw = await AsyncStorage.getItem('messages');
      const allMessages = allMessagesRaw ? JSON.parse(allMessagesRaw) : {};
      allMessages[newChat.id] = [
        {
          sender: 'ai',
          text: t(language, 'introMessage'),
          created_at: new Date().toISOString(),
        }
      ];
      await AsyncStorage.setItem('messages', JSON.stringify(allMessages));
    } catch (e) {
      console.warn('Failed to set welcome message for new chat:', e);
    }
    // Navigate to the new chat
    props.navigation.navigate('Chat', { chatId: newChat.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#18181b' : '#fff' }]}>    
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={isDark ? '#aaa' : '#555'} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#18181b' }]}
          placeholder="Search chats"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={{ marginLeft: 8 }} onPress={handleAddChat}>
          <Ionicons name="add" size={24} color={isDark ? '#4f8cff' : '#2563eb'} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.chatItem, { backgroundColor: isDark ? '#23232b' : '#f3f4f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
            <TouchableOpacity style={{ flex: 1 }} onPress={() => props.navigation.navigate('Chat', { chatId: item.id })}>
              <Text style={[styles.chatTitle, { color: isDark ? '#fff' : '#18181b' }]} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingHorizontal: 8, paddingVertical: 8 }}
              onPress={() => {
                // Show menu options for this chat
                Alert.alert(
                  'Chat Options',
                  '',
                  [
                    { text: 'Rename Chat', onPress: () => {
                      Alert.prompt('Rename Chat', 'Enter a new name for this chat:', (newTitle) => {
                        if (newTitle && newTitle.trim()) {
                          renameChat(item.id, newTitle.trim());
                        }
                      }, 'plain-text', item.title);
                    }},
                    { text: 'Delete Chat', style: 'destructive', onPress: () => Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteChat(item.id) }
                    ]) },
                    { text: 'Archive Chat', onPress: () => {
                      archiveChat(item.id);
                      Alert.alert('Chat Archived', 'This chat has been archived and will be visible in Settings > Archived Chats.');
                    }},
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={isDark ? '#bbb' : '#888'} />
            </TouchableOpacity>
          </View>
        )}
        style={{ flex: 1, marginTop: 12 }}
      />
      <View style={styles.bottomProfile}>
        <LinearGradient
          colors={['#4f8cff', '#a259ff']}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarText}>{initials || '?'}</Text>
        </LinearGradient>
        <Text style={[styles.profileName, { color: isDark ? '#fff' : '#18181b' }]}>{user.name}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => props.navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={isDark ? '#aaa' : '#444'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 8 }} onPress={toggleTheme}>
          <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={isDark ? '#ffd700' : '#222'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232b',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  chatItem: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
});
