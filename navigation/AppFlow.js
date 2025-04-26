import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';
import { getProfile, upsertProfile } from '../utils/profile';

export default function AppFlow({ session, RootNavigator, AuthScreen }) {
  const navigation = useNavigation();
  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkFlow = async () => {
      if (!session) {
        setChecking(false);
        return;
      }
      // Check if first launch
      const isFirstLaunch = !(await AsyncStorage.getItem('hasLaunched'));
      if (isFirstLaunch) {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        await AsyncStorage.setItem('hasLaunched', 'true');
        setChecking(false);
        return;
      }
      // Check profile
      const prof = await getProfile(session.user.id);
      if (!prof || !prof.name || !prof.birthdate) {
        navigation.reset({ index: 0, routes: [{ name: 'ProfileInfo' }] });
        setChecking(false);
        return;
      }
      setProfile(prof);
      navigation.reset({ index: 0, routes: [{ name: 'Home', params: { user: prof } }] });
      setChecking(false);
    };
    checkFlow();
  }, [session]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  // Render nothing, navigation will handle flow
  return null;
}
