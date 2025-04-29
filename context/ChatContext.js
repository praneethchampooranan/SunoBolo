import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [archivedChats, setArchivedChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load chats and archivedChats from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('chats');
        const archived = await AsyncStorage.getItem('archivedChats');
        setChats(stored ? JSON.parse(stored) : []);
        setArchivedChats(archived ? JSON.parse(archived) : []);
      } catch (e) {
        setChats([]);
        setArchivedChats([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Persist chats and archivedChats to AsyncStorage on change
  useEffect(() => {
    if (!loading) AsyncStorage.setItem('chats', JSON.stringify(chats));
  }, [chats, loading]);
  useEffect(() => {
    if (!loading) AsyncStorage.setItem('archivedChats', JSON.stringify(archivedChats));
  }, [archivedChats, loading]);

  // Chat actions
  const addChat = useCallback(chat => {
    setChats(prev => [chat, ...prev]);
  }, []);

  const archiveChat = useCallback(chatId => {
    setChats(prevChats => {
      const idx = prevChats.findIndex(c => c.id === chatId);
      if (idx === -1) return prevChats;
      const chat = prevChats[idx];
      setArchivedChats(prevArch => [chat, ...prevArch]);
      return prevChats.filter(c => c.id !== chatId);
    });
  }, []);

  const unarchiveChat = useCallback(chatId => {
    setArchivedChats(prevArch => {
      const idx = prevArch.findIndex(c => c.id === chatId);
      if (idx === -1) return prevArch;
      const chat = prevArch[idx];
      setChats(prevChats => [chat, ...prevChats]);
      return prevArch.filter(c => c.id !== chatId);
    });
  }, []);

  // Delete all active chats (do NOT touch archived chats)
  const deleteAllChats = useCallback(() => {
    setChats([]);
    AsyncStorage.setItem('chats', JSON.stringify([]));
    // Do not modify archivedChats or its storage
  }, []);

  const deleteChat = useCallback(chatId => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    setArchivedChats(prev => prev.filter(c => c.id !== chatId));
  }, []);

  // Archive all chats
  const archiveAllChats = useCallback(() => {
    setChats(prevChats => {
      setArchivedChats(prevArch => [...prevChats, ...prevArch]);
      // Also update AsyncStorage for both
      AsyncStorage.setItem('archivedChats', JSON.stringify([...prevChats, ...archivedChats]));
      AsyncStorage.setItem('chats', JSON.stringify([]));
      return [];
    });
  }, [archivedChats]);

  // Add renameChat action
  const renameChat = useCallback((chatId, newTitle) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
    setArchivedChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
  }, []);

  return (
    <ChatContext.Provider value={{
      chats,
      archivedChats,
      loading,
      addChat,
      archiveChat,
      unarchiveChat,
      deleteChat,
      renameChat,
      archiveAllChats,
      deleteAllChats
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
