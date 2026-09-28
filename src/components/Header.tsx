import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Bell, Copy, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, unreadCount } = useAuth();
  const [copied, setCopied] = useState(false);

  const displayName = user?.fullName || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const displayId = user?._id ? user._id.slice(-8).toUpperCase() : 'MEMBER';

  const handleCopyId = async () => {
    try {
      await Clipboard.setStringAsync(displayId);
    } catch {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(displayId);
      }
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 12) + 8;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* User Info Left Section */}
      <View style={styles.leftSection}>
        {/* Avatar Circle with letter */}
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </TouchableOpacity>

        {/* Username & ID */}
        <View style={styles.userTextContainer}>
          <Text style={styles.username} numberOfLines={1}>
            {displayName}
          </Text>
          <TouchableOpacity
            style={styles.idRow}
            onPress={handleCopyId}
            activeOpacity={0.7}
            accessibilityLabel="Copy User ID"
          >
            <Text style={styles.userId}>ID: {displayId}</Text>
            <View style={styles.copyIconWrapper}>
              {copied ? (
                <Check size={13} color="#7C3AED" strokeWidth={2.5} />
              ) : (
                <Copy size={13} color="#64748B" strokeWidth={1.8} />
              )}
            </View>
            {copied && (
              <View style={styles.copiedBadge}>
                <Text style={styles.copiedText}>Copied</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Icons Right Section */}
      <View style={styles.rightSection}>
        {/* Bell with red notification badge */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/messages')}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <Bell size={22} color="#0F172A" strokeWidth={2} />
          {unreadCount > 0 && (
            <View style={styles.notificationDot}>
              {unreadCount > 9 ? (
                <Text style={styles.dotText}>9+</Text>
              ) : (
                <Text style={styles.dotText}>{unreadCount}</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: 'transparent',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#7C3AED',
    fontSize: 20,
    fontWeight: '700',
  },
  userTextContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  username: {
    color: '#0F172A',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userId: {
    color: '#64748B',
    fontSize: 12.5,
    fontWeight: '500',
  },
  copyIconWrapper: {
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copiedBadge: {
    marginLeft: 6,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  copiedText: {
    color: '#6D28D9',
    fontSize: 10,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
});
