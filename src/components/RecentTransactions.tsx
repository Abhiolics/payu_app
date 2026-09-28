import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import EmptyTransactionsArt from './EmptyTransactionsArt';
import { getTransactions, TransactionItem } from '../services';

export default function RecentTransactions() {
  const router = useRouter();
  const [recent, setRecent] = useState<TransactionItem[]>([]);

  useEffect(() => {
    getTransactions({ limit: 3 })
      .then((res) => {
        if (res.data) setRecent(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
        <TouchableOpacity
          style={styles.seeAllButton}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/wallet')}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={15} color="#4F46E5" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {recent.length === 0 ? (
        <View style={styles.card}>
          <EmptyTransactionsArt />
          <Text style={styles.emptyTitle}>No transactions yet</Text>
          <Text style={styles.emptySubtitle}>Fund your wallet to get started</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/deposit')}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={['#4338CA', '#4F46E5', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.topUpButton}
            >
              <Text style={styles.topUpText}>Deposit Now</Text>
              <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listCard}>
          {recent.map((tx, idx) => {
            const isCredit = tx.type === 'credit';
            return (
              <TouchableOpacity
                key={tx._id}
                style={[
                  styles.txItem,
                  idx < recent.length - 1 && styles.txItemBorder,
                ]}
                onPress={() => router.push('/(tabs)/wallet')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.txIconWrap,
                    { backgroundColor: isCredit ? '#EDE9FE' : '#FEE2E2' },
                  ]}
                >
                  {isCredit ? (
                    <ArrowDownLeft size={16} color="#7C3AED" />
                  ) : (
                    <ArrowUpRight size={16} color="#DC2626" />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.txDesc} numberOfLines={1}>
                    {tx.description || tx.category.replace('_', ' ')}
                  </Text>
                  <Text style={styles.txDate}>
                    {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    { color: isCredit ? '#10B981' : '#0F172A' },
                  ]}
                >
                  {isCredit ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: '#4F46E5',
    fontSize: 13.5,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  buttonWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 26,
    gap: 6,
  },
  topUpText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  txItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDesc: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  txDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  txAmount: {
    fontSize: 14.5,
    fontWeight: '800',
  },
});
