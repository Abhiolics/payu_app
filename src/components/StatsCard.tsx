import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

interface StatsCardProps {
  totalDeposit?: number;
  totalWithdrawal?: number;
  pendingDeposit?: number;
  pendingWithdrawal?: number;
}

export default function StatsCard({
  totalDeposit: totalDepositProp,
  totalWithdrawal: totalWithdrawalProp,
  pendingDeposit: pendingDepositProp,
  pendingWithdrawal: pendingWithdrawalProp,
}: StatsCardProps) {
  const router = useRouter();
  const { totals } = useAuth();
  const { width: windowWidth } = useWindowDimensions();

  const isSmallScreen = windowWidth < 375;

  const depositAmount = totalDepositProp ?? totals?.totalDeposit ?? 0;
  const withdrawalAmount = totalWithdrawalProp ?? totals?.totalWithdrawal ?? 0;
  const pendingDeposit = pendingDepositProp ?? totals?.pendingDeposit ?? 0;
  const pendingWithdrawal = pendingWithdrawalProp ?? totals?.pendingWithdrawal ?? 0;

  const formatAmount = (num: number) => {
    return `₹ ${Number(num || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <View style={[styles.container, isSmallScreen && styles.containerSmall]}>
      {/* Total Deposit Column */}
      <TouchableOpacity
        style={styles.statColumn}
        activeOpacity={0.75}
        onPress={() => router.push('/buy-orders')}
      >
        <View style={[styles.depositIconCircle, isSmallScreen && styles.iconCircleSmall]}>
          <ArrowUp size={isSmallScreen ? 15 : 18} color="#7C3AED" strokeWidth={2.8} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>Total Deposit</Text>
          <Text
            style={[styles.statValue, isSmallScreen && styles.statValueSmall]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
          >
            {formatAmount(depositAmount)}
          </Text>
          {pendingDeposit > 0 && (
            <View style={styles.pendingRow}>
              <Clock size={10} color="#D97706" strokeWidth={2.2} />
              <Text style={styles.pendingText} numberOfLines={1}>
                ₹{pendingDeposit.toLocaleString('en-IN')} pending
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Center Divider */}
      <View style={styles.verticalDivider} />

      {/* Total Withdrawal Column */}
      <TouchableOpacity
        style={styles.statColumn}
        activeOpacity={0.75}
        onPress={() => router.push('/(tabs)/wallet')}
      >
        <View style={[styles.withdrawIconCircle, isSmallScreen && styles.iconCircleSmall]}>
          <ArrowDown size={isSmallScreen ? 15 : 18} color="#EF4444" strokeWidth={2.8} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>Total Withdrawal</Text>
          <Text
            style={[styles.statValue, isSmallScreen && styles.statValueSmall]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
          >
            {formatAmount(withdrawalAmount)}
          </Text>
          {pendingWithdrawal > 0 && (
            <View style={styles.pendingRow}>
              <Clock size={10} color="#EF4444" strokeWidth={2.2} />
              <Text style={styles.pendingText} numberOfLines={1}>
                ₹{pendingWithdrawal.toLocaleString('en-IN')} pending
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  containerSmall: {
    marginHorizontal: 12,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  statColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  depositIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE', // Soft purple
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
  withdrawIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2', // Soft red/pink
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
  iconCircleSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 7,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  statLabelSmall: {
    fontSize: 11,
  },
  statValue: {
    color: '#0F172A',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statValueSmall: {
    fontSize: 13.5,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  pendingText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 10,
  },
});
