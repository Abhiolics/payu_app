import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';

export default function StatsCard() {
  return (
    <View style={styles.container}>
      {/* Total Deposit */}
      <View style={styles.statColumn}>
        <View style={styles.depositIconCircle}>
          <ArrowUp size={18} color="#7C3AED" strokeWidth={2.8} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.statLabel}>Total Deposit</Text>
          <Text style={styles.statValue}>₹ 0.00</Text>
        </View>
      </View>

      {/* Center Divider */}
      <View style={styles.verticalDivider} />

      {/* Total Withdrawal */}
      <View style={styles.statColumn}>
        <View style={styles.withdrawIconCircle}>
          <ArrowDown size={18} color="#EF4444" strokeWidth={2.8} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.statLabel}>Total Withdrawal</Text>
          <Text style={styles.statValue}>₹ 0.00</Text>
        </View>
      </View>
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
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  statColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  depositIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EDE9FE', // Soft purple
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  withdrawIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FEE2E2', // Soft pink/red
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  verticalDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 12,
  },
});
