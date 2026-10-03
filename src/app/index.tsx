import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Platform,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { AlertTriangle, DownloadCloud, RefreshCw } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const LIGHT_BG = '#F4F6FC';
const PURPLE_GRADIENT = ['#8B5CF6', '#7C3AED', '#6D28D9'] as const;

export default function AppSplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, appSettings, checkAppSettings } = useAuth();
  const [progress, setProgress] = useState(0);

  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Dynamic progress ticker
    const startTime = Date.now();
    const duration = 1400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Handle navigation once progress is complete and auth status is determined
  useEffect(() => {
    if (progress < 100 || isLoading) return;

    // Check system maintenance
    if (appSettings?.maintenanceMode) {
      setShowMaintenanceModal(true);
      return;
    }

    // Check force update
    if (appSettings?.forceUpdate) {
      setShowUpdateModal(true);
      return;
    }

    // Smooth exit transition
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [progress, isLoading, appSettings, isAuthenticated, router, fadeAnim]);

  const handleRetrySettings = async () => {
    const updated = await checkAppSettings();
    if (updated && !updated.maintenanceMode && !updated.forceUpdate) {
      setShowMaintenanceModal(false);
      setShowUpdateModal(false);
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* GDPay Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* App Title & Subtitle */}
        <Text style={styles.appName}>GDPay</Text>
        <Text style={styles.appTagline}>Fast, Secure Payments</Text>

        {/* Minimal Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={PURPLE_GRADIENT}
              style={[styles.progressFill, { width: `${progress}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      </Animated.View>

      {/* Footer Security Badge */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.versionText}>
          v{appSettings?.currentVersion || '1.0.0'} (GDPay Production)
        </Text>
      </Animated.View>

      {/* Maintenance Mode Modal */}
      <Modal visible={showMaintenanceModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <AlertTriangle size={36} color="#D97706" />
            </View>
            <Text style={styles.modalTitle}>System Maintenance</Text>
            <Text style={styles.modalDesc}>
              {appSettings?.maintenanceMessage ||
                'App is under scheduled maintenance. Please check back later.'}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.8}
              onPress={handleRetrySettings}
            >
              <RefreshCw size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.modalButtonText}>Check Status Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Force Update Modal */}
      <Modal visible={showUpdateModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconWrap, { backgroundColor: '#EDE9FE' }]}>
              <DownloadCloud size={36} color="#7C3AED" />
            </View>
            <Text style={styles.modalTitle}>Update Required</Text>
            <Text style={styles.modalDesc}>
              {appSettings?.updateMessage ||
                'A newer version of the app is available. Please update to continue.'}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.8}
              onPress={handleRetrySettings}
            >
              <Text style={styles.modalButtonText}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#0247FE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: 22,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 2,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 18,
    maxWidth: 280,
  },
  progressSection: {
    width: '100%',
    paddingHorizontal: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 44 : 24,
    alignItems: 'center',
    gap: 4,
  },
  versionText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
