import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
} from 'react-native-svg';

export default function EmptyTransactionsArt() {
  return (
    <View style={styles.container}>
      <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <Defs>
          {/* Document Gradient */}
          <LinearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E2E8F0" />
            <Stop offset="100%" stopColor="#CBD5E1" />
          </LinearGradient>
          {/* Clock Gradient */}
          <LinearGradient id="clockGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>
        </Defs>

        {/* Shadow base */}
        <Rect
          x="18"
          y="12"
          width="44"
          height="54"
          rx="8"
          fill="#94A3B8"
          opacity={0.3}
        />

        {/* Document Sheet */}
        <Rect
          x="16"
          y="10"
          width="44"
          height="54"
          rx="8"
          fill="url(#docGrad)"
        />

        {/* Document Text Placeholder Lines */}
        <Rect
          x="23"
          y="20"
          width="24"
          height="4.5"
          rx="2.25"
          fill="#FFFFFF"
          opacity={0.9}
        />
        <Rect
          x="23"
          y="29"
          width="30"
          height="4.5"
          rx="2.25"
          fill="#FFFFFF"
          opacity={0.9}
        />
        <Rect
          x="23"
          y="38"
          width="20"
          height="4.5"
          rx="2.25"
          fill="#FFFFFF"
          opacity={0.9}
        />

        {/* Circular Blue Clock Badge attached at bottom right */}
        <G transform="translate(48, 50)">
          {/* Clock Outer Shadow Rim */}
          <Circle cx="0" cy="0" r="13" fill="#1E40AF" opacity={0.25} />
          {/* Clock Body */}
          <Circle cx="0" cy="0" r="12" fill="url(#clockGrad)" />
          {/* Clock Center Dot */}
          <Circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
          {/* Clock Hands pointing at 3:00 / 9:00 */}
          <Path
            d="M 0 -6 L 0 0 L 5 0"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
