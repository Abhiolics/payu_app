import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Wallet, 
  ArrowRightLeft, 
  ArrowDownToLine, 
  Receipt, 
  Clock, 
  ListOrdered, 
  Percent, 
  TrendingUp 
} from 'lucide-react-native';

const DARK_BG = '#050505';
const CARD_BG = '#111111';
const CARD_BG_LIGHT = 'rgba(255,255,255,0.03)';
const TEXT_MUTED = '#8B93A5';
const MINT = '#00D09C';

export default function StatsScreen() {
  const currentDate = new Date().toLocaleDateString('en-GB'); // gets dd/mm/yyyy

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Statistics</Text>

        {/* Statistics Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>Statistics <Text style={styles.dateText}>({currentDate})</Text></Text>
          </View>
          
          <View style={styles.grid}>
            <StatCard 
              icon={<Wallet size={20} color={MINT} />} 
              label="Balance" 
              value="₹ 77.00" 
            />
            <StatCard 
              icon={<ArrowRightLeft size={20} color={MINT} />} 
              label="Sell" 
              value="₹ 0.00" 
            />
            <StatCard 
              icon={<ArrowDownToLine size={20} color={MINT} />} 
              label="Deposit" 
              value="₹ 0.00" 
            />
            <StatCard 
              icon={<Receipt size={20} color={MINT} />} 
              label="Commission" 
              value="₹ 0.00" 
            />
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>Payment</Text>
          </View>

          <View style={styles.exchangeRateBanner}>
            <Text style={styles.exchangeRateText}>Real Time Exchange Rates(INR/USDT)</Text>
            <Text style={styles.exchangeRateValue}>110</Text>
          </View>

          <View style={styles.grid}>
            <StatCard 
              icon={<Clock size={16} color={MINT} />} 
              label="In Process Amount" 
              value="₹ 0.00" 
              smallIcon
            />
            <StatCard 
              icon={<ListOrdered size={16} color={MINT} />} 
              label="In Process Orders" 
              value="0" 
              smallIcon
            />
            <StatCard 
              icon={<Percent size={16} color={MINT} />} 
              label="Commission Rate" 
              value="3.00 %" 
              smallIcon
            />
            <StatCard 
              icon={<TrendingUp size={16} color={MINT} />} 
              label="Estimated Income" 
              value="₹ 0.00" 
              smallIcon
            />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity activeOpacity={0.8} style={styles.actionButtonWrapper}>
          <LinearGradient
            colors={['#00E5AE', '#00D09C', '#00A67D']}
            style={styles.actionButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.actionButtonText}>Closed Selling</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-component for the grid items
const StatCard = ({ icon, label, value, smallIcon = false }: { icon: React.ReactNode, label: string, value: string, smallIcon?: boolean }) => (
  <View style={styles.statCard}>
    <View style={styles.statCardHeader}>
      <View style={[styles.iconBox, smallIcon && styles.iconBoxSmall]}>
        {icon}
      </View>
      <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    paddingHorizontal: 16, // slightly reduced for small screens
    paddingTop: 30,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 28, // reduced from 32
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 16, // reduced from 20
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accentBar: {
    width: 4,
    height: 16,
    backgroundColor: MINT,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16, // reduced from 18
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 13, // reduced from 14
    color: TEXT_MUTED,
    fontWeight: '400',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // Removed gap to prevent overflow on small screens
  },
  statCard: {
    width: '48%', // 48% leaves exactly 4% for the space between, handled by space-between
    backgroundColor: CARD_BG_LIGHT,
    borderRadius: 14,
    padding: 14, // slightly reduced
    marginBottom: 12, // added vertical spacing since gap is removed
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 28, // reduced from 32
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconBoxSmall: {
    width: 20, // reduced from 24
    height: 20,
    borderRadius: 6,
    backgroundColor: 'transparent',
    marginRight: 6,
  },
  statLabel: {
    color: TEXT_MUTED,
    fontSize: 11, // reduced from 12
    fontWeight: '500',
    flex: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16, // reduced from 18
    fontWeight: '600',
  },
  exchangeRateBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.15)',
  },
  exchangeRateText: {
    color: MINT,
    fontSize: 11, // reduced from 13 to prevent wrapping on small screens
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  exchangeRateValue: {
    color: MINT,
    fontSize: 14, // reduced from 16
    fontWeight: '700',
  },
  actionButtonWrapper: {
    marginTop: 8,
    borderRadius: 14,
    boxShadow: '0px 4px 10px rgba(0, 208, 156, 0.1)',
    elevation: 4,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
