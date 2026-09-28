import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDeposits } from '../services/depositService';
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

const DARK_BG = '#F4F6FC';
const CARD_BG = '#FFFFFF';
const TEXT_MUTED = '#64748B';
const MINT = '#7C3AED';

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
  const [orders, setOrders] = useState<BuyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [activeDropdown, setActiveDropdown] = useState<'date' | 'status' | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const deposits = await getDeposits();
        if (Array.isArray(deposits) && deposits.length > 0) {
          const mapped: BuyOrder[] = deposits.map((d) => {
            const createdAt = d.createdAt ? new Date(d.createdAt) : new Date();
            const daysAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
            const status: BuyOrder['status'] =
              d.status === 'approved' ? 'success' : d.status === 'rejected' ? 'close' : 'processing';
            const usdt = (d.amount / 90.1).toFixed(2);

            return {
              id: d._id,
              orderNumber: d.transactionRef || `BO-${d._id.slice(-8).toUpperCase()}`,
              amount: `₹ ${d.amount.toFixed(2)}`,
              cryptoAmount: `${usdt} USDT`,
              unitPrice: '₹90.10',
              status,
              paymentMethod: d.plan?.name ? `${d.plan.name} Plan` : 'Direct Deposit',
              dateStr: createdAt.toISOString().replace('T', ' ').slice(0, 19),
              daysAgo: Math.max(0, daysAgo),
              merchant: 'Official PayU Desk',
              referenceId: d.transactionRef || d._id,
            };
          });
          setOrders(mapped);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const filteredOrders = orders.filter((order) => {
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
          bg: 'rgba(124, 58, 237, 0.12)',
          border: 'rgba(124, 58, 237, 0.3)',
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
          color: '#7C3AED',
          bg: 'rgba(124, 58, 237, 0.12)',
          border: 'rgba(124, 58, 237, 0.3)',
          icon: <CheckCircle2 size={12} color="#7C3AED" strokeWidth={2.5} />,
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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* Header with Back Arrow */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color="#0F172A" />
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
        {isLoading ? (
          <View style={{ paddingVertical: 50, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={MINT} />
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Filter size={32} color={MINT} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>
              {orders.length === 0 ? 'No Buy Orders' : 'No Orders Found'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {orders.length === 0
                ? 'You do not have any orders yet. Deposit or buy packages to see your live order history here.'
                : `No buy orders match your current filter settings for ${dateFilter} and ${statusFilter} status.`}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={orders.length === 0 ? () => router.push('/deposit') : resetFilters}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                style={styles.emptyButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.emptyButtonText}>
                  {orders.length === 0 ? 'Make a Deposit' : 'Reset Filters'}
                </Text>
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
    borderBottomColor: '#EDF2F7',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
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
    backgroundColor: '#EDE9FE',
    borderWidth: 0.5,
    borderColor: '#DDD6FE',
    gap: 4,
  },
  resetButtonText: {
    color: '#7C3AED',
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  dropdownButtonActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  dropdownButtonOpen: {
    borderColor: '#7C3AED',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownIconCircleActive: {
    backgroundColor: '#EDE9FE',
  },
  dropdownTextCol: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dropdownValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  dropdownValueSelected: {
    color: '#7C3AED',
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
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#DDD6FE',
    gap: 6,
  },
  activePillText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '600',
  },
  clearAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clearAllText: {
    color: '#64748B',
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
    color: '#64748B',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
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
    fontWeight: '700',
    color: '#0F172A',
  },
  copyIconWrapper: {
    marginLeft: 6,
    padding: 2,
  },
  copiedBadge: {
    marginLeft: 6,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#DDD6FE',
  },
  copiedBadgeText: {
    color: '#7C3AED',
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
    color: '#64748B',
    marginBottom: 3,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cryptoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C3AED',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
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
    color: '#64748B',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
  },
  expandedDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 4,
  },
  expandButtonText: {
    fontSize: 12,
    color: '#7C3AED',
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
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
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
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
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
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionItemSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#C4B5FD',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 4,
  },
  optionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconCircleSelected: {
    backgroundColor: '#DDD6FE',
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  optionTitleSelected: {
    color: '#0F172A',
    fontWeight: '700',
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
