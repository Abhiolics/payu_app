import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowDownLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

const transactions = [
  {
    id: '1',
    title: 'Deposit INR',
    date: '2026-07-30 15:05:07',
    amount: '₹ 2,000.00',
    status: 'Completed',
  },
  {
    id: '2',
    title: 'Deposit INR',
    date: '2026-07-30 15:02:00',
    amount: '₹ 700.00',
    status: 'Close',
  },
  {
    id: '3',
    title: 'Deposit INR',
    date: '2026-07-30 09:16:50',
    amount: '₹ 3,600.00',
    status: 'Completed',
  },
  {
    id: '4',
    title: 'Deposit INR',
    date: '2026-07-29 18:40:12',
    amount: '₹ 5,000.00',
    status: 'Completed',
  },
  {
    id: '5',
    title: 'Deposit INR',
    date: '2026-07-28 14:15:45',
    amount: '₹ 1,200.00',
    status: 'Close',
  },
  {
    id: '6',
    title: 'Deposit INR',
    date: '2026-07-27 10:20:10',
    amount: '₹ 10,000.00',
    status: 'Completed',
  },
];

export default function RecentTransactions() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof transactions[0] }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => router.push('/buy-orders')}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <ArrowDownLeft size={20} color={Colors.primary} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.amount}>{item.amount}</Text>
        <Text 
          style={[
            styles.status, 
            item.status === 'Completed' ? styles.statusCompleted : styles.statusClose
          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
        <TouchableOpacity 
          onPress={() => router.push('/buy-orders')}
          activeOpacity={0.7}
          accessibilityLabel="See all transactions"
        >
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        {transactions.map((t) => (
          <React.Fragment key={t.id}>
            {renderItem({ item: t })}
            {t.id !== transactions[transactions.length - 1].id && (
              <View style={styles.separator} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    color: Colors.primary,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  details: {
    justifyContent: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  date: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusCompleted: {
    color: Colors.success,
  },
  statusClose: {
    color: Colors.danger,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
});
