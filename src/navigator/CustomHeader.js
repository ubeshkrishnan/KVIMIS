import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import PmcHeader from '../../assets/Kvim-logo.png';
import Colors from '../Color';

const CustomHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Image source={PmcHeader} style={styles.logo} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.headerText}>KV Institute of Management &</Text>
        <Text style={styles.headerText2}>Information Studies</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  logo: {
    width: 38,
    height: 38,
    position: 'absolute',
    left: 0,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.RedColorDark,
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerText2: {
    color: Colors.RedColorDark,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CustomHeader;
