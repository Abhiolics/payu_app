import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gift, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');
const DARK_BG = '#0A0A0A';
const CARD_BG = '#15141A';
const CARD_BG_LIGHT = '#1E1D24';
const TEXT_MUTED = '#888894';
const YELLOW_TEXT = '#F3C623';

const INVITE_LINK = 'https://payu.trade/invite?code=228013';

export default function TeamsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 10;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // 1. Copy link to clipboard
    try {
      await Clipboard.setStringAsync(INVITE_LINK);
    } catch {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(INVITE_LINK);
      }
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);

    // 2. Open native Share sheet so user can share on other apps
    try {
      await Share.share(
        {
          title: 'PayU Team Invitation',
          message: `Join my team on PayU! Invite Link: ${INVITE_LINK}`,
          url: INVITE_LINK,
        },
        {
          dialogTitle: 'Share Invite Link',
        }
      );
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teams</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Main Hero Card */}
        <LinearGradient
          colors={['#F28627', '#E25C1D', '#C83C12']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroSubtitle}>My Total Commissions</Text>
          <Text style={styles.heroTitle}>+₹2000.00/-</Text>

          <View style={styles.heroGrid}>
            <View style={styles.heroGridItem}>
              <Text style={styles.heroGridLabel}>Commissions Yesterday</Text>
              <Text style={styles.heroGridValue}>+158.00</Text>
            </View>
            <View style={styles.heroGridItem}>
              <Text style={styles.heroGridLabel}>Total Team Members</Text>
              <Text style={styles.heroGridValue}>+11</Text>
            </View>
            <View style={styles.heroGridItem}>
              <Text style={styles.heroGridLabel}>Commissions Today</Text>
              <Text style={styles.heroGridValue}>+168.00</Text>
            </View>
            <View style={styles.heroGridItem}>
              <Text style={styles.heroGridLabel}>Total Team Deposit</Text>
              <Text style={styles.heroGridValue}>+148990.00</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Invitation Card */}
        <View style={styles.invitationCard}>
          <View style={styles.invitationLeft}>
            <View style={styles.giftIconBox}>
              <Gift size={20} color="#FF3B30" />
            </View>
            <View>
              <Text style={styles.invitationTitle}>Invitation</Text>
              <Text style={styles.invitationSubtitle}>Share the Link to Invite</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
            <Text style={styles.shareButtonText}>{copied ? 'Copied' : 'Share'}</Text>
          </TouchableOpacity>
        </View>

        {/* Half Width & Full Width Cards Section */}
        <View style={styles.row}>
          <View style={styles.halfCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>New Team Members</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.levelText}>Level B</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Today:</Text>
                <Text style={styles.statValue}>0</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Yesterday:</Text>
                <Text style={styles.statValue}>0</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }} />
        </View>

        <View style={styles.fullCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Commissions/Deposit</Text>
          </View>
          <View style={[styles.cardContent, styles.fullCardContent]}>
            <View>
              <Text style={styles.levelText}>Level B</Text>
              <Text style={styles.fullCardValue}>2900.00/50000.00</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewDetailsText}>View Details →</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  heroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  heroGridItem: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroGridLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroGridValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  invitationCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  invitationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftIconBox: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  invitationTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  invitationSubtitle: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  shareButton: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  halfCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  fullCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: CARD_BG_LIGHT,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cardContent: {
    padding: 16,
  },
  levelText: {
    color: YELLOW_TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: TEXT_MUTED,
    fontSize: 14,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  fullCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  fullCardValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  viewDetailsText: {
    color: '#0A84FF',
    fontSize: 13,
    fontWeight: '500',
  },
});
