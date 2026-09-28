import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Colors from '../../Color';

const CardEschedule = () => {
  return (
    <View style={styles.MainContainer}>
      <Text style={{color: 'black'}}>Calendar</Text>
    </View>
  );
};

export default CardEschedule;
const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: Colors.RedDarkF,
    height: '15%',
  },
});
