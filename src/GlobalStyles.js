// GlobalStyles.js

import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from './Color';
import {FontFamily} from './Typography';

export const globalStyles = StyleSheet.create({
  noDataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(18),
  },
  noDataText: {
    fontFamily: FontFamily.bold,
    fontSize: responsiveFontSize(2),
    color: Colors.Grey4F,
    textAlign: 'center',
    padding: 10,
    includeFontPadding: false,
  },
});

export * from './Typography';
