import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../Color';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) {
      console.warn('ErrorBoundary caught error:', error, errorInfo);
    }
    // In production, you can report this to Sentry, Crashlytics, etc.
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected error occurred. Please restart this section to continue.
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
              <Text style={styles.buttonText}>Restart App</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Grey1F || '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.WhiteF || '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: Colors.blackF || '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: responsiveFontSize(1.7),
    color: Colors.Grey4F || '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.RedColorDark || '#962A3A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    minWidth: responsiveWidth(40),
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.WhiteF || '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
});

export default ErrorBoundary;

