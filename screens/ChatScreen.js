import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LanguageContext } from '../utils/LanguageContext';
import { ThemeContext } from '../utils/ThemeContext';
import { supabase } from '../utils/supabase';
import { archiveChat } from '../navigation/CustomDrawerContent';
import { useAuth } from '../utils/useAuth';

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function mockAIResponse(userInput, language) {
  // This function mocks an AI response in the selected language.
  // Replace with real AI integration later.
  switch (language) {
    case 'hi': return 'यह एक डेमो उत्तर है।';
    case 'ta': return 'இது ஒரு டெமோ பதில்.';
    case 'bn': return 'এটি একটি ডেমো উত্তর।';
    case 'gu': return 'આ એક ડેમો જવાબ છે.';
    case 'mr': return 'हा एक डेमो उत्तर आहे.';
    case 'te': return 'ఇది ఒక డెమో సమాధానం.';
    case 'kn': return 'ಇದು ಒಂದು ಡೆಮೊ ಉತ್ತರ.';
    default: return "This is a demo response.";
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../utils/translations';

export default function ChatScreen({ navigation, route }) {
  // Feedback tracking state (prevents double feedback per message)
  const feedbackGivenRef = useRef({});
  const [, forceUpdate] = useState(0);

  const { language } = useContext(LanguageContext);
  const chatId = route?.params?.chatId;
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const chatId = navigation?.getState?.()?.routes?.find(r => r.name === 'Chat')?.params?.chatId || navigation?.getParam?.('chatId');
            Alert.alert(
              'Chat Options',
              '',
              [
                { text: 'Rename Chat', onPress: () => Alert.prompt('Rename Chat', 'Enter a new name for this chat:', (text) => {/* TODO: Rename logic */}) },
                { text: 'Delete Chat', style: 'destructive', onPress: () => Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => {/* TODO: Delete logic */} }
                ]) },
                { text: 'Archive Chat', onPress: async () => {
                    if (!chatId) return Alert.alert('Error', 'No chat ID found.');
                    if (typeof navigation?.dangerouslyGetParent === 'function') {
                      const parent = navigation.dangerouslyGetParent();
                      if (parent && typeof parent.setParams === 'function' && typeof parent.getParam === 'function') {
                        const setArchivedChats = parent.getParam('setArchivedChats');
                        await archiveChat(chatId, setArchivedChats);
                      } else {
                        await archiveChat(chatId);
                      }
                    } else if (typeof navigation?.setArchivedChats === 'function') {
                      await archiveChat(chatId, navigation.setArchivedChats);
                    } else {
                      await archiveChat(chatId);
                    }
                    Alert.alert('Chat Archived', 'This chat has been archived and will be visible in Settings > Archived Chats.');
                    navigation.goBack();
                  }
                },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
          style={{ marginRight: 18 }}
        >
          <Ionicons name="ellipsis-vertical" size={22} color={isDark ? '#fff' : '#222'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDark]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const flatListRef = useRef();

  // Load messages for this chat from AsyncStorage on mount
  useEffect(() => {
    if (!chatId) return;
    setLoadingHistory(true);
    (async () => {
      try {
        const all = await AsyncStorage.getItem('messages');
        const allMessages = all ? JSON.parse(all) : {};
        if (allMessages[chatId] && allMessages[chatId].length > 0) {
          setMessages(allMessages[chatId]);
        } else {
          // If no messages exist, show the welcome message in the selected language
          setMessages([
            {
              sender: 'ai',
              text: t(language, 'introMessage'),
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch {
        setMessages([]);
      } finally {
        setLoadingHistory(false);
      }
    })();
  }, [chatId]);

// Save messages for this chatId when they change
  useEffect(() => {
    if (!chatId) return;
    (async () => {
      try {
        const all = await AsyncStorage.getItem('messages');
        const allMessages = all ? JSON.parse(all) : {};
        allMessages[chatId] = messages;
        await AsyncStorage.setItem('messages', JSON.stringify(allMessages));
      } catch {}
    })();
  }, [messages, chatId]);
  useEffect(() => {
    if (!user || !chatId) return;
    const fetchMessages = async () => {
      setLoadingHistory(true);
      let { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      if (!error && data) {
        console.log('Supabase messages for chatId', chatId, data);
        setMessages(data);
      }
      setLoadingHistory(false);
    };
    fetchMessages();
  }, [user, chatId]);

  // Send message and persist to AsyncStorage per chat
  const handleSend = async () => {
    if (!input.trim() || !user || !chatId) return;
    const userMsg = {
      user_id: user.id,
      sender: 'user',
      text: input,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // Simulate AI response
    setLoadingAI(true);
    setTimeout(() => {
      const aiResponse = {
        user_id: user.id,
        sender: 'ai',
        text: mockAIResponse(userMsg.text, language),
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoadingAI(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 900);
  };

  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(text);
    alert('Copied to clipboard!');
  };

  const handleFeedback = async (item, type) => {
    // Prevent double feedback per message
    if (feedbackGivenRef.current[item.created_at]) return;
    feedbackGivenRef.current[item.created_at] = true;
    forceUpdate(x => x + 1); // re-render to disable buttons
    // Send feedback to Supabase
    await supabase.from('feedback').insert([
      {
        response: item.text,
        feedback: type,
        created_at: new Date().toISOString(),
      },
    ]);
    alert('Feedback sent!');
  };

  const renderItem = ({ item }) => {
    const bubbleStyle = [
      styles.bubble,
      item.sender === 'user'
        ? {
            backgroundColor: isDark ? '#35363b' : '#ececec',
            alignSelf: 'flex-end',
            shadowColor: isDark ? '#000' : '#bbb',
            shadowOpacity: 0.09,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }
        : {
            backgroundColor: isDark ? '#23232b' : '#fff',
            alignSelf: 'flex-start',
            shadowColor: isDark ? '#000' : '#bbb',
            shadowOpacity: 0.09,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }
    ];
    const textStyle = item.sender === 'user'
      ? { color: isDark ? '#fff' : '#18181b', fontSize: 16 }
      : { color: isDark ? '#f3f4f6' : '#18181b', fontSize: 16 };
    const timeStyle = {
      fontSize: 12,
      color: isDark ? '#aaa' : '#94a3b8',
      marginTop: 2,
      alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
    };
    return (
      <View style={[styles.messageRow, item.sender === 'user' ? styles.myMessageRow : styles.aiMessageRow]}>
        <View style={bubbleStyle}>
          <Text style={textStyle}>{item.text}</Text>
          <Text style={timeStyle}>{formatTimestamp(item.created_at)}</Text>
          {/* Place the action bar INSIDE the bubble, below the text and timestamp */}
          {item.sender === 'ai' && (
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleCopy(item.text)} style={{ marginHorizontal: 8, padding: 4 }}>
                  <Ionicons name="copy-outline" size={16} color={isDark ? '#b0b3b8' : '#888'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Listen!')} style={{ marginHorizontal: 8, padding: 4 }}>
                  <Ionicons name="volume-high-outline" size={16} color={isDark ? '#b0b3b8' : '#888'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFeedback(item, 'up')} style={{ marginHorizontal: 8, padding: 4 }} disabled={feedbackGivenRef.current[item.created_at]}>
                  <Ionicons name="thumbs-up-outline" size={16} color={isDark ? '#b0b3b8' : '#888'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFeedback(item, 'down')} style={{ marginHorizontal: 8, padding: 4 }} disabled={feedbackGivenRef.current[item.created_at]}>
                  <Ionicons name="thumbs-down-outline" size={16} color={isDark ? '#b0b3b8' : '#888'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Regenerate!')} style={{ marginHorizontal: 8, padding: 4 }}>
                  <Ionicons name="refresh-outline" size={16} color={isDark ? '#b0b3b8' : '#888'} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#18181b' : '#fff', flex: 1 }]}>
      <View style={{ flex: 1 }}>
      {loadingHistory ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {loadingAI && (
        <View style={styles.loadingAI}><ActivityIndicator size="small" color={isDark ? '#8ab4f8' : '#2563eb'} /><Text style={{ marginLeft: 8, color: isDark ? '#fff' : '#222' }}>SunoBolo is typing…</Text></View>
      )}
    </View>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={16}
      style={{}}
    >
      <View style={[styles.inputBar, { backgroundColor: isDark ? '#23232b' : '#fff', shadowColor: isDark ? '#000' : '#000', marginBottom: Platform.OS === 'ios' ? 12 : 0, paddingVertical: 4, alignItems: 'flex-end' }]}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="mic-outline" size={24} color="#2563eb" />
          </TouchableOpacity>
          <TextInput
            style={[styles.inputGrow, { color: isDark ? '#fff' : '#18181b', maxHeight: 120, minHeight: 44, paddingVertical: 10 }]}
            value={input}
            onChangeText={setInput}
            placeholder={
              language === 'hi' ? 'सुनोबोलो से पूछें' :
              language === 'ta' ? 'SunoBolo ஐ கேளுங்கள்' :
              language === 'bn' ? 'SunoBolo-কে জিজ্ঞাসা করুন' :
              language === 'gu' ? 'SunoBolo ને પૂછો' :
              language === 'mr' ? 'SunoBolo ला विचारा' :
              language === 'te' ? 'SunoBolo ను అడగండి' :
              language === 'kn' ? 'SunoBolo ಅನ್ನು ಕೇಳಿ' :
              'Ask SunoBolo'
            }
            placeholderTextColor={isDark ? '#aaa' : '#888'}
            multiline
            numberOfLines={1}
            maxLength={1000}
            returnKeyType="default"
            textAlignVertical="top"
            accessible accessibilityLabel="Message input"
          />
          <TouchableOpacity
            style={[styles.roundButton, { backgroundColor: input.trim() ? '#2563eb' : '#d1d5db', opacity: input.trim() ? 1 : 0.6, marginLeft: 0, marginRight: 2 }]}
            onPress={input.trim() ? handleSend : undefined}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            disabled={!input.trim()}
            activeOpacity={input.trim() ? 0.7 : 1}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  myMessageRow: { justifyContent: 'flex-end' },
  aiMessageRow: { justifyContent: 'flex-start' },
  bubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    maxWidth: '80%',
  },
  // Dynamic styles for myBubble, aiBubble, myText, aiText, timeText are handled inline in renderItem

  inputBarContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  inputGrow: {
    flex: 1,
    fontSize: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
    paddingHorizontal: 0,
    minHeight: 44,
    maxHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
    marginHorizontal: 12,
    color: '#18181b',
  },
  sendBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', marginLeft: 8 },
  loadingAI: { flexDirection: 'row', alignItems: 'center', padding: 8, marginLeft: 12 },
});
