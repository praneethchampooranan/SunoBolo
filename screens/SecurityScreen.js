import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityScreen({ navigation }) {
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handleToggleMfa = () => {
    setMfaEnabled(v => !v);
    Alert.alert('Multi-Factor Authentication', mfaEnabled ? 'MFA Disabled.' : 'MFA Enabled. (Stub)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security</Text>
      <View style={styles.row}>
        <Ionicons name="shield-checkmark-outline" size={22} color="#2563eb" style={styles.icon} />
        <Text style={styles.label}>Multi-Factor Authentication</Text>
        <View style={{ flex: 1 }} />
        <Switch value={mfaEnabled} onValueChange={handleToggleMfa} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 28, textAlign: 'center', color: '#2563eb' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  icon: { marginRight: 18 },
  label: { fontSize: 16, color: '#222', fontWeight: '500' },
});
