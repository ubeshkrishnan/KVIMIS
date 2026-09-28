// GlobalStyles.js

import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Colors from './Color'; // Adjust the path as needed

export const globalStyles = StyleSheet.create({
  noDataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(18),
  },
  noDataText: {
    fontSize: responsiveFontSize(2),
    color: Colors.Grey4F,
    textAlign: 'center',
    fontWeight: '700',
    padding: 10,
  },
});
