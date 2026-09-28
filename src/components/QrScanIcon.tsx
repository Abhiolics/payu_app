import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export default function QrScanIcon({ size = 26, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Corner Brackets / Viewfinder */}
      {/* Top Left */}
      <Path
        d="M 3 8 L 3 5 C 3 3.89 3.89 3 5 3 L 8 3"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Top Right */}
      <Path
        d="M 16 3 L 19 3 C 20.11 3 21 3.89 21 5 L 21 8"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Bottom Left */}
      <Path
        d="M 3 16 L 3 19 C 3 20.11 3.89 21 5 21 L 8 21"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Bottom Right */}
      <Path
        d="M 16 21 L 19 21 C 20.11 21 21 20.11 21 19 L 21 16"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* QR Code Dots / Blocks */}
      <Rect x="7" y="7" width="3" height="3" rx="0.5" fill={color} />
      <Rect x="14" y="7" width="3" height="3" rx="0.5" fill={color} />
      <Rect x="7" y="14" width="3" height="3" rx="0.5" fill={color} />
      <Rect x="14" y="14" width="3" height="3" rx="0.5" fill={color} />
      {/* Center scan line / dot */}
      <Rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill={color} />
    </Svg>
  );
}
