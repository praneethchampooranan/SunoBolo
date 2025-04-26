import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';
import { upsertProfile } from '../utils/profile';

export default function ProfileInfoScreen() {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSave = async () => {
    if (!name.trim() || !birthdate) {
      setError('Please enter your full name and birthdate.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }
      const userId = session.user.id;
      const success = await upsertProfile(userId, { name: name.trim(), birthdate });
      if (success) {
        navigation.reset({ index: 0, routes: [{ name: 'Home', params: { user: { name: name.trim(), birthdate } } }] });
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } catch (e) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => setShowDate(true);
  const onDateChange = (event, selectedDate) => {
    setShowDate(Platform.OS === 'ios');
    if (selectedDate) setBirthdate(selectedDate.toISOString().slice(0, 10));
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us about yourself</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        accessibilityLabel="Full Name"
      />
      <TouchableOpacity style={styles.input} onPress={showDatePicker} accessibilityRole="button">
        <Text style={{ color: birthdate ? '#222' : '#888', fontSize: 18 }}>
          {birthdate ? `Birthdate: ${birthdate}` : 'Select Birthdate'}
        </Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          value={birthdate ? new Date(birthdate) : new Date(2000, 0, 1)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={onDateChange}
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSave} accessibilityRole="button" disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#222',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 44,
    marginTop: 18,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  error: {
    color: '#dc2626',
    marginBottom: 8,
    fontSize: 15,
  },
});
