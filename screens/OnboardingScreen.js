import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton';

const slides = [
  { key: '1', title: 'Welcome to SunoBolo', description: 'Your multilingual AI chat companion for India.' },
  { key: '2', title: 'Chat in Your Language', description: 'Interact with AI in Hindi, English, Tamil, Bengali, and more.' },
  { key: '3', title: 'Minimalist & Accessible', description: 'Simple, beautiful, and designed for everyone.' },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('LanguageSelection');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get('window').width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        keyExtractor={item => item.key}
      />
      <CustomButton title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'} onPress={handleNext} />
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, currentIndex === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  slide: { width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2563eb', marginBottom: 16 },
  description: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 32 },
  dotsContainer: { flexDirection: 'row', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#cbd5e1', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#2563eb' },
});
