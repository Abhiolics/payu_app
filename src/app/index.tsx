import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const DARK_BG = '#050505';
const MINT_GRADIENT = ['#00E5AE', '#00D09C', '#00A67D'] as const;

export default function AppSplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

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
    const duration = 1500; // 1.5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        // Smooth exit transition
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }).start(() => {
            router.replace('/login');
          });
        }, 300);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Sleek Minimalist Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoInner}>
            <Text style={styles.logoLetter}>P</Text>
          </View>
        </View>

        {/* App Title & Subtitle */}
        <Text style={styles.appName}>PayU</Text>
        <Text style={styles.appTagline}>
          Fast, Secure Payments
        </Text>

        {/* Minimal Progress Bar (Slider only) */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={MINT_GRADIENT}
              style={[styles.progressFill, { width: `${progress}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      </Animated.View>

      {/* Footer Security Badge */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <View style={styles.securityRow}>
       
        </View>
        <Text style={styles.versionText}>v1.1.8 (Build 2026)</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
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
  },
  logoInner: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: '#050505',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 11,
    color: '#8B93A5',
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 16,
    maxWidth: 280,
  },
  progressSection: {
    width: '100%',
    paddingHorizontal: 16,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    color: '#888894',
    fontWeight: '500',
  },
  percentText: {
    fontSize: 11,
    color: '#00D09C',
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 44 : 24,
    alignItems: 'center',
    gap: 4,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerSecurity: {
    fontSize: 11,
    color: '#888894',
    fontWeight: '500',
  },
  versionText: {
    fontSize: 10,
    color: '#4B4958',
  },
});
