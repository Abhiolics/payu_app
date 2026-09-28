import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plus,
  CreditCard,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  X,
  Smartphone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

export interface UpiAccount {
  id: string;
  name: string;
  upiId: string;
  isDefault: boolean;
  createdAt: string;
}

const STORAGE_KEY = '@user_upi_accounts';

const QUICK_UPI_SUFFIXES = ['@okhdfcbank', '@okaxis', '@oksbi', '@paytm', '@ybl'];

export default function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 10;
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<UpiAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [upiInput, setUpiInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved accounts
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
          setAccounts(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setNameInput(user?.fullName || '');
    setUpiInput('');
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSaveAccount = async () => {
    const cleanName = nameInput.trim();
    const cleanUpi = upiInput.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      setFormError('Please enter a valid account holder name.');
      return;
    }

    if (!cleanUpi || !cleanUpi.includes('@') || cleanUpi.length < 5) {
      setFormError('Please enter a valid UPI ID (e.g. mobile@upi, name@okhdfcbank).');
      return;
    }

    // Check duplicate
    if (accounts.some((a) => a.upiId.toLowerCase() === cleanUpi)) {
      setFormError('This UPI ID has already been added.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    const newAccount: UpiAccount = {
      id: Date.now().toString(),
      name: cleanName,
      upiId: cleanUpi,
      isDefault: accounts.length === 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAccount, ...accounts];
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setAccounts(updated);
      setIsSaving(false);
      setShowAddModal(false);
    } catch (err) {
      console.warn('Failed to save account:', err);
      setIsSaving(false);
      setFormError('Failed to save account. Please try again.');
    }
  };

  const handleDeleteAccount = (id: string) => {
    Alert.alert(
      'Remove Account',
      'Are you sure you want to remove this UPI account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const filtered = accounts.filter((a) => a.id !== id);
            // If the deleted one was default, set the next one as default
            if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
              filtered[0].isDefault = true;
            }
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            setAccounts(filtered);
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    const updated = accounts.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAccounts(updated);
  };

  const handleCopyUpi = async (upi: string) => {
    try {
      await Clipboard.setStringAsync(upi);
      setCopiedId(upi);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore
    }
  };

  const handleSuffixPress = (suffix: string) => {
    const base = upiInput.split('@')[0];
    if (base) {
      setUpiInput(base + suffix);
    } else {
      setUpiInput(suffix);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header with Back option */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile'))}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Account</Text>

        <View style={styles.headerRight}>
          {accounts.length > 0 && (
            <TouchableOpacity
              style={styles.headerAddBtn}
              onPress={handleOpenAddModal}
              activeOpacity={0.7}
            >
              <Plus size={16} color="#7C3AED" strokeWidth={2.5} />
              <Text style={styles.headerAddBtnText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator color="#7C3AED" style={{ marginVertical: 40 }} />
        ) : accounts.length === 0 ? (
          /* Empty Screen: No accounts added yet */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Smartphone size={36} color="#7C3AED" />
            </View>

            <Text style={styles.emptyTitle}>No Accounts Added Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your UPI ID to enable instant withdrawals and seamless payout settlements directly to your bank account.
            </Text>

            {/* CTA Button */}
            <TouchableOpacity
              style={styles.emptyCtaButton}
              onPress={handleOpenAddModal}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyCtaGradient}
              >
                <Plus size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
                <Text style={styles.emptyCtaText}>Add Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Trust badge */}
            <View style={styles.trustBadge}>
              <ShieldCheck size={16} color="#10B981" />
              <Text style={styles.trustBadgeText}>100% Encrypted & NPCI Verified UPI Payouts</Text>
            </View>
          </View>
        ) : (
          /* Accounts List */
          <View style={styles.listContainer}>
            <Text style={styles.sectionSubtitle}>
              Linked UPI Accounts ({accounts.length})
            </Text>

            {accounts.map((item) => {
              const isCopied = copiedId === item.upiId;

              return (
                <View key={item.id} style={styles.accountCard}>
                  {/* Top Row: Icon, Name & Status */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardIconBox}>
                      <Smartphone size={22} color="#7C3AED" />
                    </View>

                    <View style={styles.cardInfoGroup}>
                      <Text style={styles.accountHolderName}>{item.name}</Text>
                      <TouchableOpacity
                        style={styles.upiCopyRow}
                        onPress={() => handleCopyUpi(item.upiId)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.accountUpiText}>{item.upiId}</Text>
                        {isCopied ? (
                          <Check size={13} color="#10B981" style={{ marginLeft: 6 }} />
                        ) : (
                          <Copy size={13} color="#94A3B8" style={{ marginLeft: 6 }} />
                        )}
                      </TouchableOpacity>
                    </View>

                    {item.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Primary</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardDivider} />

                  {/* Bottom Action Row */}
                  <View style={styles.cardBottomRow}>
                    {!item.isDefault ? (
                      <TouchableOpacity
                        style={styles.setDefaultBtn}
                        onPress={() => handleSetDefault(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.setDefaultText}>Set as Primary</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={14} color="#10B981" />
                        <Text style={styles.defaultLabel}>Default for Withdrawals</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDeleteAccount(item.id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Bottom Add Another Account CTA */}
            <TouchableOpacity
              style={styles.addAnotherBtn}
              onPress={handleOpenAddModal}
              activeOpacity={0.8}
            >
              <Plus size={18} color="#7C3AED" strokeWidth={2.5} />
              <Text style={styles.addAnotherBtnText}>Add Another UPI ID</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Add Account Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalHeaderIcon}>
                  <Smartphone size={20} color="#7C3AED" />
                </View>
                <Text style={styles.modalTitle}>Add UPI Account</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Enter your name and UPI ID. Instant settlements will be credited directly to this account.
            </Text>

            {/* Field 1: Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Holder Name</Text>
              <TextInput
                style={styles.textInput}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter full name (as per bank)"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Field 2: UPI ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>UPI ID / VPA</Text>
              <TextInput
                style={styles.textInput}
                value={upiInput}
                onChangeText={setUpiInput}
                placeholder="e.g. rahul@okhdfcbank or 9876543210@upi"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Quick Suffixes */}
            <View style={styles.suffixContainer}>
              <Text style={styles.suffixHint}>Quick bank handles:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suffixScroll}>
                {QUICK_UPI_SUFFIXES.map((suffix) => (
                  <TouchableOpacity
                    key={suffix}
                    style={styles.suffixPill}
                    onPress={() => handleSuffixPress(suffix)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suffixText}>{suffix}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {formError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.saveBtnWrap, isSaving && { opacity: 0.6 }]}
              onPress={handleSaveAccount}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtnGradient}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  headerAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 16,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    maxWidth: 290,
  },
  emptyCtaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
    width: '100%',
    maxWidth: 260,
    marginBottom: 28,
  },
  emptyCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  emptyCtaText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trustBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },

  // Accounts List
  listContainer: {
    gap: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfoGroup: {
    flex: 1,
  },
  accountHolderName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  upiCopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountUpiText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#7C3AED',
  },
  defaultBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setDefaultBtn: {
    paddingVertical: 4,
  },
  setDefaultText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#7C3AED',
  },
  defaultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  addAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EDE9FE',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginTop: 6,
  },
  addAnotherBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  suffixContainer: {
    marginBottom: 16,
  },
  suffixHint: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 6,
  },
  suffixScroll: {
    gap: 6,
  },
  suffixPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suffixText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
  },
  saveBtnWrap: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveBtnGradient: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
