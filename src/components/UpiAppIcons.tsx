import React from 'react';
import { Image } from 'react-native';
import Svg, { Circle, Rect, Path, G, Text as SvgText } from 'react-native-svg';

export interface UpiIconProps {
  size?: number;
}

/**
 * 1. Google Pay: Real official icon
 */
export function GooglePayIcon({ size = 44 }: UpiIconProps) {
  return (
    <Image
      source={require('../../assets/images/gpay.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

/**
 * 2. PhonePe: Real official icon
 */
export function PhonePeIcon({ size = 44 }: UpiIconProps) {
  return (
    <Image
      source={require('../../assets/images/phonepe.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

/**
 * 3. Paytm: Real official icon
 */
export function PaytmIcon({ size = 44 }: UpiIconProps) {
  return (
    <Image
      source={require('../../assets/images/paytm.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

/**
 * 4. CRED: Official black circle with white CRED crest + text (matches Image 2)
 */
export function CredIcon({ size = 44 }: UpiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="22" r="21.5" fill="#0A0A0A" />
      {/* CRED Monogram / Crest */}
      <G transform="translate(13, 9)">
        {/* Shield outline */}
        <Path
          d="M1 2C1 1.4 1.4 1 2 1H16C16.6 1 17 1.4 17 2V12C17 16.5 13.5 20.2 9 20.9C4.5 20.2 1 16.5 1 12V2Z"
          stroke="#FFFFFF"
          strokeWidth="1.6"
        />
        {/* Inner geometric key/face lines */}
        <Path
          d="M5 5H13V11C13 13.2 11.2 15 9 15C6.8 15 5 13.2 5 11V5Z"
          stroke="#FFFFFF"
          strokeWidth="1.4"
        />
        <Path d="M9 5V11" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
        <Circle cx="9" cy="12.5" r="0.9" fill="#FFFFFF" />
      </G>
      {/* "CRED" text underneath */}
      <G transform="translate(12.5, 33)">
        <SvgText
          x="9.5"
          y="0"
          fill="#FFFFFF"
          fontSize="5"
          fontWeight="900"
          letterSpacing="1"
          textAnchor="middle"
        >
          CRED
        </SvgText>
      </G>
    </Svg>
  );
}

/**
 * 5. BHIM: Dual-triangle teal & orange logo in circular badge
 */
export function BhimIcon({ size = 44 }: UpiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="22" r="21" fill="#008276" />
      <Path d="M15 11L29 22L15 33V11Z" fill="#F47920" opacity="0.95" />
      <Path d="M21 15L30 22L21 29V15Z" fill="#FFFFFF" />
    </Svg>
  );
}

/**
 * 6. Amazon Pay: Dark circular badge with orange smile arrow
 */
export function AmazonPayIcon({ size = 44 }: UpiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="22" r="21.5" fill="#131921" />
      <SvgText x="13" y="22" fill="#FFFFFF" fontSize="12" fontWeight="900">
        pay
      </SvgText>
      {/* Amazon smile arrow */}
      <Path
        d="M11 26.5C17 30 24 29.5 30 25.5"
        stroke="#FF9900"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path d="M28.5 24L32 25.5L30 28" stroke="#FF9900" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * 7. Generic UPI badge
 */
export function GenericUpiIcon({ size = 44 }: UpiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="22" r="21" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <Path d="M12 24L22 10L18 24H12Z" fill="#097939" />
      <Path d="M32 20L22 34L26 20H32Z" fill="#ED7524" />
    </Svg>
  );
}
