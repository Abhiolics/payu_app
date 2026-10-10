import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Share,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Gift,
  Share2,
  Copy,
  Check,
  Users,
  Wallet,
  DollarSign,
  Sun,
  Moon,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../context/AuthContext';
import { getReferralStats, ReferralStatsData, TeamMemberItem } from '../services';

interface TeamsScreenProps {
  showBackButton?: boolean;
}

export default function TeamsScreen({ showBackButton = true }: TeamsScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 10;
  const { user } = useAuth();

  const [stats, setStats] = useState<ReferralStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getReferralStats();
      setStats(data);
    } catch (err) {
      console.warn('Failed to fetch referral stats:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
  };

  // Derive Referral Code & Referral Link
  const referralCode =
    stats?.referralCode ||
    user?.referralCode ||
    (user?._id ? user._id.slice(-6).toUpperCase() : 'GDPE2026');

  const referralLink = 'https://gdpe.info';

  // Direct WhatsApp/Social Share call
  const handleShare = async () => {
    const shareMessage = `Join GDPE App using my invite link: ${referralLink} or use Code: ${referralCode}`;
    try {
      await Share.share({
        message: shareMessage,
        url: referralLink,
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Ignore
    }
  };

  // Extract 5 Main Cards Data
  const totalCommission = stats?.totalCommission ?? 0;
  const todayCommission = stats?.todayCommission ?? 0;
  const yesterdayCommission = stats?.yesterdayCommission ?? 0;
  const totalMembers = stats?.totalMembers ?? 0;
  const level1Count = stats?.level1Count ?? 0;
  const level2Count = stats?.level2Count ?? 0;
  const totalTeamDeposit = stats?.totalTeamDeposit ?? 0;
  const teamMembers = stats?.teamMembers || [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const renderMemberItem = ({ item }: { item: TeamMemberItem }) => {
    const name = item.fullName || item.name || item.username || 'Member';
    const phone = item.phoneNumber || item.phone || 'N/A';
    const isLevel2 =
      item.levelBadge === 'L2' || item.level === '2' || item.level === 2 || item.level === 'L2';
    const levelLabel = isLevel2 ? 'L2' : 'L1';
    const depositAmount = item.totalDeposit ?? item.deposit ?? 0;
    const initial = name.charAt(0).toUpperCase();

    return (
      <View style={styles.memberCard}>
        <View style={styles.memberLeft}>
          <View style={[styles.avatarCircle, isLevel2 && { backgroundColor: '#E0F2FE' }]}>
            <Text style={[styles.avatarText, isLevel2 && { color: '#0284C7' }]}>{initial}</Text>
          </View>

          <View style={styles.memberInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.memberName} numberOfLines={1}>
                {name}
              </Text>
              <View
                style={[
                  styles.levelBadge,
                  isLevel2
                    ? { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' }
                    : { backgroundColor: '#EDE9FE', borderColor: '#DDD6FE' },
                ]}
              >
                <Text
                  style={[
                    styles.levelBadgeText,
                    isLevel2 ? { color: '#0284C7' } : { color: '#7C3AED' },
                  ]}
                >
                  {levelLabel}
                </Text>
              </View>
            </View>

            <Text style={styles.memberPhone}>{phone}</Text>
            <Text style={styles.memberDate}>Joined: {formatDate(item.createdAt || item.registrationDate)}</Text>
          </View>
        </View>

        <View style={styles.memberRight}>
          <Text style={styles.depositLabel}>Total Deposit</Text>
          <Text style={styles.depositAmount}>₹{depositAmount.toLocaleString('en-IN')}</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* 1. Share & Referral Details Card */}
      <View style={styles.inviteBanner}>
        <View style={styles.inviteBannerHeader}>
          <View style={styles.inviteIconCircle}>
            <Gift size={22} color="#7C3AED" />
          </View>
          <View style={styles.inviteTextGroup}>
            <Text style={styles.inviteBannerTitle}>My Referral Details</Text>
            <Text style={styles.inviteBannerSub}>Share your code & link to earn level commissions</Text>
          </View>
        </View>

        {/* Big Referral Code Box */}
        <View style={styles.codeBoxContainer}>
          <View style={styles.codeBoxLeft}>
            <Text style={styles.codeBoxLabel}>MY REFERRAL CODE</Text>
            <Text style={styles.codeBoxValue}>{referralCode}</Text>
          </View>
          <TouchableOpacity
            style={[styles.copyBtn, copiedCode && styles.copyBtnSuccess]}
            onPress={handleCopyCode}
            activeOpacity={0.75}
          >
            {copiedCode ? (
              <>
                <Check size={14} color="#10B981" />
                <Text style={[styles.copyBtnText, { color: '#10B981' }]}>Copied!</Text>
              </>
            ) : (
              <>
                <Copy size={14} color="#7C3AED" />
                <Text style={styles.copyBtnText}>Copy Code</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Referral Link Box */}
        <View style={styles.linkBoxContainer}>
          <View style={styles.linkBoxLeft}>
            <Text style={styles.linkBoxLabel}>INVITE LINK</Text>
            <Text style={styles.linkBoxValue} numberOfLines={1}>
              {referralLink}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.copyBtn, copiedLink && styles.copyBtnSuccess]}
            onPress={handleCopyLink}
            activeOpacity={0.75}
          >
            {copiedLink ? (
              <>
                <Check size={14} color="#10B981" />
                <Text style={[styles.copyBtnText, { color: '#10B981' }]}>Copied!</Text>
              </>
            ) : (
              <>
                <Copy size={14} color="#64748B" />
                <Text style={[styles.copyBtnText, { color: '#64748B' }]}>Copy Link</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Share CTA Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shareGradient}
          >
            <Share2 size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.shareText}>Share Invite Link & Code</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 2. 5 Main Cards Section Title */}
      <Text style={styles.sectionTitle}>Referral Overview</Text>

      {/* Card 1: 💰 Total Commission (Hero Card) */}
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9', '#4C1D95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroCardTop}>
          <View style={styles.heroIconBadge}>
            <DollarSign size={20} color="#F59E0B" />
          </View>
          <Text style={styles.heroLabel}>Total Commission</Text>
        </View>
        <Text style={styles.heroValue}>
          ₹{totalCommission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
      </LinearGradient>

      {/* 2x2 Grid for Next 4 Cards */}
      <View style={styles.gridContainer}>
        {/* Card 2: ☀️ Today Commission */}
        <View style={styles.gridCard}>
          <View style={styles.gridIconHeader}>
            <View style={[styles.smallIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Sun size={16} color="#D97706" />
            </View>
            <Text style={styles.gridCardTitle}>Today</Text>
          </View>
          <Text style={styles.gridCardValue}>
            ₹{todayCommission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.gridCardSub}>Today Commission</Text>
        </View>

        {/* Card 3: 🌙 Yesterday Commission */}
        <View style={styles.gridCard}>
          <View style={styles.gridIconHeader}>
            <View style={[styles.smallIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Moon size={16} color="#7C3AED" />
            </View>
            <Text style={styles.gridCardTitle}>Yesterday</Text>
          </View>
          <Text style={styles.gridCardValue}>
            ₹{yesterdayCommission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.gridCardSub}>Yesterday Commission</Text>
        </View>

        {/* Card 4: 👥 Total Team Members */}
        <View style={styles.gridCard}>
          <View style={styles.gridIconHeader}>
            <View style={[styles.smallIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Users size={16} color="#0284C7" />
            </View>
            <Text style={styles.gridCardTitle}>Team Size</Text>
          </View>
          <Text style={styles.gridCardValue}>{totalMembers}</Text>
          <View style={styles.levelBreakdownPill}>
            <Text style={styles.levelBreakdownText}>
              L1: {level1Count} | L2: {level2Count}
            </Text>
          </View>
        </View>

        {/* Card 5: 💳 Total Team Deposit */}
        <View style={styles.gridCard}>
          <View style={styles.gridIconHeader}>
            <View style={[styles.smallIconCircle, { backgroundColor: '#D1FAE5' }]}>
              <Wallet size={16} color="#059669" />
            </View>
            <Text style={styles.gridCardTitle}>Team Deposit</Text>
          </View>
          <Text style={styles.gridCardValue}>
            ₹{totalTeamDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.gridCardSub}>Total Team Deposit</Text>
        </View>
      </View>

      {/* 3. My Team List Section Header */}
      <View style={styles.teamListHeaderRow}>
        <Text style={styles.sectionTitle}>My Team List</Text>
        <View style={styles.memberCountBadge}>
          <Text style={styles.memberCountText}>{teamMembers.length} Members</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Users size={32} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No Team Members Yet</Text>
      <Text style={styles.emptySub}>
        Share your referral code or link with friends to build your team and start earning commission!
      </Text>
      <TouchableOpacity
        style={styles.emptyShareBtn}
        onPress={handleShare}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyShareBtnText}>Invite Friends</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#0F172A" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}

        <Text style={styles.headerTitle}>My Teams</Text>
        <View style={{ width: 38 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#7C3AED" size="large" />
          <Text style={styles.loadingText}>Fetching team stats...</Text>
        </View>
      ) : (
        <FlatList
          data={teamMembers}
          keyExtractor={(item, index) => item._id || item.id || `member-${index}`}
          renderItem={renderMemberItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            !showBackButton && { paddingBottom: 120 }, // Clearance for bottom tab bar
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#F4F6FC',
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 8,
  },
  inviteBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  inviteBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  inviteIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inviteTextGroup: {
    flex: 1,
  },
  inviteBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  inviteBannerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  codeBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EDE9FE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  codeBoxLeft: {
    flex: 1,
    marginRight: 10,
  },
  codeBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6D28D9',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  codeBoxValue: {
    fontSize: 19,
    fontWeight: '900',
    color: '#4C1D95',
    letterSpacing: 1,
  },
  linkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  linkBoxLeft: {
    flex: 1,
    marginRight: 10,
  },
  linkBoxLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  linkBoxValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  copyBtnSuccess: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  shareButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  shareGradient: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  heroCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  heroIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    color: '#DDD6FE',
    fontSize: 13,
    fontWeight: '600',
  },
  heroValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  gridIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  smallIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  gridCardValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  gridCardSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  levelBreakdownPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  levelBreakdownText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  teamListHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberCountBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  memberCountText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#7C3AED',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7C3AED',
  },
  memberInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  memberPhone: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 2,
  },
  memberDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  memberRight: {
    alignItems: 'flex-end',
  },
  depositLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  depositAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyShareBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyShareBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
