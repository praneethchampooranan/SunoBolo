import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from './utils/supabase';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import RootNavigator from './navigation/RootNavigator';
import { ThemeProvider } from './utils/ThemeContext';
import { LanguageProvider } from './utils/LanguageContext';
import { ChatProvider } from './context/ChatContext';
// import ThemeProvider from './providers/ThemeProvider'; // Uncomment if you have a ThemeProvider
// import LanguageProvider from './providers/LanguageProvider'; // Uncomment if you have a LanguageProvider

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ChatProvider>
          <NavigationContainer>
            {session ? (
              <RootNavigator />
            ) : (
              <AuthScreen onAuthSuccess={(screen, params) => {
                if (screen === 'ProfileInfo') {
                  // Show profile info screen after signup
                  setSession('pending_profile');
                  global.__PROFILE_INFO_PARAMS__ = params;
                } else {
                  supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
                }
              }} />
            )}
          </NavigationContainer>
        </ChatProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
