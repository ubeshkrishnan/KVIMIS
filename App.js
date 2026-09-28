
import React, { useState, useEffect } from 'react';
import {
  AppState,
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Text,
  Linking,
  BackHandler,
  LogBox,
  Platform,
} from 'react-native';
import MainContainer from './src/navigator/MainNavigator';
import SplashScreen from './src/SplashScreen';
import { DataProvider } from './src/context/DataContext';
import axios from 'axios';
import { Url, ios_app_version, android_app_version } from './Global_Variable/api_link';
import { getSecurityHeaders } from './Global_Variable/api_helper';
import Colors from './src/Color';
import {
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

export default function App() {
  LogBox.ignoreLogs(['Reanimated 2']);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [error, setError] = useState(null);
  const [appLoaded, setAppLoaded] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState(null);
  const [storeUrlFromApi, setStoreUrlFromApi] = useState(null);

  const checkRestriction = async () => {
    try {
      const restrict = await axios.get(Url + '/app_block_check', {
        headers: getSecurityHeaders(),
      });
      const restrictStatus = restrict.data[0].status;
      const expectedStatus = '0';
      if (restrictStatus !== expectedStatus) {
        setRestrictionMessage(restrict.data[0].value);
        setRestricted(true);
        setModalUpdateVisible(true);
      }
    } catch (err) {
      console.error('Error fetching restriction:', err);
      setError('No Internet\n\n Check Your Internet Connection !');
    }
  };

  useEffect(() => {
    handleAppStateChange(AppState.currentState || 'active');
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active' || nextAppState === 'background') {
      const updateRequired = await checkAppVersion();
      if (!updateRequired) {
        await checkRestriction();
      }
    }
  };

  const handleUpdateApp = () => {
    if (restricted) {
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
      } else {
        setModalUpdateVisible(false);
      }
      return;
    }

    const storeUrl =
      Platform.OS === 'ios' && storeUrlFromApi
        ? storeUrlFromApi
        : Platform.OS === 'ios'
          ? 'https://apps.apple.com/ca/app/kvim/id6754169409'
          : 'https://play.google.com/store/apps/details?id=com.kvim.app';

    Linking.openURL(storeUrl).catch(() => {
      // Fallback
    });
  };

  const checkAppVersion = async () => {
    try {
      const appVersionResponse = await axios.get(Url + '/app_version_check', {
        headers: getSecurityHeaders(),
      });
      
      if (appVersionResponse.data && appVersionResponse.data[0]) {
        const item = appVersionResponse.data[0];

        if (item.app_url) {
          setStoreUrlFromApi(item.app_url);
        }

        const isIos = Platform.OS === 'ios';
        const serverVersion = isIos
          ? item.ios_app_version || item.app_version
          : item.app_version;

        const expectedAppVersion = isIos ? ios_app_version : android_app_version;

        if (serverVersion !== expectedAppVersion) {
          setErrorUpdate(
            'The app is outdated. Please update to the latest version to continue.',
          );
          setRestricted(false);
          setModalUpdateVisible(true);
          return true;
        }
      }
      return false;
    } catch (err) {
      setError('No Internet\n\n Check Your Internet Connection !');
      return false;
    }
  };

  return (
    <>
      {!appLoaded ? (
        <SplashScreen />
      ) : (
        <DataProvider>
          <View style={styles.container}>
            {/* @ts-ignore: React Native StatusBar types sometimes incorrectly reject Android-specific props */}
            <StatusBar
              backgroundColor={Colors.RedColorDark}
              barStyle="light-content"
              translucent={true}
              animated={true}
            />
            <View style={styles.safeArea}>
              <MainContainer />
            </View>
            <Modal visible={modalUpdateVisible} transparent={true}>
              <View style={styles.overlay}>
                <TouchableOpacity
                  style={styles.overlay}
                  activeOpacity={1}
                  onPress={() => {
                    setModalUpdateVisible(false);
                    BackHandler.exitApp();
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      {restricted ? (
                        <Text style={styles.updateRequireLabel}>⚠️ Alert</Text>
                      ) : (
                        <Text style={styles.alertLabel}>Update Required</Text>
                      )}
                      <Text style={styles.modalText}>
                        {restricted ? restrictionMessage : errorUpdate}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          style={styles.updateButton}
                          onPress={handleUpdateApp}>
                          <Text style={styles.updateButtonText}>
                            {restricted ? 'Close' : 'UPDATE NOW'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </DataProvider>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.RedColorDark,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.Grey1F,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    justifyContent: 'center',
    width: '95%',
    padding: 20,
  },
  modalView: {
    backgroundColor: Colors.WhiteF,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    minWidth: responsiveWidth(60),
  },
  modalText: {
    marginBottom: 20,
    color: Colors.Grey4F,
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
  },
  updateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  updateButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  updateButtonText: {
    color: Colors.RedColorDark,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  updateRequireLabel: {
    color: Colors.blackF,
    fontWeight: '800',
    fontSize: responsiveFontSize(2.3),
    padding: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  alertLabel: {
    color: Colors.blackF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.5),
    padding: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
