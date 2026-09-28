import React from 'react';
import Svg, { Circle, Rect, Path, G, Text as SvgText } from 'react-native-svg';

export interface UpiIconProps {
  size?: number;
}

/**
 * 1. Google Pay: Official 4-color folded ribbon inside white circular badge (matches Image 2)
 */
export function GooglePayIcon({ size = 44 }: UpiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="22" r="21" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
      {/* 4-color interlocking Google ribbon */}
      <G transform="translate(11, 11) scale(0.916)">
        {/* Blue loop */}
        <Path
          d="M7 6C7 3.8 8.8 2 11 2H16C18.2 2 20 3.8 20 6V15C20 17.2 18.2 19 16 19"
          stroke="#4285F4"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Green loop */}
        <Path
          d="M17 18C17 20.2 15.2 22 13 22H8C5.8 22 4 20.2 4 18V9C4 6.8 5.8 5 8 5"
          stroke="#34A853"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Yellow fold */}
        <Path
          d="M4 14.5C4 16.7 5.8 18.5 8 18.5"
          stroke="#FBBC04"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Red fold */}
        <Path
          d="M20 9.5C20 7.3 18.2 5.5 16 5.5"
          stroke="#EA4335"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

/**
 * 2. PhonePe: Official purple circle with white 'पे' glyph (matches Image 2)
 */
export function PhonePeIcon({ size = 44 }: UpiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="22" r="21.5" fill="#5F259F" />
      <G transform="translate(8, 6.5) scale(0.68)">
        {/* Top diagonal matra */}
        <Path
          d="M17 7.5C20.5 4.5 24.5 3.2 28.5 2.5"
          stroke="#FFFFFF"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* Horizontal shirorekha */}
        <Rect x="8" y="7.8" width="24" height="3.6" rx="1.8" fill="#FFFFFF" />
        {/* Right vertical stem */}
        <Rect x="26" y="7.8" width="3.6" height="23" rx="1.8" fill="#FFFFFF" />
        {/* Curved loop of 'प' */}
        <Path
          d="M12 11.5V17C12 21.2 15.4 24.6 19.6 24.6H26"
          stroke="#FFFFFF"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* Tail stroke of 'पे' */}
        <Path
          d="M26 23.5L34 33"
          stroke="#FFFFFF"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

/**
 * 3. Paytm: Official white circle with 'paytm' wordmark (matches Image 2)
 */
export function PaytmIcon({ size = 44 }: UpiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="22" r="21" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
      {/* Official Paytm wordmark */}
      <G transform="translate(5, 14.5) scale(0.40, 0.40)">
        {/* 'p' */}
        <Path
          d="M0 0V26H5.2V16.8H8.8C13.8 16.8 17.5 13.4 17.5 8.4C17.5 3.4 13.8 0 8.8 0H0ZM5.2 4.4H8.6C11 4.4 12.4 5.9 12.4 8.4C12.4 10.9 11 12.4 8.6 12.4H5.2V4.4Z"
          fill="#002970"
        />
        {/* 'a' */}
        <Path
          d="M29 6.2C25.6 6.2 23.4 7.8 22.8 10.2H27.6C27.9 9.3 28.8 8.8 29.8 8.8C31 8.8 31.8 9.4 31.8 10.4V11.2L27.6 11.4C22.6 11.7 20 13.9 20 17.8C20 21.6 22.8 23.8 26.6 23.8C29.2 23.8 31.2 22.6 32 20.8V23.4H36.8V11.6C36.8 8 33.6 6.2 29 6.2ZM27.4 20C25.8 20 24.8 19.1 24.8 17.7C24.8 16.3 26 15.3 28 15.1L32 15V16.5C31.4 18.6 29.6 20 27.4 20Z"
          fill="#002970"
        />
        {/* 'y' */}
        <Path
          d="M44.5 6.6L39.8 18.8L37.8 13.8L39.2 10.2L38 7.2L42.8 7.2L45 12.6L47.2 7.2H52.4L44.8 23.4C43.4 26.4 41.6 27.8 38.6 27.8H36.4V24.2H38C39.4 24.2 40.2 23.6 41 21.8L44.5 6.6Z"
          fill="#002970"
        />
        {/* 't' */}
        <Path
          d="M56 2.2V6.6H53.6V10.2H56V19.4C56 22.2 57.6 23.6 60.4 23.6H63.2V19.8H61.2C60.2 19.8 59.8 19.2 59.8 18V10.2H63.2V6.6H59.8V2.2H56Z"
          fill="#00BAF2"
        />
        {/* 'm' */}
        <Path
          d="M65.2 6.6V23.4H69V13.8C69 11.6 70.2 10.4 72 10.4C73.8 10.4 74.8 11.6 74.8 13.8V23.4H78.6V13.8C78.6 11.6 79.8 10.4 81.6 10.4C83.4 10.4 84.4 11.6 84.4 13.8V23.4H88.2V13C88.2 9.2 86.2 7 83 7C81 7 79.6 7.8 78.4 9.4C77.4 7.8 76 7 74 7C72 7 70.4 8 69.4 9.8V6.6H65.2Z"
          fill="#00BAF2"
        />
      </G>
    </Svg>
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
