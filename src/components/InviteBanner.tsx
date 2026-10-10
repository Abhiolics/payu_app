import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Share2, Check, ArrowRight } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../context/AuthContext';
import GiftBox3DArt from './GiftBox3DArt';

export default function InviteBanner() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || (user?._id ? user._id.slice(-6).toUpperCase() : 'GDPE2026');
  const referralLink = 'https://gdpe.info';

  const handleInvite = async () => {
    // 1. Copy link to clipboard
    try {
      await Clipboard.setStringAsync(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }

    // 2. Open native share sheet with required format
    try {
      await Share.share({
        message: `Join GDPE App using my invite link: ${referralLink} or use Code: ${referralCode}`,
        url: referralLink,
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  return (
    <LinearGradient
      colors={['#FFD1D8', '#FFE0D4', '#FFEEDB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Left Text & CTA */}
      <View style={styles.leftContent}>
        <Text style={styles.title}>Refer & Earn Rewards</Text>
        <Text style={styles.subtitle}>
          Invite friends & earn level commissions on every deposit!
        </Text>

        <TouchableOpacity
          style={styles.inviteButton}
          activeOpacity={0.85}
          onPress={handleInvite}
        >
          {copied ? (
            <>
              <Check size={14} color="#10B981" strokeWidth={2.5} />
              <Text style={[styles.inviteText, { color: '#10B981' }]}>Link Copied!</Text>
            </>
          ) : (
            <>
              <Share2 size={13} color="#0F172A" strokeWidth={2.2} />
              <Text style={styles.inviteText}>Invite Now</Text>
              <ArrowRight size={13} color="#0F172A" strokeWidth={2.5} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Right 3D Gift Box & Coins Graphic */}
      <View style={styles.artWrapper}>
        <GiftBox3DArt />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 20,
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  leftContent: {
    flex: 1,
    paddingRight: 6,
    zIndex: 2,
  },
  title: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: '#475569',
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 16,
    marginTop: 4,
    maxWidth: 200,
  },
  inviteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inviteText: {
    color: '#0F172A',
    fontSize: 12.5,
    fontWeight: '700',
  },
  artWrapper: {
    width: 110,
    height: 95,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -6,
  },
});
