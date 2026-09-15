import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const DARK_BG = '#050505';
const CARD_BG = '#111111';
const TEXT_MUTED = '#8B93A5';
const MINT = '#00D09C';
const MINT_GRADIENT = ['#00E5AE', '#00D09C', '#00A67D'] as const;

export default function CardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 12;

  const [activeFilter, setActiveFilter] = useState('Top Picks');
  const filters = ['Top Picks', '100-199', '200-299', '300-599'];

  const offers = [
    { id: 1, amount: 1000, income: 38, code: 'IpTDIP', special: '+₹5.00 Special' },
    { id: 2, amount: 1000, income: 38, code: 'LByeHA', special: '+₹5.00 Special' },
    { id: 3, amount: 1000, income: 38, code: 'UYAfwH', special: '+₹5.00 Special' },
  ];

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingTop: topPadding }]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Main Cashback Card */}
        <LinearGradient
          colors={['#004D3A', '#007A5C', '#00A67D', '#00D09C']}
          locations={[0, 0.35, 0.72, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.mainCardTop}>
            <View>
              <Text style={styles.cashbackTitle}>Cashback Rate</Text>
              <Text style={styles.cashbackValue}>3.8%</Text>
            </View>
            <View style={styles.barChart}>
              {[12, 18, 24, 32, 40].map((height, index) => (
                <View key={index} style={[styles.bar, { height }]} />
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>₹88</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Deposit</Text>
              <Text style={styles.statValue}>₹0</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={styles.statValue}>₹0</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <TriangleAlert size={18} color={MINT} strokeWidth={2} />
          <Text style={styles.warningText}>Please use Freecharge or Mobikwik wallet for payment!</Text>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Offers</Text>
          <Text style={styles.sectionSubtitle}>Refreshes Daily</Text>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter} 
              activeOpacity={0.8} 
              onPress={() => setActiveFilter(filter)}
            >
              {activeFilter === filter ? (
                <LinearGradient
                  colors={MINT_GRADIENT}
                  style={styles.filterPillActive}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.filterTextActive}>{filter}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.filterPillInactive}>
                  <Text style={styles.filterTextInactive}>{filter}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Offer Cards */}
        <View style={styles.offersList}>
          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerCardTop}>
                <View style={styles.offerCardTitleRow}>
                  <Text style={styles.currencyText}>INR</Text>
                  <View style={styles.specialPill}>
                    <Text style={styles.specialPillText}>{offer.special}</Text>
                  </View>
                </View>
                <Text style={styles.codeText}>Code: <Text style={styles.codeHighlight}>{offer.code}</Text></Text>
              </View>

              <View style={styles.offerCardBottom}>
                <View style={styles.offerStatBox}>
                  <Text style={styles.offerStatLabel}>Amount</Text>
                  <Text style={styles.offerStatValue}>₹{offer.amount}</Text>
                </View>
                
                <View style={styles.offerStatBox}>
                  <Text style={styles.offerStatLabel}>Income</Text>
                  <Text style={styles.offerIncomeValue}>+{offer.income}</Text>
                </View>

                <TouchableOpacity 
                  activeOpacity={0.8} 
                  style={styles.claimButtonWrapper}
                  onPress={() => router.push('/deposit')}
                >
                  <LinearGradient
                    colors={MINT_GRADIENT}
                    style={styles.claimButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.claimButtonText}>Claim</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 110, // Clearance for bottom tab bar
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.35)',
    boxShadow: '0px 6px 20px rgba(0, 208, 156, 0.15)',
  },
  mainCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cashbackTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  cashbackValue: {
    fontSize: 34,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 4,
  },
  bar: {
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 6,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.25)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    gap: 10,
  },
  warningText: {
    color: MINT,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '400',
  },
  filtersContainer: {
    gap: 10,
    marginBottom: 20,
  },
  filterPillActive: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterTextActive: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
  filterPillInactive: {
    backgroundColor: CARD_BG,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  filterTextInactive: {
    color: TEXT_MUTED,
    fontSize: 13,
    fontWeight: '500',
  },
  offersList: {
    gap: 12,
  },
  offerCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  offerCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  offerCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  specialPill: {
    backgroundColor: 'rgba(46, 202, 105, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specialPillText: {
    color: '#2ECA69',
    fontSize: 11,
    fontWeight: '600',
  },
  codeText: {
    color: TEXT_MUTED,
    fontSize: 13,
  },
  codeHighlight: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  offerCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  offerStatBox: {
    flex: 1,
  },
  offerStatLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '500',
  },
  offerStatValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  offerIncomeValue: {
    color: MINT,
    fontSize: 16,
    fontWeight: '700',
  },
  claimButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  claimButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
