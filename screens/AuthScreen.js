import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../utils/supabase';

export default function AuthScreen({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [showResend, setShowResend] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'sunobolo://login'
          }
        });
        if (result.error) throw result.error;
        setInfo('Check your email for a confirmation link.');
        setShowResend(true);
        // Navigate to ProfileInfoScreen after signup (email/phone shown, name/DOB collected)
        if (result.data?.user) {
          onAuthSuccess('ProfileInfo', { email: result.data.user.email, phone: result.data.user.phone });
        }
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        // Check if user is confirmed
        if (result.data?.user && !result.data.user.confirmed_at) {
          setError('Your email is not confirmed. Please check your inbox or resend the confirmation email.');
          setShowResend(true);
          return;
        }
        onAuthSuccess();
      }
    } catch (err) {
      if (err.message && err.message.includes('Email not confirmed')) {
        setError('Your email is not confirmed. Please check your inbox or resend the confirmation email.');
        setShowResend(true);
      } else {
        setError(err.message || 'An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: 'sunobolo://login' }
      });
      if (error) throw error;
      setInfo('Confirmation email resent. Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Could not resend confirmation email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Image source={require('../assets/sunobolo_final.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          accessible accessibilityLabel="Email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          accessible accessibilityLabel="Password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading} accessibilityRole="button">
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>}
        </TouchableOpacity>
        {showResend && (
          <TouchableOpacity style={styles.resendButton} onPress={handleResend} disabled={loading} accessibilityRole="button">
            <Text style={styles.resendText}>Resend Confirmation Email</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => { setIsSignUp(!isSignUp); setError(''); setInfo(''); setShowResend(false); }} accessibilityRole="button">
          <Text style={styles.switchText}>{isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  logo: {
    width: 180,
    height: 60,
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 20,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    color: '#222',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    maxWidth: 320,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    color: '#2563eb',
    marginTop: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  error: {
    color: '#dc2626',
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});
