import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link2, ClipboardList, Users, Receipt } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

const actions = [
  { id: 'usdt', title: 'USDT', icon: Link2, badge: '11 INR' },
  { id: 'task', title: 'Task', icon: ClipboardList },
  { id: 'teams', title: 'Team', icon: Users },
  { id: 'order', title: 'Order', icon: Receipt },
];

export default function ActionButtons() {
  const router = useRouter();

  const handlePress = (id: string) => {
    if (id === 'teams') {
      router.push('/teams');
    } else if (id === 'task') {
      router.push('/tasks');
    } else if (id === 'order') {
      router.push('/buy-orders');
    } else {
      console.log(`Action ${id} pressed`);
    }
  };

  return (
    <View style={styles.container}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isActive = index === 0; // Highlight the first one based on screenshot
        
        return (
          <View key={action.id} style={styles.actionItem}>
            {action.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{action.badge}</Text>
              </View>
            )}
            <TouchableOpacity 
              onPress={() => handlePress(action.id)}
              activeOpacity={0.7}
              style={[
                styles.iconContainer, 
                isActive && styles.iconContainerActive
              ]}
            >
              <Icon 
                size={24} 
                color={isActive ? Colors.primary : Colors.textMuted} 
              />
            </TouchableOpacity>
            <Text style={styles.title}>{action.title}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  actionItem: {
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  iconContainerActive: {
    borderColor: Colors.primary,
  },
  title: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
