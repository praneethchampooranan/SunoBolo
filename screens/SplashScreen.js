import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
// import LottieView from 'lottie-react-native'; // Uncomment if you add a Lottie animation

export default function SplashScreen({ navigation }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

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
      {/* <LottieView source={require('../assets/logo-animation.json')} autoPlay loop={false} /> */}
      <Animated.Text style={[styles.logo, { opacity: fadeAnim }]}>SunoBolo</Animated.Text>
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
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
    letterSpacing: 2,
  },
});
