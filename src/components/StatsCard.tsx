import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

export default function StatsCard() {
  return (
    <View style={styles.container}>
      <View style={styles.statColumn}>
        <View style={styles.labelRow}>
          <ArrowUpRight size={16} color={Colors.success} />
          <Text style={styles.label}>Deposit</Text>
        </View>
        <Text style={styles.amount}>₹ 76,341</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.statColumn}>
        <View style={styles.labelRow}>
          <ArrowDownRight size={16} color={Colors.danger} />
          <Text style={styles.label}>Withdrawal</Text>
        </View>
        <Text style={styles.amount}>₹ 77,856</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 14,
    marginLeft: 4,
  },
  amount: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
});
