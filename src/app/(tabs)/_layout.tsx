import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

const AnimatedTabIcon = ({ name, focused, color, size }: { name: any, focused: boolean, color: any, size: number }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.1 : 1, { duration: 150 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={focused ? name : `${name}-outline`} size={size} color={color} />
    </Animated.View>
  );
};

const CenterAnimatedButton = ({ focused }: { focused: boolean }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.05 : 1, { duration: 150 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <Animated.View style={[styles.centerButtonWrapper, animatedStyle]}>
      <LinearGradient
        colors={['#00E5AE', '#00D09C', '#00A67D']}
        style={styles.centerButtonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="wallet" size={26} color="#050505" />
      </LinearGradient>
    </Animated.View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#00D09C',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarStyle: [
          styles.tabBar, 
          { bottom: (Platform.OS === 'ios' ? 20 : 15) + (Platform.OS === 'android' ? insets.bottom : 0) }
        ],
        tabBarBackground: () => (
          <View style={styles.blurContainer}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="home" focused={focused} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: 'Card',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="card" focused={focused} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ focused }) => <CenterAnimatedButton focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="bar-chart" focused={focused} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="person" focused={focused} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 25 : 15,
    left: 20,
    right: 20,
    elevation: 0,
    height: 65,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Low opacity for true glass effect
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // Subtle edge highlight for glass
    boxShadow: 'none',
  },
  blurContainer: {
    ...StyleSheet.absoluteFill,
    borderRadius: 32,
    overflow: 'hidden',
  },
  centerButtonWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginTop: -20, // Clean, subtle pop-out
  },
  centerButtonGradient: {
    flex: 1,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
