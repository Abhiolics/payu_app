import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

export default function BalanceCard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>AVAILABLE BALANCE</Text>
      <Text style={styles.balance}>₹ 25,669.51</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/profile')}>
        <Text style={styles.buttonText}>View Details</Text>
        <ChevronRight size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    boxShadow: '0px 4px 12px rgba(0, 208, 156, 0.1)',
    elevation: 5,
  },
  label: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  balance: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
