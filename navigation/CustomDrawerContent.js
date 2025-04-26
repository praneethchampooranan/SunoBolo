import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DEMO_CHATS = [
  { id: '1', title: 'Multilingual AI Chat App' },
  { id: '2', title: 'Chipotle vs Kebab Health' },
  { id: '3', title: 'Image modification request' },
  { id: '4', title: 'Digital Illustration Request' }
];

export default function CustomDrawerContent(props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [search, setSearch] = useState('');
  const user = props?.user || { name: 'Friend' };
  const initials = getInitials(user?.name);

  const filteredChats = DEMO_CHATS.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

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
        <TouchableOpacity style={{ marginLeft: 8 }}>
          <Ionicons name="add" size={24} color={isDark ? '#4f8cff' : '#2563eb'} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.chatItem, { backgroundColor: isDark ? '#23232b' : '#f3f4f6' }]}
            onPress={() => props.navigation.navigate('Chat', { chatId: item.id })}
          >
            <Text style={[styles.chatTitle, { color: isDark ? '#fff' : '#18181b' }]}>{item.title}</Text>
          </TouchableOpacity>
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
        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => props.navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={isDark ? '#aaa' : '#444'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => {/* handle theme toggle */}}>
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
