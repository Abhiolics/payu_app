import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Wallet, ArrowDownRight, ArrowUpRight, User, Mail, Phone, Calendar, Hash, Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopy = async (text: string, type: 'ref' | 'id') => {
    try {
      await Clipboard.setStringAsync(text);
    } catch {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
    }
    
    if (type === 'ref') {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 16 : insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 44 }} /> {/* Empty view for balance */}
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Identity Section */}
        <View style={styles.identitySection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLetter}>K</Text>
          </View>
          <Text style={styles.userName}>Katty2026</Text>
          <Text style={styles.userRole}>Premium Member</Text>
        </View>

        {/* Wallet Section */}
        <Text style={styles.sectionTitle}>My Wallet</Text>
        <View style={styles.card}>
          <View style={styles.balanceHeader}>
            <View style={styles.walletIconContainer}>
              <Wallet size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>₹ 25,669.51</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <ArrowDownRight size={16} color={Colors.success} />
              </View>
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>Total Credit</Text>
                <Text style={styles.statValue}>₹ 45,200.00</Text>
              </View>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statItem}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <ArrowUpRight size={16} color={Colors.danger} />
              </View>
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>Total Debit</Text>
                <Text style={styles.statValue}>₹ 19,530.49</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Personal Info Section */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <User size={18} color={Colors.textMuted} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>User ID</Text>
              <View style={styles.copyRow}>
                <Text style={styles.infoValue}>228013</Text>
                <TouchableOpacity onPress={() => handleCopy('228013', 'id')} style={styles.copyBtn}>
                  {copiedId ? <Check size={14} color={Colors.primary} /> : <Copy size={14} color={Colors.textMuted} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Phone size={18} color={Colors.textMuted} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>+91 98765 43210</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mail size={18} color={Colors.textMuted} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>katty2026@example.com</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Calendar size={18} color={Colors.textMuted} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Registered On</Text>
              <Text style={styles.infoValue}>12 Oct, 2025</Text>
            </View>
          </View>
        </View>

        {/* Referral Section */}
        <Text style={styles.sectionTitle}>Referral</Text>
        <View style={[styles.card, styles.referralCard]}>
          <View style={styles.referralIconWrapper}>
            <Hash size={24} color={Colors.primary} />
          </View>
          <View style={styles.referralContent}>
            <Text style={styles.referralLabel}>Your Referral Code</Text>
            <Text style={styles.referralCode}>KATTY2026</Text>
          </View>
          <TouchableOpacity 
            style={styles.referralCopyBtn}
            onPress={() => handleCopy('KATTY2026', 'ref')}
          >
            {copiedRef ? (
              <>
                <Check size={16} color="#000" />
                <Text style={styles.referralCopyText}>Copied</Text>
              </>
            ) : (
              <>
                <Copy size={16} color="#000" />
                <Text style={styles.referralCopyText}>Copy</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  identitySection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(230, 176, 92, 0.3)',
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#151515',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(230, 176, 92, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(230, 176, 92, 0.2)',
  },
  balanceLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statTextGroup: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBackgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyBtn: {
    padding: 4,
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(230, 176, 92, 0.3)',
    backgroundColor: 'rgba(230, 176, 92, 0.05)',
  },
  referralIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(230, 176, 92, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  referralContent: {
    flex: 1,
  },
  referralLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  referralCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  referralCopyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  referralCopyText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
