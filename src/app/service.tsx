import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  ScrollView,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DARK_BG = '#050505';
const CARD_BG = '#111111';
const TEXT_MUTED = '#8B93A5';
const BLUE_BTN = '#0098FF';

const CONTACTS = [
  {
    id: '1',
    title: 'MDPay Telegram Official..',
    subtitle: 'Telegram Official Channel',
    url: 'https://t.me/mdpay_official'
  },
  {
    id: '2',
    title: 'Uono Telegram Customer...',
    subtitle: 'Telegram Customer Service',
    url: 'https://t.me/uono_support1'
  },
  {
    id: '3',
    title: 'Uono Telegram Customer...',
    subtitle: 'Telegram Customer Service',
    url: 'https://t.me/uono_support2'
  },
  {
    id: '4',
    title: 'Uono Telegram Customer...',
    subtitle: 'Telegram Customer Service',
    url: 'https://t.me/uono_support3'
  },
];

export default function ServiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 10;

  const handleContact = (url: string) => {
    // In a real app, we would open the URL
    // Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    console.log('Contact pressed:', url);
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {CONTACTS.map((contact) => (
          <View key={contact.id} style={styles.contactItem}>
            
            {/* Icon */}
            <LinearGradient
              colors={['#1E3A8A', '#2563EB']} // Dark blue to lighter blue
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Star size={20} color="#FBBF24" fill="#FBBF24" />
              {/* Little sparkles simulation */}
              <View style={[styles.sparkle, { top: 6, left: 6, width: 2, height: 2 }]} />
              <View style={[styles.sparkle, { bottom: 8, right: 8, width: 3, height: 3 }]} />
              <View style={[styles.sparkle, { bottom: 12, left: 8, width: 1.5, height: 1.5 }]} />
            </LinearGradient>

            {/* Text details */}
            <View style={styles.textContainer}>
              <Text style={styles.titleText} numberOfLines={1}>{contact.title}</Text>
              <Text style={styles.subtitleText} numberOfLines={1}>{contact.subtitle}</Text>
            </View>

            {/* Button */}
            <TouchableOpacity 
              style={styles.contactButton}
              activeOpacity={0.8}
              onPress={() => handleContact(contact.url)}
            >
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>

          </View>
        ))}
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
    paddingBottom: 20,
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
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subtitleText: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '400',
  },
  contactButton: {
    backgroundColor: BLUE_BTN,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
