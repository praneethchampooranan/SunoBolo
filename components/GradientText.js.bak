import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function GradientText({ text, style, colors = ['#ffaa40', '#9c40ff', '#ffaa40'], start = { x: 0, y: 0 }, end = { x: 1, y: 0 } }) {
  return (
    <MaskedView
      maskElement={
        <Text style={[styles.text, style, { backgroundColor: 'transparent' }]}>{text}</Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={{ flex: 1 }}
      >
        <Text style={[styles.text, style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
