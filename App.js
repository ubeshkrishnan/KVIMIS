import React, { useState, useEffect, useCallback } from 'react';
import {
  AppState,
  StyleSheet,
  View,
  StatusBar,
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
import {
  Url,
  ios_app_version,
  android_app_version,
} from './Global_Variable/api_link';
import {
  authenticatedFetch,
  checkInternetConnection,
} from './Global_Variable/api_helper';
import ErrorBoundary from './src/common/ErrorBoundary';
import Colors from './src/Color';
import {
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

export default function App() {
  LogBox.ignoreLogs([
    'Reanimated 2',
    'Error fetching restriction',
    'Network request failed',
    /ReactNativeFeatureFlags/,
    'VirtualizedLists should never be nested',
  ]);

  const [errorUpdate, setErrorUpdate] = useState(null);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState(null);
  const [storeUrlFromApi, setStoreUrlFromApi] = useState(null);

  const checkRestriction = useCallback(async () => {
    try {
      const response = await authenticatedFetch(Url + '/app_block_check', {
        timeout: 10000,
      });
      if (response && response.ok) {
        const data = await response.json();
        if (data && data[0]) {
          const restrictStatus = data[0].status;
          const expectedStatus = '0';
          if (restrictStatus !== expectedStatus) {
            setRestrictionMessage(data[0].value);
            setRestricted(true);
            setModalUpdateVisible(true);
          }
        }
      }
    } catch (err) {
      if (__DEV__) {
        console.log('[App] Restriction check bypassed:', err?.message || err);
      }
    }
  }, []);

  const checkAppVersion = useCallback(async () => {
    try {
      const response = await authenticatedFetch(Url + '/app_version_check', {
        timeout: 10000,
      });
      if (response && response.ok) {
        const data = await response.json();
        if (data && data[0]) {
          const item = data[0];

          if (item.app_url) {
            setStoreUrlFromApi(item.app_url);
          }

          const isIos = Platform.OS === 'ios';
          const serverVersion = isIos
            ? item.ios_app_version || item.app_version
            : item.app_version;

          const expectedAppVersion = isIos
            ? ios_app_version
            : android_app_version;

          if (serverVersion !== expectedAppVersion) {
            setErrorUpdate(
              'The app is outdated. Please update to the latest version to continue.',
            );
            setRestricted(false);
            setModalUpdateVisible(true);
            return true;
          }
        }
      }
      return false;
    } catch (err) {
      if (__DEV__) {
        console.log('[App] Version check bypassed:', err?.message || err);
      }
      return false;
    }
  }, []);

  const handleAppStateChange = useCallback(
    async nextAppState => {
      if (nextAppState === 'active' || nextAppState === 'background') {
        const isOnline = await checkInternetConnection();
        setIsOffline(!isOnline);

        if (isOnline) {
          const updateRequired = await checkAppVersion();
          if (!updateRequired) {
            await checkRestriction();
          }
        }
      }
    },
    [checkAppVersion, checkRestriction],
  );

  useEffect(() => {
    handleAppStateChange(AppState.currentState || 'active');
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [handleAppStateChange]);

  // Periodic network monitor: re-checks connection every 10 seconds while app is active
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (AppState.currentState !== 'active') return;

      const isOnline = await checkInternetConnection();
      setIsOffline(prev => {
        if (prev && isOnline) {
          // Came back online: execute pending maintenance checks
          checkAppVersion().then(updateRequired => {
            if (!updateRequired) {
              checkRestriction();
            }
          });
        }
        return !isOnline;
      });
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [checkAppVersion, checkRestriction]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <ErrorBoundary>
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

            {/* Non-blocking offline notification banner */}
            {isOffline && (
              <View style={styles.offlineBanner}>
                <Text style={styles.offlineBannerText}>
                  ⚠️ No internet connection. Reconnecting automatically...
                </Text>
              </View>
            )}

            <View style={styles.safeArea}>
              <MainContainer />
            </View>

            {/* Modal strictly for mandatory Admin Restrictions or App Updates */}
            <Modal
              visible={modalUpdateVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => {
                if (restricted && Platform.OS === 'android') {
                  BackHandler.exitApp();
                }
              }}
            >
              <View style={styles.overlay}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    {restricted ? (
                      <>
                        <Text style={styles.updateRequireLabel}>⚠️ Alert</Text>
                        <Text style={styles.modalText}>
                          {restrictionMessage}
                        </Text>
                        <View style={styles.modalButtonRow}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.primaryButton]}
                            onPress={handleUpdateApp}
                          >
                            <Text style={styles.primaryButtonText}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.alertLabel}>Update Required</Text>
                        <Text style={styles.modalText}>{errorUpdate}</Text>
                        <View style={styles.modalButtonRow}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.primaryButton]}
                            onPress={handleUpdateApp}
                          >
                            <Text style={styles.primaryButtonText}>
                              UPDATE NOW
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </DataProvider>
      )}
    </ErrorBoundary>
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
  offlineBanner: {
    backgroundColor: '#D32F2F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  offlineBannerText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    justifyContent: 'center',
    width: '90%',
    maxWidth: 400,
  },
  modalView: {
    backgroundColor: Colors.WhiteF,
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: responsiveWidth(70),
  },
  modalText: {
    marginBottom: 20,
    color: Colors.Grey4F,
    textAlign: 'center',
    fontSize: responsiveFontSize(1.9),
    lineHeight: 22,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.RedColorDark,
  },
  primaryButtonText: {
    color: Colors.WhiteF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  updateRequireLabel: {
    color: Colors.blackF,
    fontWeight: '800',
    fontSize: responsiveFontSize(2.3),
    marginBottom: 14,
  },
  alertLabel: {
    color: Colors.blackF,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.3),
    marginBottom: 14,
  },
});
