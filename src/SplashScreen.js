import React, {useRef} from 'react';
import {View, Image, StyleSheet, Dimensions, Animated} from 'react-native';
import Colors from './Color';

const SplashScreen = () => {
  // Use useRef to create a reference to the Animated.Value
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  // Function to start the animation
  const startAnimation = () => {
    // Scale animation
    Animated.timing(scaleValue, {
      toValue: 1.5, // Scale up to 1.5 times the original size
      duration: 1000, // Animation duration in milliseconds
      useNativeDriver: true, // Enable native driver for better performance
    }).start();

    // Opacity animation
    Animated.timing(opacityValue, {
      toValue: 1, // Fade in from transparent to opaque
      duration: 1000, // Animation duration in milliseconds
      useNativeDriver: true, // Enable native driver for better performance
    }).start();
  };

  React.useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{transform: [{scale: scaleValue}], opacity: opacityValue}}>
        <Image
          source={require('../assets/splashScreen.jpeg')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.RedColorDark,
  },
  image: {
    width: Dimensions.get('window').width * 1.5, // Adjust the logo width
    height: Dimensions.get('window').width * 1.5, // Adjust the logo height
  },
});

export default SplashScreen;
