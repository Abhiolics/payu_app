import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

const MOCK_DATA = [
  { id: '1', amount: '₹500/-', status: 'Failed', orderCode: '78XQI9', time: '00:14:32', date: '2026-06-07' },
  { id: '2', amount: '₹350/-', status: 'Failed', orderCode: '7TYI9', time: '00:14:32', date: '2026-06-07' },
  { id: '3', amount: '₹9600/-', status: 'Failed', orderCode: '7798I', time: '00:14:32', date: '2026-06-07' },
  { id: '4', amount: '₹5000/-', status: 'Failed', orderCode: '788CIV', time: '00:14:32', date: '2026-06-07' },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Receive' | 'Purchase'>('Receive');

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 40 : insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Payment History</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Receive' && styles.activeTabButton]}
          onPress={() => setActiveTab('Receive')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'Receive' && styles.activeTabText]}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Purchase' && styles.activeTabButton]}
          onPress={() => setActiveTab('Purchase')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'Purchase' && styles.activeTabText]}>Purchase</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.amountText}>{item.amount}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.cardBottomRow}>
              <Text style={styles.orderCodeLabel}>
                Order Code: <Text style={styles.orderCodeValue}>{item.orderCode}</Text>
              </Text>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>{item.time}</Text>
                <Text style={styles.dateTimeText}>{item.date}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#050505',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.15)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#00D09C', // Neo-Mint color
  },
  tabText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#888894',
  },
  activeTabText: {
    color: '#050505', // Dark text on mint background
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110, // Extra padding for the bottom tab bar
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.3)', // Subtle mint border
    shadowColor: '#00D09C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  statusBadge: {
    backgroundColor: '#FF3B30', // Vibrant Red
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  orderCodeLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  orderCodeValue: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  dateTimeText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
});
