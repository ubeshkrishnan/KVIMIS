import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { Url } from '../../../Global_Variable/api_link';
import { getSecurityHeaders } from '../../../Global_Variable/api_helper';
import Colors from '../../Color';
import KvimLogo from '../../../assets/Kvim-logo.png';
import KvimLogoText from '../../../assets/Kvim-logo-text.png';
import KvimLogoIcon from '../../../assets/logo-icon.png';
import { DataContext } from '../../context/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const passwordInputRef = useRef(null);
  const { setUserLoginData } = useContext(DataContext);

  // Get screen dimensions for responsive design
  const { height } = Dimensions.get('window');
  const isSmallScreen = height < 700;
  const isLargeScreen = height >= 850;

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedPassword = await AsyncStorage.getItem('password');
      const savedRememberMe = await AsyncStorage.getItem('rememberMe');

      if (savedRememberMe === 'true' && savedUsername && savedPassword) {
        setUsername(savedUsername);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const saveCredentials = async () => {
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      await AsyncStorage.setItem('rememberMe', rememberMe.toString());
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const clearCredentials = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      await AsyncStorage.removeItem('rememberMe');
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      if (!trimmedUsername) {
        setUsernameError('Username is required');
        return;
      }

      if (!trimmedPassword) {
        setPasswordError('Password is required');
        return;
      }

      setUsernameError(null);
      setPasswordError(null);
      setIsLoading(true);

      const response = await axios.post(
        Url + '/index',
        { username: trimmedUsername, password: trimmedPassword },
        {
          headers: {
            ...getSecurityHeaders(),
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        const userData = response.data;
        setUserLoginData(userData);
        navigation.navigate('Home');
        if (rememberMe) {
          saveCredentials();
        } else {
          clearCredentials();
        }
      } else {
        setUsernameError('Incorrect username or password');
      }
    } catch (error) {
      if (error.response) {
        setPasswordError('Check username and password');
      } else {
        setPasswordError('No Internet\nCheck your internet connection!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={styles.mainContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <View style={styles.topSection}>
              <View
                style={[
                  styles.logoWrapper,
                  isSmallScreen && styles.logoWrapperSmall,
                  isLargeScreen && styles.logoWrapperLarge,
                ]}>
                <Image
                  source={KvimLogo}
                  style={[
                    styles.logo,
                    isSmallScreen && styles.logoSmall,
                    isLargeScreen && styles.logoLarge,
                  ]}
                  resizeMode="contain"
                />
                <Image
                  source={KvimLogoText}
                  style={[
                    styles.logoText,
                    isSmallScreen && styles.logoTextSmall,
                    isLargeScreen && styles.logoTextLarge,
                  ]}
                  resizeMode="contain"
                />
              </View>
              <View
                style={[
                  styles.formContainer,
                  styles.shadowProp,
                  isSmallScreen && styles.formContainerSmall,
                  isLargeScreen && styles.formContainerLarge,
                ]}>
                <View style={styles.formHeader}>
                  <Text
                    style={[
                      styles.heading,
                      isSmallScreen && styles.headingSmall,
                      isLargeScreen && styles.headingLarge,
                    ]}>
                    Welcome!
                  </Text>
                  <Text
                    style={[
                      styles.loginDetails,
                      isSmallScreen && styles.loginDetailsSmall,
                      isLargeScreen && styles.loginDetailsLarge,
                    ]}>
                    Login to your account
                  </Text>
                </View>

                <View
                  style={[
                    styles.inputContainer,
                    isSmallScreen && styles.inputContainerSmall,
                    isLargeScreen && styles.inputContainerLarge,
                  ]}>
                  <Icon
                    name="user"
                    size={responsiveFontSize(2.2)}
                    color={Colors.RedColorDark}
                    style={styles.icon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      isSmallScreen && styles.inputSmall,
                      isLargeScreen && styles.inputLarge,
                    ]}
                    placeholder="Enter Email Id"
                    onChangeText={text => setUsername(text)}
                    value={username}
                    placeholderTextColor={Colors.Grey3F}
                    onSubmitEditing={() => passwordInputRef.current.focus()}
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {usernameError && (
                  <Text
                    style={[
                      styles.errorText,
                      isSmallScreen && styles.errorTextSmall,
                    ]}>
                    {usernameError}
                  </Text>
                )}
                <View
                  style={[
                    styles.inputContainer,
                    isSmallScreen && styles.inputContainerSmall,
                    isLargeScreen && styles.inputContainerLarge,
                  ]}>
                  <Icon
                    name="lock"
                    size={responsiveFontSize(2.2)}
                    color={Colors.RedColorDark}
                    style={styles.icon}
                  />
                  <TextInput
                    ref={passwordInputRef}
                    style={[
                      styles.input,
                      isSmallScreen && styles.inputSmall,
                      isLargeScreen && styles.inputLarge,
                    ]}
                    placeholder="Enter Password"
                    secureTextEntry={!showPassword}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    placeholderTextColor={Colors.Grey3F}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={toggleShowPassword}
                    style={styles.visibilityButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon
                      name={showPassword ? 'eye' : 'eye-slash'}
                      size={responsiveFontSize(2.2)}
                      color={Colors.Grey3F}
                      style={styles.visibilityIcon}
                    />
                  </TouchableOpacity>
                </View>
                {passwordError && (
                  <Text
                    style={[
                      styles.errorText,
                      isSmallScreen && styles.errorTextSmall,
                    ]}>
                    {passwordError}
                  </Text>
                )}
                <View
                  style={[
                    styles.checkboxContainer,
                    isSmallScreen && styles.checkboxContainerSmall,
                  ]}>
                  <Checkbox.Android
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(!rememberMe)}
                    color={Colors.RedColorDark}
                  />
                  <Text
                    style={[
                      styles.rememberMeText,
                      isSmallScreen && styles.rememberMeTextSmall,
                    ]}>
                    Remember Me
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isLoading && styles.disabledButton,
                    isSmallScreen && styles.loginButtonSmall,
                    isLargeScreen && styles.loginButtonLarge,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}>
                  {isLoading ? (
                    <ActivityIndicator
                      color={Colors.WhiteColor}
                      size={responsiveFontSize(2.5)}
                    />
                  ) : (
                    <View
                      style={[
                        styles.loginButtonCard,
                        isSmallScreen && styles.loginButtonCardSmall,
                        isLargeScreen && styles.loginButtonCardLarge,
                      ]}>
                      <Text
                        style={[
                          styles.loginButtonText,
                          isSmallScreen && styles.loginButtonTextSmall,
                          isLargeScreen && styles.loginButtonTextLarge,
                        ]}>
                        Login
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <View style={styles.poweredByContainer}>
            <View style={styles.poweredByContent}>
              <Text
                style={[
                  styles.poweredBy,
                  isSmallScreen && styles.poweredBySmall,
                ]}>
                Powered by{' '}
              </Text>
              <Image source={KvimLogoIcon} style={styles.poweredByIcon} />
              <Text
                style={[
                  styles.fontBold,
                  isSmallScreen && styles.poweredBySmall,
                ]}>
                {' '}Enova Solutions
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container styles
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.RedDarkF,
  },
  container: {
    backgroundColor: Colors.GreyBg,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.GreyBg,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topSection: {
    width: '100%',
  },

  // Logo section styles
  logoWrapper: {
    backgroundColor: Colors.RedDarkF,
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(12),
    paddingHorizontal: responsiveWidth(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapperSmall: {
    paddingTop: responsiveHeight(4),
    paddingBottom: responsiveHeight(9),
  },
  logoWrapperLarge: {
    paddingTop: responsiveHeight(6),
    paddingBottom: responsiveHeight(14),
  },
  logo: {
    height: responsiveHeight(12),
    width: responsiveWidth(20),
    marginBottom: responsiveHeight(1),
  },
  logoSmall: {
    height: responsiveHeight(10),
    width: responsiveWidth(18),
  },
  logoLarge: {
    height: responsiveHeight(14),
    width: responsiveWidth(22),
  },
  logoText: {
    height: responsiveHeight(8),
    width: responsiveWidth(75),
  },
  logoTextSmall: {
    height: responsiveHeight(6),
    width: responsiveWidth(65),
  },
  logoTextLarge: {
    height: responsiveHeight(10),
    width: responsiveWidth(80),
  },

  // Form container styles
  formContainer: {
    backgroundColor: Colors.WhiteColor,
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(-9),
    borderRadius: responsiveWidth(6),
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(4),
    marginBottom: responsiveHeight(2.5),
  },
  formContainerSmall: {
    marginTop: responsiveHeight(-8),
    paddingVertical: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  formContainerLarge: {
    marginTop: responsiveHeight(-11),
    paddingVertical: responsiveHeight(5),
    marginBottom: responsiveHeight(3),
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },

  // Typography styles
  heading: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '700',
    color: Colors.TextPrimary || '#212121',
    marginBottom: responsiveHeight(0.5),
    textAlign: 'center',
  },
  headingSmall: {
    fontSize: responsiveFontSize(2.5),
  },
  headingLarge: {
    fontSize: responsiveFontSize(3.2),
  },
  loginDetails: {
    color: Colors.TextSecondary || '#757575',
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
    fontWeight: '400',
  },
  loginDetailsSmall: {
    fontSize: responsiveFontSize(1.6),
  },
  loginDetailsLarge: {
    fontSize: responsiveFontSize(2),
  },

  // Input styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WhiteColor,
    borderRadius: responsiveWidth(3.5),
    borderWidth: 1,
    borderColor: Colors.borderF || '#E0E0E0',
    height: responsiveHeight(6.2),
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(1.8),
    shadowColor: Colors.Grey2F,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerSmall: {
    height: responsiveHeight(5.8),
    paddingHorizontal: responsiveWidth(3.5),
    marginBottom: responsiveHeight(1.4),
  },
  inputContainerLarge: {
    height: responsiveHeight(6.8),
    paddingHorizontal: responsiveWidth(4.5),
    marginBottom: responsiveHeight(2.2),
  },
  icon: {
    marginRight: responsiveWidth(3),
    opacity: 0.85,
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    color: Colors.TextPrimary || '#212121',
    fontWeight: '400',
  },
  inputSmall: {
    fontSize: responsiveFontSize(1.6),
  },
  inputLarge: {
    fontSize: responsiveFontSize(2),
  },
  visibilityButton: {
    padding: responsiveWidth(1),
    marginLeft: responsiveWidth(2),
  },
  visibilityIcon: {
    opacity: 0.6,
  },

  // Error text styles
  errorText: {
    color: Colors.RedLightF || '#FB3550',
    fontSize: responsiveFontSize(1.4),
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(-0.5),
  },
  errorTextSmall: {
    fontSize: responsiveFontSize(1.2),
  },

  // Checkbox styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(1),
  },
  checkboxContainerSmall: {
    marginBottom: responsiveHeight(2),
  },
  rememberMeText: {
    marginLeft: responsiveWidth(2),
    color: Colors.TextPrimary || '#212121',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
  },
  rememberMeTextSmall: {
    fontSize: responsiveFontSize(1.4),
  },

  // Button styles
  loginButton: {
    marginTop: responsiveHeight(0.5),
    alignItems: 'stretch',
    width: '100%',
  },
  loginButtonSmall: {
    marginTop: responsiveHeight(0.5),
  },
  loginButtonLarge: {
    marginTop: responsiveHeight(1),
  },
  loginButtonCard: {
    backgroundColor: Colors.RedColorDark,
    borderRadius: responsiveWidth(3.5),
    paddingVertical: responsiveHeight(1.6),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.RedColorDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonCardSmall: {
    paddingVertical: responsiveHeight(1.4),
  },
  loginButtonCardLarge: {
    paddingVertical: responsiveHeight(1.8),
  },
  loginButtonText: {
    color: Colors.WhiteColor,
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
    textAlign: 'center',
  },
  loginButtonTextSmall: {
    fontSize: responsiveFontSize(1.7),
  },
  loginButtonTextLarge: {
    fontSize: responsiveFontSize(2.1),
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Powered by section
  poweredByContainer: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
    backgroundColor: Colors.GreyBg,
  },
  poweredByContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredBy: {
    color: Colors.Grey3F || '#9E9E9E',
    fontSize: responsiveFontSize(1.4),
    textAlign: 'center',
    fontWeight: '400',
  },
  poweredBySmall: {
    fontSize: responsiveFontSize(1.2),
  },
  poweredByIcon: {
    width: responsiveWidth(4),
    height: responsiveHeight(2),
    resizeMode: 'contain',
    marginHorizontal: responsiveWidth(1.5),
  },
  fontBold: {
    fontWeight: '700',
    color: Colors.Grey3F || '#9E9E9E',
  },

  // Shadow styles
  shadowProp: {
    shadowColor: Colors.BlackColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default Login;
