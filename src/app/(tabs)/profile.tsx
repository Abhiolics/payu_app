import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Ticket, 
  Wallet, 
  CreditCard, 
  XCircle, 
  Headphones, 
  MessageSquare, 
  Shield 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MINT_GRADIENT = ['#00E5AE', '#00D09C', '#00A67D'] as const;
const DARK_BG = '#050505';
const CARD_BG = '#111111';
const ICON_BG = '#1E1B24';
const TEXT_MUTED = '#8B93A5';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 12;

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingTop: topPadding }]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={MINT_GRADIENT}
            style={styles.avatarBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarInner}>
              <User size={32} color="#00D09C" strokeWidth={1.5} />
            </View>
          </LinearGradient>
          <Text style={styles.titleText}>My Asset</Text>
        </View>

        {/* Commission Card */}
        <TouchableOpacity activeOpacity={0.8} style={styles.cardWrapper}>
          <LinearGradient
            colors={['rgba(0, 208, 156,0.5)', 'rgba(0, 208, 156,0.05)', 'rgba(0, 208, 156,0.2)']}
            style={styles.cardGradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.card, styles.rowCard]}>
              <View style={styles.iconBox}>
                <Ticket size={24} color="#00D09C" strokeWidth={1.5} />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardLabel}>Commission</Text>
                <Text style={styles.cardValue}>₹ 0</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Deposit & Withdraw Row */}
        <View style={styles.row}>
          <TouchableOpacity activeOpacity={0.8} style={[styles.cardWrapper, { flex: 1, marginRight: 8 }]}>
            <LinearGradient
              colors={['rgba(0, 208, 156,0.4)', 'rgba(0, 208, 156,0.05)', 'rgba(0, 208, 156,0.1)']}
              style={styles.cardGradientBorder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.card, styles.rowCard]}>
                <View style={styles.iconBox}>
                  <Wallet size={24} color="#00D09C" strokeWidth={1.5} />
                </View>
                <View style={styles.cardTextContent}>
                  <Text style={styles.cardLabel}>Deposit</Text>
                  <Text style={styles.cardValue}>₹ 0</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={[styles.cardWrapper, { flex: 1, marginLeft: 8 }]}>
            <LinearGradient
              colors={['rgba(0, 208, 156,0.1)', 'rgba(0, 208, 156,0.05)', 'rgba(0, 208, 156,0.4)']}
              style={styles.cardGradientBorder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.card, styles.rowCard]}>
                <View style={styles.iconBox}>
                  <Wallet size={24} color="#00D09C" strokeWidth={1.5} />
                </View>
                <View style={styles.cardTextContent}>
                  <Text style={styles.cardLabel}>Withdraw</Text>
                  <Text style={styles.cardValue}>₹ 0</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Main Actions Grid */}
        <View style={[styles.cardWrapper, styles.gridWrapper]}>
          <LinearGradient
            colors={['rgba(0, 208, 156,0.4)', 'rgba(0, 208, 156,0.02)', 'rgba(0, 208, 156,0.2)']}
            style={styles.cardGradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
          >
            <View style={[styles.card, styles.gridCard]}>
              <View style={styles.gridRow}>
                <GridItem 
                  icon={<CreditCard size={24} color="#00D09C" strokeWidth={1.5} />} 
                  label="Wallet" 
                  onPress={() => router.push('/(tabs)')} 
                />
                <GridItem 
                  icon={<XCircle size={24} color="#00D09C" strokeWidth={1.5} />} 
                  label="Integral" 
                />
                <GridItem 
                  icon={<Headphones size={24} color="#00D09C" strokeWidth={1.5} />} 
                  label="Service" 
                  onPress={() => router.push('/service')} 
                />
              </View>
              <View style={styles.gridRow}>
                <GridItem 
                  icon={<MessageSquare size={24} color="#00D09C" strokeWidth={1.5} />} 
                  label="Message" 
                  onPress={() => router.push('/messages')}
                />
                <GridItem icon={<Shield size={24} color="#00D09C" strokeWidth={1.5} />} label="Pin" />
                <View style={styles.gridItemPlaceholder} />
              </View>
              <Text style={styles.versionText}>v1.1.8</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.logoutWrapper}
          onPress={() => router.replace('/login')}
        >
          <LinearGradient
            colors={MINT_GRADIENT}
            style={styles.logoutButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const GridItem = ({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress?: () => void }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.gridItem} onPress={onPress}>
    <View style={styles.gridIconBox}>
      {icon}
    </View>
    <Text style={styles.gridLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarBorder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 2,
    marginBottom: 12,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: DARK_BG,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00D09C',
    letterSpacing: 0.5,
  },
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 16,
    boxShadow: '0px 4px 10px rgba(0, 208, 156, 0.05)',
  },
  cardGradientBorder: {
    borderRadius: 16,
    padding: 1,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 15,
    padding: 16,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTextContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  cardValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridWrapper: {
    marginTop: 4,
  },
  gridCard: {
    padding: 16,
    paddingBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridItemPlaceholder: {
    flex: 1,
  },
  gridIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '500',
  },
  versionText: {
    color: TEXT_MUTED,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
    marginRight: 4,
  },
  logoutWrapper: {
    marginTop: 16,
    borderRadius: 20,
    boxShadow: '0px 4px 10px rgba(0, 208, 156, 0.2)',
    elevation: 5,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
