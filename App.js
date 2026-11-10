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
  ActivityIndicator,
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
  isNetworkError,
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
  const [isRetrying, setIsRetrying] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState(null);
  const [storeUrlFromApi, setStoreUrlFromApi] = useState(null);

  const checkRestriction = useCallback(async () => {
    try {
      const response = await authenticatedFetch(Url + '/app_block_check', {
        timeout: 8000,
      });
      if (response && response.ok) {
        const data = await response.json();
        if (data && data[0]) {
          const restrictStatus = data[0].status;
          const expectedStatus = '0';
          if (restrictStatus !== expectedStatus) {
            setRestrictionMessage(data[0].value);
            setRestricted(true);
            setIsOffline(false);
            setModalUpdateVisible(true);
          }
        }
      }
    } catch (err) {
      if (isNetworkError(err)) {
        if (__DEV__) {
          console.log(
            '[Network] Restriction check: Network unavailable (offline).',
          );
        }
        setIsOffline(true);
        setModalUpdateVisible(true);
      } else {
        console.warn('Restriction check error:', err?.message || err);
      }
    }
  }, []);

  const checkAppVersion = useCallback(async () => {
    try {
      const response = await authenticatedFetch(Url + '/app_version_check', {
        timeout: 8000,
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
            setIsOffline(false);
            setModalUpdateVisible(true);
            return true;
          }
        }
      }
      return false;
    } catch (err) {
      if (isNetworkError(err)) {
        if (__DEV__) {
          console.log(
            '[Network] Version check: Network unavailable (offline).',
          );
        }
        setIsOffline(true);
        setModalUpdateVisible(true);
      } else {
        console.warn('Version check error:', err?.message || err);
      }
      return false;
    }
  }, []);

  const handleAppStateChange = useCallback(
    async nextAppState => {
      if (nextAppState === 'active' || nextAppState === 'background') {
        const isOnline = await checkInternetConnection();
        if (!isOnline) {
          if (__DEV__) {
            console.log('[Network] Device is offline. Showing offline notice.');
          }
          setIsOffline(true);
          setModalUpdateVisible(true);
          return;
        }

        setIsOffline(false);
        const updateRequired = await checkAppVersion();
        if (!updateRequired) {
          await checkRestriction();
        }
      }
    },
    [checkAppVersion, checkRestriction],
  );

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const isOnline = await checkInternetConnection();
      if (isOnline) {
        setIsOffline(false);
        setModalUpdateVisible(false);
        const updateRequired = await checkAppVersion();
        if (!updateRequired) {
          await checkRestriction();
        }
      } else {
        setIsOffline(true);
        setModalUpdateVisible(true);
      }
    } finally {
      setIsRetrying(false);
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
  }, [handleAppStateChange]);

  // Auto-monitor network:
  // 1. When OFFLINE: poll every 2.5s. As soon as connection returns, auto-close popup!
  // 2. When ONLINE: poll every 8s while active. If connection drops, auto-show popup!
  useEffect(() => {
    const intervalMs = isOffline ? 2500 : 8000;
    const intervalId = setInterval(async () => {
      if (AppState.currentState !== 'active') return;

      const isOnline = await checkInternetConnection();
      if (isOffline && isOnline) {
        if (__DEV__) {
          console.log(
            '[Network] Connection restored. Automatically closing offline popup.',
          );
        }
        setIsOffline(false);
        setModalUpdateVisible(false);
        const updateRequired = await checkAppVersion();
        if (!updateRequired) {
          await checkRestriction();
        }
      } else if (!isOffline && !isOnline) {
        if (__DEV__) {
          console.log(
            '[Network] Connection lost. Automatically showing offline popup.',
          );
        }
        setIsOffline(true);
        setModalUpdateVisible(true);
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [isOffline, checkAppVersion, checkRestriction]);

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
            <View style={styles.safeArea}>
              <MainContainer />
            </View>

            <Modal
              visible={modalUpdateVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => {
                if (restricted && Platform.OS === 'android') {
                  BackHandler.exitApp();
                }
                // Do not dismiss on back press when offline or update required
              }}
            >
              <View style={styles.overlay}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    {isOffline ? (
                      <>
                        <Text style={styles.alertLabel}>
                          📡 No Internet Connection
                        </Text>
                        <Text style={styles.modalText}>
                          Unable to connect to the server. Please check your internet connection.
                          {'\n\n'}
                          Reconnecting automatically once online...
                        </Text>
                        <View style={styles.modalButtonRow}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.primaryButton]}
                            disabled={isRetrying}
                            onPress={handleRetry}
                          >
                            {isRetrying ? (
                              <ActivityIndicator
                                size="small"
                                color={Colors.WhiteF}
                              />
                            ) : (
                              <Text style={styles.primaryButtonText}>
                                Retry Now
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : restricted ? (
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
  secondaryButton: {
    backgroundColor: Colors.Grey1F || '#F5F5F5',
    borderWidth: 1,
    borderColor: Colors.Grey2F || '#E0E0E0',
  },
  secondaryButtonText: {
    color: Colors.Grey4F || '#424242',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.8),
  },
  updateRequireLabel: {
    color: Colors.blackF,
    fontWeight: '800',
    fontSize: responsiveFontSize(2.3),
    marginBottom: 14,
  },
  alertLabel: {
    color: Colors.RedColorDark,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.3),
    marginBottom: 14,
  },
});
