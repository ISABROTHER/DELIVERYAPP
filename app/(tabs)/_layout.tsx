import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Package, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react-native';

const GREEN = '#34B67A';
const BG = '#F9FAFB';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const BORDER = '#E5E5EA';

type TabType = 'all' | 'to-me' | 'from-me';

type Shipment = {
  id: string;
  trackingId: string;
  status: 'In Transit' | 'Delivered' | 'Pending';
  origin: string;
  destination: string;
  type: 'to-me' | 'from-me';
  date: string;
};

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    trackingId: 'SHIP-123456',
    status: 'In Transit',
    origin: 'Accra, Central',
    destination: 'Kumasi, Ashanti',
    type: 'from-me',
    date: 'Dec 18, 2025',
  },
  {
    id: '2',
    trackingId: 'SHIP-789012',
    status: 'Delivered',
    origin: 'Lagos, Nigeria',
    destination: 'Abuja, Nigeria',
    type: 'to-me',
    date: 'Dec 15, 2025',
  },
  {
    id: '3',
    trackingId: 'SHIP-456789',
    status: 'Pending',
    origin: 'Cape Coast, Central',
    destination: 'Takoradi, Western',
    type: 'from-me',
    date: 'Dec 19, 2025',
  },
];

function StatusBadge({ status }: { status: Shipment['status'] }) {
  const getColors = () => {
    switch (status) {
      case 'In Transit':
        return { bg: 'rgba(52, 182, 122, 0.1)', text: GREEN, icon: <Clock size={12} color={GREEN} /> };
      case 'Delivered':
        return { bg: '#F3F4F6', text: MUTED, icon: <CheckCircle2 size={12} color={MUTED} /> };
      default:
        return { bg: '#FEF3C7', text: '#D97706', icon: <Clock size={12} color="#D97706" /> };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      {colors.icon}
      <Text style={[styles.badgeText, { color: colors.text }]}>{status}</Text>
    </View>
  );
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.trackingInfo}>
          <Text style={styles.trackingLabel}>Tracking ID</Text>
          <Text style={styles.trackingId}>{shipment.trackingId}</Text>
        </View>
        <StatusBadge status={shipment.status} />
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <MapPin size={16} color={MUTED} />
          <Text style={styles.routeText} numberOfLines={1}>{shipment.origin}</Text>
        </View>
        <ArrowRight size={16} color={BORDER} style={styles.routeArrow} />
        <View style={styles.routePoint}>
          <MapPin size={16} color={GREEN} />
          <Text style={styles.routeText} numberOfLines={1}>{shipment.destination}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{shipment.date}</Text>
        <Text style={styles.typeText}>{shipment.type === 'to-me' ? 'Receiving' : 'Sent'}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredShipments = useMemo(() => {
    return MOCK_SHIPMENTS.filter((s) => {
      const matchesTab = activeTab === 'all' || s.type === activeTab;
      const matchesSearch = 
        s.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

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
        {(['all', 'to-me', 'from-me'] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'all' ? 'All' : tab === 'to-me' ? 'To Me' : 'From Me'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredShipments.length > 0 ? (
          filteredShipments.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Package size={48} color={MUTED} />
            </View>
            <Text style={styles.emptyTitle}>No parcels found</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : activeTab === 'all' 
                  ? "You don't have any parcels yet" 
                  : activeTab === 'to-me' 
                    ? "No parcels coming to you" 
                    : "You haven't sent any parcels"}
            </Text>
          </View>
        )}
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
    borderColor: BORDER,
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
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  tabActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  tabText: {
    fontSize: 13,
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
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  trackingInfo: {
    gap: 2,
  },
  trackingLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: MUTED,
    textTransform: 'uppercase',
  },
  trackingId: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  routePoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT,
    flex: 1,
  },
  routeArrow: {
    paddingHorizontal: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: MUTED,
    fontWeight: '500',
  },
  typeText: {
    fontSize: 12,
    color: GREEN,
    fontWeight: '700',
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