import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useRef } from 'react';

export default function HomeScreen(props) {
  const reloadChatsRef = useRef(null);
  // If setReloadChats is passed, save the callback
  if (props.setReloadChats) props.setReloadChats(fn => { reloadChatsRef.current = fn; });
  useFocusEffect(
    React.useCallback(() => {
      if (reloadChatsRef.current) reloadChatsRef.current();
    }, [])
  );
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 32, color: '#2563eb' }}>Hello, Friend</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 24,
    marginTop: -40,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 28,
    color: '#aaa',
    marginBottom: 0,
    fontWeight: '500',
    textAlign: 'center',
  },
  gradientTextContainer: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 32,
    marginTop: 8,
    alignSelf: 'center',
  },
  username: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 32,
    textShadowColor: '#a259ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
