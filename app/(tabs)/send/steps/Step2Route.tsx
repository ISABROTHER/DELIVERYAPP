import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { MapPin, ArrowRight, Package } from 'lucide-react-native';
import { useSendParcel } from '../context/SendParcelContext';
import { ContinueButton } from '../components/ContinueButton';

const GREEN = '#34B67A';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const BORDER = '#E5E5EA';

export function Step2Route({ onNext }: { onNext: () => void }) {
  const { route, updateRoute, parcel } = useSendParcel();

  const handleUpdate = (type: 'origin' | 'destination', field: string, value: string) => {
    const currentRoute = route || {
      origin: { region: '', cityTown: '' },
      destination: { region: '', cityTown: '' },
    };

    updateRoute({
      ...currentRoute,
      [type]: {
        ...currentRoute[type],
        [field]: value,
      },
    });
  };

  const isComplete = 
    route?.origin?.cityTown && 
    route?.origin?.region && 
    route?.destination?.cityTown && 
    route?.destination?.region;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Delivery Route</Text>
          <Text style={styles.subtitle}>Where is the parcel going?</Text>
        </View>

        {/* Parcel Preview Vibe */}
        <View style={styles.previewCard}>
          <View style={styles.previewIcon}>
            <Package size={20} color={GREEN} />
          </View>
          <View>
            <Text style={styles.previewLabel}>Selected Size</Text>
            <Text style={styles.previewValue}>
              {parcel?.size ? parcel.size.charAt(0).toUpperCase() + parcel.size.slice(1) : 'Not selected'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.dot, { backgroundColor: MUTED }]} />
            <Text style={styles.sectionTitle}>Pickup Location</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Region (e.g. Greater Accra)"
              value={route?.origin?.region}
              onChangeText={(v) => handleUpdate('origin', 'region', v)}
              placeholderTextColor={MUTED}
            />
            <TextInput
              style={styles.input}
              placeholder="City or Town"
              value={route?.origin?.cityTown}
              onChangeText={(v) => handleUpdate('origin', 'cityTown', v)}
              placeholderTextColor={MUTED}
            />
          </View>
        </View>

        <View style={styles.connector}>
          <View style={styles.line} />
          <ArrowRight size={20} color={BORDER} />
          <View style={styles.line} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.dot, { backgroundColor: GREEN }]} />
            <Text style={styles.sectionTitle}>Drop-off Location</Text>
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Region (e.g. Ashanti)"
              value={route?.destination?.region}
              onChangeText={(v) => handleUpdate('destination', 'region', v)}
              placeholderTextColor={MUTED}
            />
            <TextInput
              style={styles.input}
              placeholder="City or Town"
              value={route?.destination?.cityTown}
              onChangeText={(v) => handleUpdate('destination', 'cityTown', v)}
              placeholderTextColor={MUTED}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton
          onPress={onNext}
          disabled={!isComplete}
          label="Next: Handover Method"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: TEXT,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: MUTED,
    marginTop: 4,
    fontWeight: '500',
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(52, 182, 122, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: MUTED,
    textTransform: 'uppercase',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: TEXT,
    fontWeight: '600',
  },
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
    borderStyle: 'dashed',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
});