import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Package } from 'lucide-react-native';

const GREEN = '#34B67A';
const BG = '#F9FAFB';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

type TabType = 'all' | 'to-me' | 'from-me';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <Text style={styles.headerSub}>Track and manage your parcels</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color={MUTED} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search parcels..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={MUTED}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'to-me' && styles.tabActive]}
          onPress={() => setActiveTab('to-me')}>
          <Text style={[styles.tabText, activeTab === 'to-me' && styles.tabTextActive]}>
            To Me
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'from-me' && styles.tabActive]}
          onPress={() => setActiveTab('from-me')}>
          <Text style={[styles.tabText, activeTab === 'from-me' && styles.tabTextActive]}>
            From Me
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Package size={48} color={MUTED} />
          </View>
          <Text style={styles.emptyTitle}>No parcels yet</Text>
          <Text style={styles.emptyText}>
            {activeTab === 'all' && "You don't have any parcels"}
            {activeTab === 'to-me' && "No parcels coming to you"}
            {activeTab === 'from-me' && "You haven't sent any parcels"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: TEXT,
    letterSpacing: -0.5,
  },
  headerSub: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: TEXT,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  tabActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: MUTED,
    textAlign: 'center',
    maxWidth: 280,
  },
});
