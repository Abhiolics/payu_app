import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../../components/Header';
import BalanceCard from '../../components/BalanceCard';
import StatsCard from '../../components/StatsCard';
import ActionButtons from '../../components/ActionButtons';
import RecentTransactions from '../../components/RecentTransactions';
import InviteBanner from '../../components/InviteBanner';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { refreshUserData, refreshWallet, refreshTotals } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshUserData(), refreshWallet(), refreshTotals()]);
    } catch {
      // Ignore
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Sticky Top Section: Header & Big Balance Card */}
      <View style={styles.stickyTopContainer}>
        <Header />
        <BalanceCard />
      </View>

      {/* Scrollable Content Below Sticky Big Card */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
        }
      >
        <StatsCard />
        <ActionButtons />
        <RecentTransactions />
        <InviteBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FC',
  },
  stickyTopContainer: {
    backgroundColor: '#F4F6FC',
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 115, // Clearance for elevated bottom tab bar
  },
});
