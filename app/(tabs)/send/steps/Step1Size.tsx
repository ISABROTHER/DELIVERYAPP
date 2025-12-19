import React, { useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  ScrollView, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useSendParcel } from '../context/SendParcelContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- DESIGN TOKENS (MATCHING PROFILE) ---
const BG = '#F2F2F7'; 
const TEXT = '#111827';
const MUTED = '#6B7280';
const CARD_BG = '#FFFFFF';
const CARD_BORDER = 'rgba(60,60,67,0.18)';
const RED_BG = 'rgba(255, 59, 48, 0.12)'; 
const RED_TEXT = '#B42318';

const SIZES = [
  { id: 'small', label: 'Small', dimensions: '30×20×10 cm' },
  { id: 'medium', label: 'Medium', dimensions: '50×40×30 cm' },
  { id: 'large', label: 'Large', dimensions: '80×60×50 cm' },
] as const;

const WEIGHT_RANGES = [
  { id: '0-1kg', title: 'Up to 1 kg' },
  { id: '1-5kg', title: 'Up to 5 kg' },
  { id: '5-10kg', title: 'Up to 10 kg' },
  { id: '10-25kg', title: 'Up to 25 kg' },
] as const;

const CATEGORIES = ['Document', 'Box', 'Food', 'Electronics', 'Fragile', 'Other'] as const;

export const Step1Size = ({ onNext }: { onNext: () => void }) => {
  const insets = useSafeAreaInsets();
  const { parcel, updateParcel } = useSendParcel();

  const [weightRange, setWeightRange] = useState<string | null>(parcel?.weightRange || null);
  const [size, setSize] = useState<'small' | 'medium' | 'large' | null>(parcel?.size || null);
  const [category, setCategory] = useState<string | undefined>(parcel?.category);

  // Smooth layout changes
  const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleWeightSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animate();
    setWeightRange(id);
    // Reset subsequent steps if user changes weight to keep flow logical
    if (size) setSize(null);
    if (category) setCategory(undefined);
  };

  const handleSizeSelect = (id: 'small' | 'medium' | 'large') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animate();
    setSize(id);
    // Reset category if user changes size
    if (category) setCategory(undefined);
  };

  const handleCategorySelect = (c: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCategory(c);
    
    // Save data
    updateParcel({ weightRange, size, category: c });

    // AUTO-ADVANCE: Small delay for visual feedback, then open next step
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Text style={styles.mainHeading}>Send parcel in Ghana</Text>
        <Text style={styles.lead}>Reliable shipping across the country.</Text>

        {/* --- SECTION 1: WEIGHT --- */}
        <Text style={styles.sectionLabel}>Weight</Text>
        <View style={styles.cardsContainer}>
          {WEIGHT_RANGES.map((w) => {
            const isSelected = weightRange === w.id;
            const isDimmed = weightRange !== null && !isSelected;

            return (
              <Pressable
                key={w.id}
                onPress={() => handleWeightSelect(w.id)}
                style={({ pressed }) => [
                  styles.card, 
                  isSelected && styles.cardSelected,
                  isDimmed && styles.cardDimmed,
                  pressed && !isDimmed && styles.cardPressed
                ]}
              >
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, isSelected && styles.redText]}>
                    {w.title}
                  </Text>
                </View>

                {isSelected && (
                  <View style={styles.checkIcon}>
                     <Check size={16} color="#FFF" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* --- SECTION 2: SIZE (Appears after Weight) --- */}
        {weightRange && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Size</Text>
            <View style={styles.segmentedControl}>
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => handleSizeSelect(s.id)}
                    style={[styles.segment, isSelected && styles.segmentActive]}
                  >
                    <Text style={[styles.segmentText, isSelected && styles.redText]}>
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {size && (
              <Text style={styles.dimHint}>
                {SIZES.find(s => s.id === size)?.dimensions}
              </Text>
            )}
          </View>
        )}

        {/* --- SECTION 3: CATEGORY (Appears after Size) --- */}
        {weightRange && size && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>What are you sending?</Text>
            <View style={styles.chipGrid}>
              {CATEGORIES.map((c) => {
                const isSelected = category === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => handleCategorySelect(c)}
                    style={({ pressed }) => [
                      styles.chip, 
                      isSelected && styles.chipActive,
                      pressed && styles.chipPressed
                    ]}
                  >
                    <Text style={[styles.chipLabel, isSelected && styles.redText]}>
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12 },

  // Typography
  mainHeading: { 
    fontSize: 34, 
    fontWeight: '800', 
    color: TEXT, 
    letterSpacing: -0.5,
    marginBottom: 6 
  },
  lead: { 
    fontSize: 15, 
    color: MUTED, 
    marginBottom: 24, 
    fontWeight: '400' 
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },

  // Weight Cards
  cardsContainer: { gap: 8 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: CARD_BG, 
    padding: 16, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: CARD_BORDER, 
    borderRadius: 14,
    height: 64, // Sleek fixed height
  },
  cardPressed: { backgroundColor: '#F9F9F9' },
  cardSelected: { borderColor: RED_TEXT, backgroundColor: '#FFF5F5' },
  cardDimmed: { opacity: 0.5, borderColor: 'transparent', backgroundColor: '#F0F0F0' },
  
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '500', color: TEXT },
  
  checkIcon: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: RED_TEXT,
    alignItems: 'center', justifyContent: 'center'
  },

  // Size Segment
  section: { marginTop: 24 },
  segmentedControl: { 
    flexDirection: 'row', 
    backgroundColor: '#E3E3E8', 
    padding: 3, 
    borderRadius: 10 
  },
  segment: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  segmentActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  segmentText: { fontSize: 14, fontWeight: '500', color: TEXT },
  dimHint: { fontSize: 13, color: MUTED, textAlign: 'center', marginTop: 8, fontWeight: '500' },

  // Categories
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { 
    paddingVertical: 12, 
    paddingHorizontal: 18, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: CARD_BORDER, 
    backgroundColor: '#FFF' 
  },
  chipActive: { backgroundColor: RED_BG, borderColor: RED_TEXT },
  chipPressed: { backgroundColor: '#F5F5F5' },
  chipLabel: { fontSize: 15, fontWeight: '500', color: TEXT },

  // Helpers
  redText: { color: RED_TEXT, fontWeight: '700' },
});