import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Copy, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    try {
      await Clipboard.setStringAsync('228013');
    } catch {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('228013');
      }
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>K</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>Katty2026</Text>
          <TouchableOpacity 
            style={styles.idContainer} 
            onPress={handleCopyId}
            activeOpacity={0.7}
            accessibilityLabel="Copy User ID"
          >
            <Text style={styles.userId}>ID: 228013</Text>
            <View style={styles.copyIconWrapper}>
              {copied ? (
                <Check size={12} color={Colors.primary} strokeWidth={2.5} />
              ) : (
                <Copy size={12} color={Colors.textMuted} strokeWidth={1.8} />
              )}
            </View>
            {copied && (
              <View style={styles.copiedBadge}>
                <Text style={styles.copiedBadgeText}>Copied</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.bellButton}
        onPress={() => router.push('/messages')}
        activeOpacity={0.7}
        accessibilityLabel="View Messages"
      >
        <Bell size={20} color={Colors.text} />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 8,
    paddingRight: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    padding: 2,
    marginRight: 12,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#00A67D', // Darker mint for inner circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    justifyContent: 'center',
  },
  username: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  userId: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  copyIconWrapper: {
    marginLeft: 5,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copiedBadge: {
    marginLeft: 6,
    backgroundColor: 'rgba(0, 208, 156, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.primary,
  },
  copiedBadgeText: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '700',
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
  },
});
