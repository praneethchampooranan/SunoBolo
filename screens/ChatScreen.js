import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { LanguageContext } from '../utils/LanguageContext';

export default function ChatScreen() {
  const { language } = useContext(LanguageContext);
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const aiResponse = { id: (Date.now() + 1).toString(), sender: 'ai', text: mockAIResponse(input, language) };
      setMessages(prev => [...prev, aiResponse]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 700);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.message, item.sender === 'user' ? styles.userMsg : styles.aiMsg]}>
              <Text style={styles.msgText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  message: { padding: 12, borderRadius: 12, marginVertical: 4, maxWidth: '80%' },
  userMsg: { backgroundColor: '#2563eb', alignSelf: 'flex-end' },
  aiMsg: { backgroundColor: '#e5e7eb', alignSelf: 'flex-start' },
  msgText: { color: '#222', fontSize: 16 },
  inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fafafa' },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  sendBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', marginLeft: 8 },
});
