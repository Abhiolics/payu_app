import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  Sparkles,
  Users,
  User,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import QrScanIcon from '../../components/QrScanIcon';

interface TabItemProps {
  label: string;
  focused: boolean;
  IconComponent: React.ComponentType<any>;
}

const TabItem = ({ label, focused, IconComponent }: TabItemProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.05 : 1, {
      damping: 14,
      stiffness: 180,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const activeColor = '#7C3AED'; // Vibrant violet-purple
  const inactiveColor = '#94A3B8'; // Slate 400

  return (
    <Animated.View style={[styles.tabItemContainer, animatedStyle]}>
      <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>
        <IconComponent
          size={20}
          color={focused ? activeColor : inactiveColor}
          strokeWidth={focused ? 2.4 : 1.8}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: focused ? activeColor : inactiveColor, fontWeight: focused ? '700' : '500' },
          ]}
        >
          {label}
        </Text>
      </View>
      {focused && <View style={styles.activeDot} />}
    </Animated.View>
  );
};

const CenterScanButton = ({ focused }: { focused: boolean }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.08 : 1, {
      damping: 12,
      stiffness: 160,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.centerWrapper, animatedStyle]}>
      {/* Outer Glow Halo */}
      <View style={styles.outerHalo}>
        {/* Core Gradient Orb */}
        <LinearGradient
          colors={['#9061F9', '#7C3AED', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerButtonOrb}
        >
          <QrScanIcon size={23} color="#FFFFFF" />
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomMargin = Math.max(insets.bottom, Platform.OS === 'android' ? 14 : 10) + 6;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: bottomMargin,
          },
        ],
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabItem label="Home" focused={focused} IconComponent={Home} />
          ),
        }}
      />

      {/* 2. Plans Tab */}
      <Tabs.Screen
        name="card"
        options={{
          title: 'Plans',
          tabBarIcon: ({ focused }) => (
            <TabItem label="Plans" focused={focused} IconComponent={Sparkles} />
          ),
        }}
      />

      {/* 3. Center QR / Scan Button */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => <CenterScanButton focused={focused} />,
        }}
      />

      {/* 4. Teams Tab */}
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Teams',
          tabBarIcon: ({ focused }) => (
            <TabItem label="Teams" focused={focused} IconComponent={Users} />
          ),
        }}
      />

      {/* 5. My / Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My',
          tabBarIcon: ({ focused }) => (
            <TabItem label="My" focused={focused} IconComponent={User} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: 'rgba(241, 245, 249, 0.95)',
    marginHorizontal: 16,
    height: 68,
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 62,
    height: '100%',
  },
  iconCapsule: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  iconCapsuleActive: {
    backgroundColor: '#F3E8FF',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7C3AED',
    marginTop: 1,
  },

  // Floating Center Scan Orb
  centerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  outerHalo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.42,
    shadowRadius: 16,
    elevation: 10,
  },
  centerButtonOrb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
  },
});
