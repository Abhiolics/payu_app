import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckSquare, Sparkles, Wallet, Headphones } from 'lucide-react-native';

export default function ActionButtons() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. Task Card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#EDF5FE' }]}
        activeOpacity={0.8}
        onPress={() => router.push('/tasks')}
      >
        <View style={[styles.iconCircle, { backgroundColor: '#3B82F6' }]}>
          <CheckSquare size={20} color="#FFFFFF" strokeWidth={2.2} />
        </View>
        <Text style={styles.cardTitle}>Task</Text>
        <Text style={styles.cardSubtitle}>Earn More</Text>
      </TouchableOpacity>

      {/* 2. Plans Card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#FFFBEB' }]}
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/card')}
      >
        <View style={[styles.iconCircle, { backgroundColor: '#F59E0B' }]}>
          <Sparkles size={20} color="#FFFFFF" strokeWidth={2.2} />
        </View>
        <Text style={styles.cardTitle}>Plans</Text>
        <Text style={styles.cardSubtitle}>VIP Tiers</Text>
      </TouchableOpacity>

      {/* 3. Money Card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#ECFDF5' }]}
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/wallet')}
      >
        <View style={[styles.iconCircle, { backgroundColor: '#10B981' }]}>
          <Wallet size={20} color="#FFFFFF" strokeWidth={2.2} />
        </View>
        <Text style={styles.cardTitle}>Money</Text>
        <Text style={styles.cardSubtitle}>History</Text>
      </TouchableOpacity>

      {/* 4. Service Card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#F5F3FF' }]}
        activeOpacity={0.8}
        onPress={() => router.push('/service')}
      >
        <View style={[styles.iconCircle, { backgroundColor: '#7C3AED' }]}>
          <Headphones size={20} color="#FFFFFF" strokeWidth={2.2} />
        </View>
        <Text style={styles.cardTitle}>Service</Text>
        <Text style={styles.cardSubtitle}>24/7 Desk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '500',
  },
});
