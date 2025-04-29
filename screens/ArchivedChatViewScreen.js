import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ArchivedChatViewScreen({ route, navigation }) {
  const { chat } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const all = await AsyncStorage.getItem('archivedChatsMessages');
        const allMessages = all ? JSON.parse(all) : {};
        const archived = allMessages[chat.id];
        console.log('ArchivedChatViewScreen: archivedChatsMessages for chat.id', chat.id, archived);
        if (archived && archived.length > 0) {
          setMessages(archived);
        } else {
          // Fallback: check messages (active chats) in case archiving failed
          const allActiveRaw = await AsyncStorage.getItem('messages');
          const allActive = allActiveRaw ? JSON.parse(allActiveRaw) : {};
          const fallback = allActive[chat.id];
          console.log('ArchivedChatViewScreen: fallback messages for chat.id', chat.id, fallback);
          setMessages(fallback || []);
        }
      } catch (e) {
        console.log('ArchivedChatViewScreen: error loading messages', e);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [chat.id]);

  const renderMessage = ({ item }) => (
    <View style={[styles.messageRow, item.sender === 'user' ? styles.myMessageRow : styles.aiMessageRow]}>
      <View style={[styles.messageBubble, item.sender === 'user' ? styles.myBubble : styles.aiBubble]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: 'absolute', left: 16, top: 44, zIndex: 10 }}
        onPress={() => navigation.navigate('ArchiveChatsScreen')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={{ alignItems: 'center', width: '100%', marginTop: 40 }}>
        <Ionicons name="chatbubble-ellipses-outline" size={40} color="#888" style={{ marginBottom: 12 }} />
        <Text style={styles.title}>{chat.title}</Text>
        <Text style={styles.info}>(Archived - View Only)</Text>
        {loading ? (
          <ActivityIndicator color="#888" style={{ marginTop: 32 }} />
        ) : messages.length === 0 ? (
          <Text style={{ color: '#aaa', marginTop: 32 }}>(No messages in this chat)</Text>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, idx) => idx.toString()}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 32, minHeight: 300 }}
            style={{ width: '100%' }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18181b',
    padding: 24,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  info: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 12,
  },
  messageRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  aiMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  myBubble: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#23232b',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
});
