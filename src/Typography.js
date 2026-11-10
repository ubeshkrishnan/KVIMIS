// Typography.js
import { StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from './Color';

export const FontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const Typography = StyleSheet.create({
  // Screen headings: Poppins SemiBold (600)
  screenHeading: {
    fontFamily: FontFamily.semiBold,
    fontSize: responsiveFontSize(2.4), // ~20-22px
    color: Colors.TextPrimary || '#212121',
    includeFontPadding: false,
  },

  // Card titles: Poppins Medium (500)
  cardTitle: {
    fontFamily: FontFamily.medium,
    fontSize: responsiveFontSize(2.0), // ~16-18px
    color: Colors.TextPrimary || '#212121',
    includeFontPadding: false,
  },

  // Body text: Poppins Regular (400)
  body: {
    fontFamily: FontFamily.regular,
    fontSize: responsiveFontSize(1.75), // ~14px
    color: Colors.TextSecondary || '#424242',
    includeFontPadding: false,
  },

  // Button labels: Poppins SemiBold (600)
  buttonLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: responsiveFontSize(1.8), // ~14-16px
    color: Colors.WhiteF || '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
  },

  // Navigation labels: Poppins Medium (500)
  navigationLabel: {
    fontFamily: FontFamily.medium,
    fontSize: responsiveFontSize(1.5), // ~12-13px
    color: Colors.TextSecondary || '#757575',
    includeFontPadding: false,
  },

  // Highlighted text: Poppins Bold (700)
  highlightedText: {
    fontFamily: FontFamily.bold,
    fontSize: responsiveFontSize(1.8), // ~14-16px
    color: Colors.RedTheme || '#CE1141',
    includeFontPadding: false,
  },
});

export default Typography;

