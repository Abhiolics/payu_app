import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const DARK_BG = '#09080D';
const CARD_BG = '#15141A';
const TEXT_MUTED = '#888894';
const GOLD = '#E2AD51';

type Task = {
  id: number;
  tag: string;
  title: string;
  description: string;
  current?: number;
  max?: number | string;
  points: number;
  btnText: string;
  btnStyle: 'solid' | 'outline';
};

const NEWBIE_TASKS: Task[] = [
  { id: 1, tag: 'NEWBIE', title: 'New Member Tasks', description: 'Register and start trading. Once your total trading amount reaches 3000.', current: 16675, max: 30000, points: 150, btnText: 'Not Started', btnStyle: 'outline' },
  { id: 2, tag: 'NEWBIE', title: 'Join Telegram Channel Reward', description: 'Bind Telegram account and join our Telegram channel to receive reward', current: 16675, max: 30000, points: 100, btnText: 'Go to Bind', btnStyle: 'solid' },
  { id: 3, tag: 'NEWBIE', title: 'Bind Wallet Type Mobikwik Reward', description: 'You can get rewards by binding your Mobikwik wallet.', current: 0, max: 1, points: 10, btnText: 'Go to Bind', btnStyle: 'solid' }
];

const TEAM_TASKS: Task[] = [
  { id: 4, tag: 'INVITE', title: 'Invite your friends to trade!', description: 'When each referred user reaches 200000 in total trading amount and get reward 200 automatically.', max: '0 Invited', points: 0, btnText: 'Invite', btnStyle: 'solid' }
];

const DAILY_TASKS: Task[] = [
  { id: 5, tag: 'TODAY', title: 'Daily Incentive Bonus', description: 'Participate in daily trading activities. Depending on your total trading amount, you can claim rewards in the next day.', current: 0, max: 10000, points: 100, btnText: 'In Progress', btnStyle: 'solid' }
];

type TabType = 'Newbie Tasks' | 'Team Growth' | 'Daily Tasks';

export default function TasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 36 : 20) + 10;
  const [activeTab, setActiveTab] = useState<TabType>('Newbie Tasks');

  const getActiveTasks = () => {
    switch (activeTab) {
      case 'Newbie Tasks': return NEWBIE_TASKS;
      case 'Team Growth': return TEAM_TASKS;
      case 'Daily Tasks': return DAILY_TASKS;
      default: return [];
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Rewards</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          {(['Newbie Tasks', 'Team Growth', 'Daily Tasks'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tasks List */}
        <View style={styles.taskList}>
          {getActiveTasks().map(task => (
            <View key={task.id} style={styles.taskCard}>

              {/* Card Top: Tag and Progress */}
              <View style={styles.cardTop}>
                <Text style={styles.tagText}>{task.tag}</Text>

                <View style={styles.progressContainer}>
                  {typeof task.max === 'string' ? (
                    <Text style={styles.progressTextRight}>{task.max}</Text>
                  ) : (
                    <View style={styles.progressBarWrapper}>
                      <View style={styles.progressBarTrack}>
                        {task.current !== undefined && typeof task.max === 'number' && (
                          <LinearGradient
                            colors={['#F9D47D', '#C58C32']}
                            style={[styles.progressBarFill, { width: `${(task.current / task.max) * 100}%` }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        )}
                        <View style={[styles.progressThumb, { left: task.current !== undefined && typeof task.max === 'number' ? `${(task.current / task.max) * 100}%` : '0%' }]} />
                      </View>
                      <Text style={styles.progressText}>{task.current}/{task.max}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Card Middle: Title and Description */}
              <View style={styles.cardMiddle}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
              </View>

              {/* Card Bottom: Points and Button */}
              <View style={styles.cardBottom}>
                <View style={styles.pointsContainer}>
                  <Heart size={18} color={GOLD} fill={GOLD} style={{ marginRight: 6 }} />
                  <Text style={styles.pointsText}>{task.points}</Text>
                </View>

                {task.btnStyle === 'solid' ? (
                  <TouchableOpacity activeOpacity={0.8} style={styles.actionButtonWrapper}>
                    <LinearGradient
                      colors={['#F9D47D', '#E2AD51', '#C58C32']}
                      style={styles.actionButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.actionButtonText}>{task.btnText}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity activeOpacity={0.8} style={styles.actionButtonOutline}>
                    <Text style={styles.actionButtonTextOutline}>{task.btnText}</Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          ))}
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
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#1C1A24', // slightly lighter than card bg
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: 'rgba(226,173,81,0.15)',
  },
  segmentText: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: GOLD,
    fontWeight: '600',
  },
  taskList: {
    gap: 16,
  },
  taskCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tagText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 20,
  },
  progressBarWrapper: {
    width: 140, // fixed width for progress bar similar to image
    alignItems: 'flex-end',
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: GOLD,
    position: 'absolute',
    transform: [{ translateX: -6 }],
  },
  progressText: {
    color: TEXT_MUTED,
    fontSize: 10,
  },
  progressTextRight: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '500',
  },
  cardMiddle: {
    marginBottom: 20,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  taskDescription: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 18,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  actionButtonWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
  actionButtonOutline: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(226,173,81,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonTextOutline: {
    color: GOLD,
    fontSize: 13,
    fontWeight: '600',
  },
});
