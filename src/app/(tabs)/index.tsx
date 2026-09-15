import { StyleSheet, View, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import Header from '../../components/Header';
import BalanceCard from '../../components/BalanceCard';
import StatsCard from '../../components/StatsCard';
import ActionButtons from '../../components/ActionButtons';
import RecentTransactions from '../../components/RecentTransactions';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <BalanceCard />
        <StatsCard />
        <ActionButtons />
        <RecentTransactions />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
});

