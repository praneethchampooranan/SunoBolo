import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';
import { getProfile } from '../utils/profile';

export default function FlowScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkFlow = async () => {
      // Check session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        return;
      }
      // Check if first launch
      const isFirstLaunch = !(await AsyncStorage.getItem('hasLaunched'));
      if (isFirstLaunch) {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        await AsyncStorage.setItem('hasLaunched', 'true');
        return;
      }
      // Check profile
      const prof = await getProfile(session.user.id);
      if (!prof || !prof.name || !prof.birthdate) {
        navigation.reset({ index: 0, routes: [{ name: 'ProfileInfo' }] });
        return;
      }
      navigation.reset({ index: 0, routes: [{ name: 'Main', params: { user: prof } }] });
    };
    checkFlow();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}
