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
import { formatPrice } from '../config/pricing';

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
  { id: '0-1kg', title: 'Up to 1 kg', priceFrom: 59 },
  { id: '1-5kg', title: 'Up to 5 kg', priceFrom: 73 },
  { id: '5-10kg', title: 'Up to 10 kg', priceFrom: 135 },
  { id: '10-25kg', title: 'Up to 25 kg', priceFrom: 240 },
] as const;

const CATEGORIES = ['Document', 'Box', 'Food', 'Electronics', 'Fragile', 'Other'] as const;

export const Step1Size = ({ onNext }: { onNext: () => void }) => {
  const insets = useSafeAreaInsets();
  const { parcel, updateParcel, basePrice } = useSendParcel();

  const [weightRange, setWeightRange] = useState<string | null>(parcel?.weightRange || null);
  const [size, setSize] = useState<'small' | 'medium' | 'large' | null>(parcel?.size || null);
  const [category, setCategory] = useState<string | undefined>(parcel?.category);

  const selectedWeightMeta = useMemo(() => WEIGHT_RANGES.find((w) => w.id === weightRange), [weightRange]);
  
  // VALIDATION: All 3 fields required
  const canContinue = Boolean(weightRange && size && category);

  // Smooth layout changes (opacity fades)
  const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleWeightSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animate();
    setWeightRange(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]} // Enough padding for footer
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER: Big & Bold */}
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
                  isDimmed && styles.cardDimmed, // Stable, just dimmed
                  pressed && !isDimmed && styles.cardPressed
                ]}
              >
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, isSelected && styles.redText]}>
                    {w.title}
                  </Text>
                  {/* Keep price visible to allow comparison */}
                  <Text style={[styles.cardSubtitle, isSelected && styles.redText]}>
                    From {formatPrice(w.priceFrom)}
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
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      animate();
                      setSize(s.id);
                    }}
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

        {/* --- SECTION 3: CATEGORY (Appears after Weight) --- */}
        {weightRange && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.chipGrid}>
              {CATEGORIES.map((c) => {
                const isSelected = category === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => { 
                      Haptics.selectionAsync(); 
                      setCategory(c); 
                    }}
                    style={[styles.chip, isSelected && styles.chipActive]}
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

      {/* --- UNIFIED STICKY FOOTER --- */}
      <View style={[styles.unifiedFooter, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total Estimate</Text>
          <Text style={styles.totalValue}>
            {formatPrice(basePrice || selectedWeightMeta?.priceFrom || 0)}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            updateParcel({ weightRange, size, category });
            onNext();
          }}
          disabled={!canContinue}
          style={({ pressed }) => [
            styles.continueBtn, 
            !canContinue ? styles.btnDisabled : styles.btnEnabled, 
            pressed && canContinue && styles.btnPressed
          ]}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </Pressable>
      </View>
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
    height: 72, // Fixed height for stability
  },
  cardPressed: { backgroundColor: '#F9F9F9' },
  cardSelected: { borderColor: RED_TEXT, backgroundColor: '#FFF5F5' }, // Very light red tint
  cardDimmed: { opacity: 0.5, borderColor: 'transparent', backgroundColor: '#F0F0F0' }, // Visual "de-emphasis"
  
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: TEXT, marginBottom: 2 },
  cardSubtitle: { fontSize: 14, color: MUTED },
  
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
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 12, // Slightly boxier than round pills
    borderWidth: 1, 
    borderColor: CARD_BORDER, 
    backgroundColor: '#FFF' 
  },
  chipActive: { backgroundColor: RED_BG, borderColor: RED_TEXT },
  chipLabel: { fontSize: 14, fontWeight: '500', color: TEXT },

  // Footer
  unifiedFooter: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5,
  },
  priceContainer: { flexDirection: 'column' },
  totalLabel: { fontSize: 12, color: MUTED, fontWeight: '600', textTransform: 'uppercase' },
  totalValue: { fontSize: 22, color: TEXT, fontWeight: '800', marginTop: 2 },

  continueBtn: { 
    paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14, 
    minWidth: 140, alignItems: 'center' 
  },
  btnEnabled: { backgroundColor: RED_TEXT },
  btnDisabled: { backgroundColor: '#E5E5EA' },
  btnPressed: { opacity: 0.8 },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  // Helpers
  redText: { color: RED_TEXT, fontWeight: '700' },
});