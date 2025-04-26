import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Image, Text } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        navigation.replace('Onboarding');
      }, 800);
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {!imageError ? (
          <Image
            source={require('../assets/sunobolo_final.png')}
            style={styles.logoImg}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <Text style={styles.logoText}>SunoBolo</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 220,
    height: 80,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
