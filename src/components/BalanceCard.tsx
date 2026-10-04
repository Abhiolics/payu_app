import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Plus, ArrowDownToLine, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Wallet3DArt from './Wallet3DArt';

export default function BalanceCard() {
  const router = useRouter();
  const { wallet } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const { width: windowWidth } = useWindowDimensions();

  const isSmallScreen = windowWidth < 375;
  const isTinyScreen = windowWidth < 340;

  const balance = wallet?.balance ?? 0;
  const pendingBalance = wallet?.pendingBalance ?? 0;

  // Responsive art dimensions based on device width
  const artWidth = isTinyScreen ? 100 : isSmallScreen ? 118 : 142;
  const artHeight = isTinyScreen ? 82 : isSmallScreen ? 96 : 116;

  return (
    <LinearGradient
      colors={['#18124C', '#24176B', '#1C277E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cardContainer, isSmallScreen && styles.cardContainerSmall]}
    >
      {/* Top Section: Balance Info & 3D Artwork */}
      <View style={styles.topSection}>
        {/* Balance Info */}
        <View style={styles.balanceInfo}>
          {/* Label + Eye Toggle */}
          <TouchableOpacity
            style={styles.labelRow}
            activeOpacity={0.7}
            onPress={() => setShowBalance(!showBalance)}
          >
            <Text style={styles.availableLabel}>Available Balance</Text>
            {showBalance ? (
              <Eye size={15} color="rgba(255, 255, 255, 0.85)" strokeWidth={2} />
            ) : (
              <EyeOff size={15} color="rgba(255, 255, 255, 0.85)" strokeWidth={2} />
            )}
          </TouchableOpacity>

          {/* Amount: fully responsive with auto-scaling */}
          <Text
            style={[
              styles.balanceText,
              isSmallScreen && styles.balanceTextSmall,
              isTinyScreen && styles.balanceTextTiny,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {showBalance
              ? `₹ ${balance.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : '₹ ••••••'}
          </Text>

          {/* Optional Pending Balance Badge */}
          {showBalance && pendingBalance > 0 && (
            <View style={styles.pendingBadge}>
              <Clock size={11} color="#FDE047" strokeWidth={2.2} />
              <Text style={styles.pendingBadgeText} numberOfLines={1}>
                ₹ {pendingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} pending
              </Text>
            </View>
          )}
        </View>

        {/* 3D Wallet & Coins Illustration */}
        <View style={[styles.artWrapper, { width: artWidth, height: artHeight }]}>
          <Wallet3DArt width={artWidth} height={artHeight} />
        </View>
      </View>

      {/* Bottom Section: Action Buttons */}
      <View style={[styles.actionButtonsRow, isTinyScreen && { gap: 8 }]}>
        {/* Deposit Button */}
        <TouchableOpacity
          style={[styles.depositButton, isSmallScreen && styles.buttonSmall]}
          activeOpacity={0.85}
          onPress={() => router.push('/deposit')}
        >
          <View style={[styles.depositIconCircle, isSmallScreen && styles.iconCircleSmall]}>
            <Plus size={isSmallScreen ? 15 : 18} color="#FFFFFF" strokeWidth={3} />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text
              style={[styles.depositTitle, isSmallScreen && styles.buttonTitleSmall]}
              numberOfLines={1}
            >
              Deposit
            </Text>
            <Text
              style={[styles.depositSubtitle, isSmallScreen && styles.buttonSubtitleSmall]}
              numberOfLines={1}
            >
              Add Money
            </Text>
          </View>
        </TouchableOpacity>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[styles.withdrawButton, isSmallScreen && styles.buttonSmall]}
          activeOpacity={0.85}
          onPress={() => router.push('/withdraw')}
        >
          <View style={[styles.withdrawIconCircle, isSmallScreen && styles.iconCircleSmall]}>
            <ArrowDownToLine size={isSmallScreen ? 14 : 16} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text
              style={[styles.withdrawTitle, isSmallScreen && styles.buttonTitleSmall]}
              numberOfLines={1}
            >
              Withdraw
            </Text>
            <Text
              style={[styles.withdrawSubtitle, isSmallScreen && styles.buttonSubtitleSmall]}
              numberOfLines={1}
            >
              Send to Bank
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#18124C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  cardContainerSmall: {
    marginHorizontal: 12,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceInfo: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
    paddingRight: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  availableLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  balanceTextSmall: {
    fontSize: 25,
    marginBottom: 4,
  },
  balanceTextTiny: {
    fontSize: 22,
    marginBottom: 3,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(253, 224, 71, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(253, 224, 71, 0.3)',
  },
  pendingBadgeText: {
    color: '#FDE047',
    fontSize: 11,
    fontWeight: '600',
  },
  artWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -6,
    marginTop: -4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonSmall: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  depositIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconCircleSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 7,
  },
  buttonTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  depositTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 1,
  },
  buttonTitleSmall: {
    fontSize: 12.5,
  },
  depositSubtitle: {
    color: '#64748B',
    fontSize: 10.5,
    fontWeight: '500',
  },
  buttonSubtitleSmall: {
    fontSize: 9.5,
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  withdrawIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#3730A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  withdrawTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 1,
  },
  withdrawSubtitle: {
    color: '#C7D2FE',
    fontSize: 10.5,
    fontWeight: '500',
  },
});
