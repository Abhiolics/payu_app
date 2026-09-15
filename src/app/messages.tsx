import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  CheckCheck,
  Bell,
  Wallet,
  Gift,
  Users,
  ShieldCheck,
  TrendingUp,
  Inbox,
  ChevronRight,
  ChevronDown,
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const DARK_BG = '#09080D';
const CARD_BG = '#15141A';
const CARD_BG_HOVER = '#1A1921';
const TEXT_MUTED = '#888894';
const GOLD = '#E2AD51';

type FilterType = 'Unread' | 'All';

type MessageItem = {
  id: string;
  category: 'Reward' | 'Deposit' | 'Commission' | 'Security' | 'System' | 'Cashback';
  title: string;
  description: string;
  detailedContent?: string;
  time: string;
  isRead: boolean;
};

const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: 'msg-1',
    category: 'Reward',
    title: 'New Member Task Reward',
    description: 'Congratulations! You received +150 Points for completing the New Member Trading task.',
    detailedContent: 'Your task "New Member Tasks" has reached the initial trading milestone. +150 Points and ₹50 bonus credit have been added to your asset balance.',
    time: '10m ago',
    isRead: false,
  },
  {
    id: 'msg-2',
    category: 'Deposit',
    title: 'Deposit Successful',
    description: 'Your deposit of ₹5,000.00 via Mobikwik has been confirmed and credited.',
    detailedContent: 'Transaction Reference: TXN98421873. The amount of ₹5,000.00 is immediately available for trading and task allocation.',
    time: '1h ago',
    isRead: false,
  },
  {
    id: 'msg-3',
    category: 'Commission',
    title: 'Team Commission Credited',
    description: 'You earned +₹168.00 today from Level B team member trading activity.',
    detailedContent: 'Your invitee completed daily trading milestones. Check your Teams tab for full performance stats and commission distribution.',
    time: '3h ago',
    isRead: false,
  },
  {
    id: 'msg-4',
    category: 'Security',
    title: 'Security Alert: New Login',
    description: 'New sign-in detected on your account from device iPhone 16 Pro (Mumbai, IN).',
    detailedContent: 'Login detected at 2026-09-08 21:40 IST. If this was not you, please immediately update your Transaction PIN and contact support.',
    time: 'Yesterday',
    isRead: true,
  },
  {
    id: 'msg-5',
    category: 'System',
    title: 'System Upgrade v1.1.8 Live',
    description: 'Platform update complete with faster order execution, improved stats, and instant withdrawals.',
    detailedContent: 'We have optimized network latency for instant commission payouts and upgraded the card cashback rates to 3.8%.',
    time: '07 Sep',
    isRead: true,
  },
  {
    id: 'msg-6',
    category: 'Cashback',
    title: 'Special Cashback Offer Applied',
    description: '+₹5.00 Special offer cashback credited for order code #IpTDIP.',
    detailedContent: 'Top Picks offer executed successfully. Your cashback bonus is reflected in your total wallet balance.',
    time: '06 Sep',
    isRead: true,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 10;
  const [filter, setFilter] = useState<FilterType>('Unread');
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const totalCount = messages.length;

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'Unread') return !msg.isRead;
    return true;
  });

  const handleToggleRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
    );
  };

  const handleCardPress = (id: string) => {
    // If clicking an unread card, mark it as read and toggle expansion
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleMarkAllRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  };

  const renderIcon = (category: MessageItem['category']) => {
    switch (category) {
      case 'Reward':
        return <Gift size={20} color="#E2AD51" />;
      case 'Deposit':
        return <Wallet size={20} color="#10B981" />;
      case 'Commission':
        return <Users size={20} color="#F28627" />;
      case 'Security':
        return <ShieldCheck size={20} color="#38BDF8" />;
      case 'Cashback':
        return <TrendingUp size={20} color="#F9D47D" />;
      case 'System':
      default:
        return <Bell size={20} color="#A78BFA" />;
    }
  };

  const getIconBackground = (category: MessageItem['category']) => {
    switch (category) {
      case 'Reward':
        return 'rgba(226, 173, 81, 0.12)';
      case 'Deposit':
        return 'rgba(16, 185, 129, 0.12)';
      case 'Commission':
        return 'rgba(242, 134, 39, 0.12)';
      case 'Security':
        return 'rgba(56, 189, 248, 0.12)';
      case 'Cashback':
        return 'rgba(249, 212, 125, 0.12)';
      case 'System':
      default:
        return 'rgba(167, 139, 250, 0.12)';
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Message</Text>

        <TouchableOpacity
          onPress={handleMarkAllRead}
          style={styles.markAllButton}
          activeOpacity={0.7}
          accessibilityLabel="Mark all as read"
        >
          <CheckCheck size={18} color={unreadCount > 0 ? GOLD : TEXT_MUTED} />
          <Text style={[styles.markAllText, unreadCount === 0 && { color: TEXT_MUTED }]}>
            Read all
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Toggle: Unread & All */}
      <View style={styles.toggleContainer}>
        <View style={styles.togglePillWrapper}>
          <TouchableOpacity
            style={[styles.togglePill, filter === 'Unread' && styles.togglePillActive]}
            onPress={() => setFilter('Unread')}
            activeOpacity={0.8}
          >
            {filter === 'Unread' && (
              <LinearGradient
                colors={['rgba(226,173,81,0.25)', 'rgba(226,173,81,0.1)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <Text style={[styles.toggleText, filter === 'Unread' && styles.toggleTextActive]}>
              Unread
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.countBadge, filter === 'Unread' && styles.countBadgeActive]}>
                <Text style={styles.countBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.togglePill, filter === 'All' && styles.togglePillActive]}
            onPress={() => setFilter('All')}
            activeOpacity={0.8}
          >
            {filter === 'All' && (
              <LinearGradient
                colors={['rgba(226,173,81,0.25)', 'rgba(226,173,81,0.1)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <Text style={[styles.toggleText, filter === 'All' && styles.toggleTextActive]}>
              All
            </Text>
            <View style={[styles.countBadge, filter === 'All' && styles.countBadgeActive]}>
              <Text style={styles.countBadgeText}>{totalCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Message List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMessages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Inbox size={36} color={GOLD} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No Unread Messages</Text>
            <Text style={styles.emptySubtitle}>
              You are all caught up! Switch to All to view your previous notifications and transaction records.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setFilter('All')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#F9D47D', '#E2AD51', '#C58C32']}
                style={styles.emptyButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.emptyButtonText}>View All Messages</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          filteredMessages.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleCardPress(item.id)}
                activeOpacity={0.85}
                style={[
                  styles.messageCard,
                  !item.isRead && styles.unreadCardBorder,
                ]}
              >
                <View style={styles.cardHeaderRow}>
                  {/* Category Icon */}
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: getIconBackground(item.category) },
                    ]}
                  >
                    {renderIcon(item.category)}
                  </View>

                  {/* Header Text */}
                  <View style={styles.cardMain}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.cardTitle, !item.isRead && styles.unreadTitle]}>
                        {item.title}
                      </Text>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>

                    <Text
                      style={styles.cardDesc}
                      numberOfLines={isExpanded ? undefined : 2}
                    >
                      {item.description}
                    </Text>

                    {isExpanded && item.detailedContent && (
                      <View style={styles.expandedDetails}>
                        <Text style={styles.expandedText}>{item.detailedContent}</Text>
                      </View>
                    )}
                  </View>

                  {/* Right Status */}
                  <View style={styles.rightStatusCol}>
                    {!item.isRead && <View style={styles.unreadDot} />}
                    {isExpanded ? (
                      <ChevronDown size={16} color={TEXT_MUTED} />
                    ) : (
                      <ChevronRight size={16} color={TEXT_MUTED} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
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
    paddingBottom: 16,
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
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(226, 173, 81, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(226, 173, 81, 0.2)',
    gap: 4,
  },
  markAllText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  togglePillWrapper: {
    flexDirection: 'row',
    backgroundColor: '#131218',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  togglePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    gap: 6,
  },
  togglePillActive: {
    backgroundColor: '#1E1C24',
    borderWidth: 1,
    borderColor: 'rgba(226, 173, 81, 0.35)',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  countBadgeActive: {
    backgroundColor: GOLD,
  },
  countBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  messageCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  unreadCardBorder: {
    borderColor: 'rgba(226, 173, 81, 0.3)',
    backgroundColor: '#17161E',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardMain: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingRight: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    color: TEXT_MUTED,
  },
  cardDesc: {
    fontSize: 12,
    color: TEXT_MUTED,
    lineHeight: 18,
  },
  rightStatusCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 6,
    paddingTop: 4,
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GOLD,
  },
  expandedDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  expandedText: {
    fontSize: 12,
    color: '#C5C5CE',
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(226, 173, 81, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(226, 173, 81, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  emptyButton: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  emptyButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
