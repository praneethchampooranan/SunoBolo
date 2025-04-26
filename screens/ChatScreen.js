import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../utils/LanguageContext';
import { supabase } from '../utils/supabase';
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

export default function ChatScreen() {
  const { language } = useContext(LanguageContext);
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const flatListRef = useRef();

  // Load messages from Supabase on mount
  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      setLoadingHistory(true);
      let { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (!error && data) setMessages(data);
      setLoadingHistory(false);
    };
    fetchMessages();
  }, [user]);

  // Send message and persist to Supabase
  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const userMsg = {
      user_id: user.id,
      sender: 'user',
      text: input,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    await supabase.from('messages').insert([userMsg]);
    // Simulate AI response
    setLoadingAI(true);
    setTimeout(async () => {
      const aiResponse = {
        user_id: user.id,
        sender: 'ai',
        text: mockAIResponse(userMsg.text, language),
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      await supabase.from('messages').insert([aiResponse]);
      setLoadingAI(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 900);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageRow, item.sender === 'user' ? styles.myMessageRow : styles.aiMessageRow]}>
      <View style={[styles.bubble, item.sender === 'user' ? styles.myBubble : styles.aiBubble]}>
        <Text style={item.sender === 'user' ? styles.myText : styles.aiText}>{item.text}</Text>
        <Text style={styles.timeText}>{formatTimestamp(item.created_at)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {loadingAI && (
        <View style={styles.loadingAI}><ActivityIndicator size="small" color="#2563eb" /><Text style={{ marginLeft: 8 }}>AI is typing…</Text></View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={16}
        style={styles.inputBarContainer}
      >
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mic-outline" size={24} color="#aaa" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            onSubmitEditing={handleSend}
            returnKeyType="send"
            accessible accessibilityLabel="Message input"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} accessibilityRole="button">
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  myMessageRow: { justifyContent: 'flex-end' },
  aiMessageRow: { justifyContent: 'flex-start' },
  bubble: { padding: 12, borderRadius: 12, marginVertical: 4, maxWidth: '80%' },
  myBubble: { backgroundColor: '#2563eb', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#e5e7eb', alignSelf: 'flex-start' },
  myText: { color: '#fff', fontSize: 16 },
  aiText: { color: '#222', fontSize: 16 },
  timeText: { fontSize: 12, color: '#94a3b8', marginTop: 2, alignSelf: 'flex-end' },
  inputBarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  iconButton: { padding: 8, marginRight: 8 },
  msgText: { color: '#222', fontSize: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fafafa' },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  sendBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', marginLeft: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 6 },
  timestamp: { fontSize: 12, color: '#94a3b8', marginTop: 2, alignSelf: 'flex-end' },
  loadingAI: { flexDirection: 'row', alignItems: 'center', padding: 8, marginLeft: 12 },
});
