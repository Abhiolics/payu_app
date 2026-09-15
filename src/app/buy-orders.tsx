import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Calendar,
  Filter,
  CreditCard,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/Colors';

const DARK_BG = '#050505';
const CARD_BG = '#111111';
const TEXT_MUTED = '#8B93A5';
const MINT = '#00D09C';

type DateFilter = 'All' | '7 Days' | '30 Days' | '90 Days';
type StatusFilter = 'All' | 'Processing' | 'Submit' | 'Success' | 'Close';

export type BuyOrder = {
  id: string;
  orderNumber: string;
  amount: string;
  cryptoAmount: string;
  unitPrice: string;
  status: 'processing' | 'submit' | 'success' | 'close';
  paymentMethod: string;
  dateStr: string;
  daysAgo: number; // for reliable date filtering
  merchant: string;
  referenceId: string;
};

const SAMPLE_ORDERS: BuyOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'BO-20260908-7821',
    amount: '₹ 5,000.00',
    cryptoAmount: '55.49 USDT',
    unitPrice: '₹90.10',
    status: 'processing',
    paymentMethod: 'Mobikwik UPI',
    dateStr: '2026-09-08 16:30:12',
    daysAgo: 0,
    merchant: 'FastPay Merchant #41',
    referenceId: 'REF9823104921',
  },
  {
    id: 'ord-2',
    orderNumber: 'BO-20260907-6540',
    amount: '₹ 12,000.00',
    cryptoAmount: '133.18 USDT',
    unitPrice: '₹90.10',
    status: 'submit',
    paymentMethod: 'IMPS Bank Transfer',
    dateStr: '2026-09-07 11:20:45',
    daysAgo: 1,
    merchant: 'Prime Traders Global',
    referenceId: 'REF9814092104',
  },
  {
    id: 'ord-3',
    orderNumber: 'BO-20260905-5912',
    amount: '₹ 2,000.00',
    cryptoAmount: '22.20 USDT',
    unitPrice: '₹90.10',
    status: 'success',
    paymentMethod: 'UPI - GooglePay',
    dateStr: '2026-09-05 09:15:30',
    daysAgo: 3,
    merchant: 'Alpha Crypto Ex',
    referenceId: 'REF9782190345',
  },
  {
    id: 'ord-4',
    orderNumber: 'BO-20260902-5301',
    amount: '₹ 700.00',
    cryptoAmount: '7.77 USDT',
    unitPrice: '₹90.10',
    status: 'close',
    paymentMethod: 'Mobikwik Wallet',
    dateStr: '2026-09-02 21:04:18',
    daysAgo: 6,
    merchant: 'SwiftP2P Desk',
    referenceId: 'REF9754120938',
  },
  {
    id: 'ord-5',
    orderNumber: 'BO-20260826-4890',
    amount: '₹ 25,000.00',
    cryptoAmount: '277.47 USDT',
    unitPrice: '₹90.10',
    status: 'success',
    paymentMethod: 'IMPS Bank Transfer',
    dateStr: '2026-08-26 14:10:00',
    daysAgo: 13,
    merchant: 'Apex Trading Corp',
    referenceId: 'REF9698231045',
  },
  {
    id: 'ord-6',
    orderNumber: 'BO-20260820-4123',
    amount: '₹ 3,600.00',
    cryptoAmount: '39.95 USDT',
    unitPrice: '₹90.10',
    status: 'submit',
    paymentMethod: 'UPI - PhonePe',
    dateStr: '2026-08-20 18:45:10',
    daysAgo: 19,
    merchant: 'FastPay Merchant #12',
    referenceId: 'REF9643190281',
  },
  {
    id: 'ord-7',
    orderNumber: 'BO-20260814-3874',
    amount: '₹ 1,500.00',
    cryptoAmount: '16.65 USDT',
    unitPrice: '₹90.10',
    status: 'close',
    paymentMethod: 'UPI - Paytm',
    dateStr: '2026-08-14 12:30:00',
    daysAgo: 25,
    merchant: 'Star Exchange',
    referenceId: 'REF9587219034',
  },
  {
    id: 'ord-8',
    orderNumber: 'BO-20260810-3409',
    amount: '₹ 10,000.00',
    cryptoAmount: '111.00 USDT',
    unitPrice: '₹90.10',
    status: 'processing',
    paymentMethod: 'IMPS Bank Transfer',
    dateStr: '2026-08-10 10:00:22',
    daysAgo: 29,
    merchant: 'Alpha Crypto Ex',
    referenceId: 'REF9543190283',
  },
  {
    id: 'ord-9',
    orderNumber: 'BO-20260725-2980',
    amount: '₹ 50,000.00',
    cryptoAmount: '555.00 USDT',
    unitPrice: '₹90.10',
    status: 'success',
    paymentMethod: 'Bank Transfer (RTGS)',
    dateStr: '2026-07-25 15:40:12',
    daysAgo: 45,
    merchant: 'Prime Traders Global',
    referenceId: 'REF9423189021',
  },
  {
    id: 'ord-10',
    orderNumber: 'BO-20260705-2100',
    amount: '₹ 8,000.00',
    cryptoAmount: '88.80 USDT',
    unitPrice: '₹90.10',
    status: 'close',
    paymentMethod: 'Mobikwik UPI',
    dateStr: '2026-07-05 13:20:18',
    daysAgo: 65,
    merchant: 'SwiftP2P Desk',
    referenceId: 'REF9312094812',
  },
  {
    id: 'ord-11',
    orderNumber: 'BO-20260620-1845',
    amount: '₹ 15,000.00',
    cryptoAmount: '166.50 USDT',
    unitPrice: '₹90.10',
    status: 'success',
    paymentMethod: 'IMPS Bank Transfer',
    dateStr: '2026-06-20 17:15:30',
    daysAgo: 80,
    merchant: 'Apex Trading Corp',
    referenceId: 'REF9201948210',
  },
];

const DATE_OPTIONS: { id: DateFilter; label: string; subtitle: string }[] = [
  { id: 'All', label: 'All Dates', subtitle: 'Show orders from any date' },
  { id: '7 Days', label: '7 Days', subtitle: 'Orders placed in the last 7 days' },
  { id: '30 Days', label: '30 Days', subtitle: 'Orders placed in the last 30 days' },
  { id: '90 Days', label: '90 Days', subtitle: 'Orders placed in the last 90 days' },
];

const STATUS_OPTIONS: { id: StatusFilter; label: string; subtitle: string }[] = [
  { id: 'All', label: 'All Statuses', subtitle: 'Show orders with any status' },
  { id: 'Processing', label: 'Processing', subtitle: 'Orders pending confirmation & release' },
  { id: 'Submit', label: 'Submit', subtitle: 'Orders submitted awaiting matching' },
  { id: 'Success', label: 'Success', subtitle: 'Orders successfully completed & credited' },
  { id: 'Close', label: 'Close', subtitle: 'Canceled, closed or expired orders' },
];

export default function BuyOrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 10;
  const [dateFilter, setDateFilter] = useState<DateFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [activeDropdown, setActiveDropdown] = useState<'date' | 'status' | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleCopy = async (orderNumber: string) => {
    try {
      await Clipboard.setStringAsync(orderNumber);
    } catch {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(orderNumber);
      }
    }
    setCopiedId(orderNumber);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredOrders = SAMPLE_ORDERS.filter((order) => {
    // 1. Date filter
    if (dateFilter === '7 Days' && order.daysAgo > 7) return false;
    if (dateFilter === '30 Days' && order.daysAgo > 30) return false;
    if (dateFilter === '90 Days' && order.daysAgo > 90) return false;

    // 2. Status filter
    if (statusFilter !== 'All') {
      if (order.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    }

    return true;
  });

  const getStatusBadge = (status: BuyOrder['status']) => {
    switch (status) {
      case 'processing':
        return {
          label: 'Processing',
          color: MINT,
          bg: 'rgba(0, 208, 156, 0.12)',
          border: 'rgba(0, 208, 156, 0.3)',
          icon: <Clock size={12} color={MINT} strokeWidth={2.5} />,
        };
      case 'submit':
        return {
          label: 'Submit',
          color: '#38BDF8',
          bg: 'rgba(56, 189, 248, 0.12)',
          border: 'rgba(56, 189, 248, 0.3)',
          icon: <Send size={12} color="#38BDF8" strokeWidth={2.5} />,
        };
      case 'success':
        return {
          label: 'Success',
          color: '#10B981',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
          icon: <CheckCircle2 size={12} color="#10B981" strokeWidth={2.5} />,
        };
      case 'close':
      default:
        return {
          label: 'Close',
          color: '#EF4444',
          bg: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.3)',
          icon: <XCircle size={12} color="#EF4444" strokeWidth={2.5} />,
        };
    }
  };

  const resetFilters = () => {
    setDateFilter('All');
    setStatusFilter('All');
    setActiveDropdown(null);
  };

  const isFiltered = dateFilter !== 'All' || statusFilter !== 'All';

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      {/* Header with Back Arrow */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Buy Orders</Text>

        {isFiltered ? (
          <TouchableOpacity
            onPress={resetFilters}
            style={styles.resetButton}
            activeOpacity={0.7}
          >
            <RotateCcw size={14} color={MINT} />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerRightPlaceholder} />
        )}
      </View>

      {/* Dropdown Filters Bar */}
      <View style={styles.dropdownsContainer}>
        <View style={styles.dropdownsRow}>
          {/* Dropdown 1: Date Range Filter */}
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              dateFilter !== 'All' && styles.dropdownButtonActive,
              activeDropdown === 'date' && styles.dropdownButtonOpen,
            ]}
            onPress={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')}
            activeOpacity={0.75}
          >
            <View style={styles.dropdownLeft}>
              <View
                style={[
                  styles.dropdownIconCircle,
                  dateFilter !== 'All' && styles.dropdownIconCircleActive,
                ]}
              >
                <Calendar size={14} color={dateFilter !== 'All' ? MINT : TEXT_MUTED} />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={styles.dropdownLabel}>Time Range</Text>
                <Text
                  style={[
                    styles.dropdownValue,
                    dateFilter !== 'All' && styles.dropdownValueSelected,
                  ]}
                  numberOfLines={1}
                >
                  {dateFilter}
                </Text>
              </View>
            </View>
            {activeDropdown === 'date' ? (
              <ChevronUp size={16} color={MINT} />
            ) : (
              <ChevronDown size={16} color={dateFilter !== 'All' ? MINT : TEXT_MUTED} />
            )}
          </TouchableOpacity>

          {/* Dropdown 2: Status Filter */}
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              statusFilter !== 'All' && styles.dropdownButtonActive,
              activeDropdown === 'status' && styles.dropdownButtonOpen,
            ]}
            onPress={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
            activeOpacity={0.75}
          >
            <View style={styles.dropdownLeft}>
              <View
                style={[
                  styles.dropdownIconCircle,
                  statusFilter !== 'All' && styles.dropdownIconCircleActive,
                ]}
              >
                <Filter size={14} color={statusFilter !== 'All' ? MINT : TEXT_MUTED} />
              </View>
              <View style={styles.dropdownTextCol}>
                <Text style={styles.dropdownLabel}>Status</Text>
                <Text
                  style={[
                    styles.dropdownValue,
                    statusFilter !== 'All' && styles.dropdownValueSelected,
                  ]}
                  numberOfLines={1}
                >
                  {statusFilter}
                </Text>
              </View>
            </View>
            {activeDropdown === 'status' ? (
              <ChevronUp size={16} color={MINT} />
            ) : (
              <ChevronDown size={16} color={statusFilter !== 'All' ? MINT : TEXT_MUTED} />
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filter Tags */}
        {isFiltered && (
          <View style={styles.activePillsRow}>
            {dateFilter !== 'All' && (
              <TouchableOpacity
                style={styles.activePill}
                onPress={() => setDateFilter('All')}
                activeOpacity={0.7}
              >
                <Text style={styles.activePillText}>{dateFilter}</Text>
                <X size={12} color={MINT} />
              </TouchableOpacity>
            )}
            {statusFilter !== 'All' && (
              <TouchableOpacity
                style={styles.activePill}
                onPress={() => setStatusFilter('All')}
                activeOpacity={0.7}
              >
                <Text style={styles.activePillText}>{statusFilter}</Text>
                <X size={12} color={MINT} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={resetFilters} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Results Count Banner */}
      <View style={styles.resultsBanner}>
        <Text style={styles.resultsCountText}>
          Showing <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{filteredOrders.length}</Text> Orders
        </Text>
      </View>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Filter size={32} color={MINT} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>
              No buy orders match your current filter settings for {dateFilter} and {statusFilter} status.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={resetFilters}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#00E5AE', '#00D09C', '#00A67D']}
                style={styles.emptyButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.emptyButtonText}>Reset Filters</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const isExpanded = expandedOrderId === order.id;
            const isCopied = copiedId === order.orderNumber;

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Top: Order Number + Copy + Status */}
                <View style={styles.orderTopRow}>
                  <TouchableOpacity
                    style={styles.orderNumberRow}
                    onPress={() => handleCopy(order.orderNumber)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <View style={styles.copyIconWrapper}>
                      {isCopied ? (
                        <Check size={12} color={MINT} strokeWidth={2.5} />
                      ) : (
                        <Copy size={12} color={TEXT_MUTED} strokeWidth={1.8} />
                      )}
                    </View>
                    {isCopied && (
                      <View style={styles.copiedBadge}>
                        <Text style={styles.copiedBadgeText}>Copied</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Status Badge */}
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: statusInfo.bg,
                        borderColor: statusInfo.border,
                      },
                    ]}
                  >
                    {statusInfo.icon}
                    <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                {/* Amount Section */}
                <View style={styles.amountRow}>
                  <View>
                    <Text style={styles.amountLabel}>Fiat Amount</Text>
                    <Text style={styles.amountValue}>{order.amount}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.amountLabel}>Crypto Quantity</Text>
                    <Text style={styles.cryptoValue}>{order.cryptoAmount}</Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Meta info: Date & Payment method */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <CreditCard size={13} color={TEXT_MUTED} />
                    <Text style={styles.metaText}>{order.paymentMethod}</Text>
                  </View>
                  <Text style={styles.dateText}>{order.dateStr}</Text>
                </View>

                {/* Expandable Order Details */}
                {isExpanded && (
                  <View style={styles.expandedDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Merchant / Seller</Text>
                      <Text style={styles.detailValue}>{order.merchant}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Exchange Rate</Text>
                      <Text style={styles.detailValue}>{order.unitPrice} / USDT</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Reference ID</Text>
                      <Text style={styles.detailValue}>{order.referenceId}</Text>
                    </View>
                  </View>
                )}

                {/* Toggle details button */}
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.expandButtonText}>
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </Text>
                  {isExpanded ? (
                    <ChevronUp size={14} color={MINT} />
                  ) : (
                    <ChevronDown size={14} color={MINT} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Interactive Dropdown Selection Modal */}
      <Modal
        visible={activeDropdown !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveDropdown(null)}
      >
        <TouchableWithoutFeedback onPress={() => setActiveDropdown(null)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <View style={styles.sheetHandle} />

                {/* Dropdown Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {activeDropdown === 'date' ? (
                      <Calendar size={18} color={MINT} />
                    ) : (
                      <Filter size={18} color={MINT} />
                    )}
                    <Text style={styles.modalTitle}>
                      {activeDropdown === 'date'
                        ? 'Select Time Range'
                        : 'Select Order Status'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setActiveDropdown(null)}
                    activeOpacity={0.7}
                  >
                    <X size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Time Range Options Dropdown */}
                {activeDropdown === 'date' && (
                  <View style={styles.optionsList}>
                    {DATE_OPTIONS.map((opt) => {
                      const isSelected = dateFilter === opt.id;
                      return (
                        <TouchableOpacity
                          key={opt.id}
                          style={[
                            styles.optionItem,
                            isSelected && styles.optionItemSelected,
                          ]}
                          onPress={() => {
                            setDateFilter(opt.id);
                            setActiveDropdown(null);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.optionLeft}>
                            <View
                              style={[
                                styles.optionIconCircle,
                                isSelected && styles.optionIconCircleSelected,
                              ]}
                            >
                              <Calendar
                                size={16}
                                color={isSelected ? MINT : TEXT_MUTED}
                              />
                            </View>
                            <View style={styles.optionTextCol}>
                              <Text
                                style={[
                                  styles.optionTitle,
                                  isSelected && styles.optionTitleSelected,
                                ]}
                              >
                                {opt.label}
                              </Text>
                              <Text style={styles.optionSubtitle}>
                                {opt.subtitle}
                              </Text>
                            </View>
                          </View>
                          {isSelected && (
                            <Check size={18} color={MINT} strokeWidth={2.5} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Status Options Dropdown */}
                {activeDropdown === 'status' && (
                  <View style={styles.optionsList}>
                    {STATUS_OPTIONS.map((opt) => {
                      const isSelected = statusFilter === opt.id;
                      const badge =
                        opt.id !== 'All'
                          ? getStatusBadge(opt.id.toLowerCase() as any)
                          : null;

                      return (
                        <TouchableOpacity
                          key={opt.id}
                          style={[
                            styles.optionItem,
                            isSelected && styles.optionItemSelected,
                          ]}
                          onPress={() => {
                            setStatusFilter(opt.id);
                            setActiveDropdown(null);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.optionLeft}>
                            <View
                              style={[
                                styles.optionIconCircle,
                                isSelected && styles.optionIconCircleSelected,
                              ]}
                            >
                              {badge ? (
                                badge.icon
                              ) : (
                                <Filter
                                  size={16}
                                  color={isSelected ? MINT : TEXT_MUTED}
                                />
                              )}
                            </View>
                            <View style={styles.optionTextCol}>
                              <Text
                                style={[
                                  styles.optionTitle,
                                  isSelected && styles.optionTitleSelected,
                                ]}
                              >
                                {opt.label}
                              </Text>
                              <Text style={styles.optionSubtitle}>
                                {opt.subtitle}
                              </Text>
                            </View>
                          </View>
                          {isSelected && (
                            <Check size={18} color={MINT} strokeWidth={2.5} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 208, 156, 0.3)',
    gap: 4,
  },
  resetButtonText: {
    color: MINT,
    fontSize: 12,
    fontWeight: '600',
  },
  dropdownsContainer: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  dropdownsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dropdownButtonActive: {
    borderColor: 'rgba(226, 173, 81, 0.4)',
    backgroundColor: '#191821',
  },
  dropdownButtonOpen: {
    borderColor: MINT,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 4,
  },
  dropdownIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownIconCircleActive: {
    backgroundColor: 'rgba(226, 173, 81, 0.15)',
  },
  dropdownTextCol: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 10,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dropdownValue: {
    fontSize: 13,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  dropdownValueSelected: {
    color: MINT,
    fontWeight: '700',
  },
  activePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 173, 81, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(226, 173, 81, 0.3)',
    gap: 6,
  },
  activePillText: {
    color: MINT,
    fontSize: 12,
    fontWeight: '600',
  },
  clearAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clearAllText: {
    color: TEXT_MUTED,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  resultsBanner: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  resultsCountText: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  copyIconWrapper: {
    marginLeft: 6,
    padding: 2,
  },
  copiedBadge: {
    marginLeft: 6,
    backgroundColor: 'rgba(226, 173, 81, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: MINT,
  },
  copiedBadgeText: {
    color: MINT,
    fontSize: 9,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginBottom: 3,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cryptoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: MINT,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  dateText: {
    fontSize: 11,
    color: TEXT_MUTED,
  },
  expandedDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  detailValue: {
    fontSize: 12,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.03)',
    gap: 4,
  },
  expandButtonText: {
    fontSize: 12,
    color: MINT,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(226, 173, 81, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(226, 173, 81, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 280,
  },
  emptyButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#15141A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(226, 173, 81, 0.25)',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionItemSelected: {
    backgroundColor: 'rgba(226, 173, 81, 0.12)',
    borderColor: 'rgba(226, 173, 81, 0.4)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconCircleSelected: {
    backgroundColor: 'rgba(226, 173, 81, 0.2)',
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  optionTitleSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  optionSubtitle: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
});
