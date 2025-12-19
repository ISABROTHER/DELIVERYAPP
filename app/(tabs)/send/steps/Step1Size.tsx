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
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SIZES = [
  { id: 'small', label: 'Small', dimensions: '30×20×10 cm' },
  { id: 'medium', label: 'Medium', dimensions: '50×40×30 cm' },
  { id: 'large', label: 'Large', dimensions: '80×60×50 cm' },
] as const;

const WEIGHT_RANGES = [
  { id: '0-1kg', title: 'Up to 1 kg', within: '25×20×10 cm', priceFrom: 59 },
  { id: '1-5kg', title: 'Up to 5 kg', within: '35×25×12 cm', priceFrom: 73 },
  { id: '5-10kg', title: 'Up to 10 kg', within: '120×60×60 cm', priceFrom: 135 },
  { id: '10-25kg', title: 'Up to 25 kg', within: '120×60×60 cm', priceFrom: 240 },
] as const;

const CATEGORIES = ['Document', 'Box', 'Food', 'Electronics', 'Fragile', 'Other'] as const;

const BG = '#F8FAFB';
const TEXT = '#0B1220';
const MUTED = '#6A767E';
const BORDER = '#EDF1F3';
const GREEN = '#2E7D32';
const LIGHT_GREEN = '#E8F5E9';

export const Step1Size = ({ onNext }: { onNext: () => void }) => {
  const insets = useSafeAreaInsets();
  const { parcel, updateParcel, basePrice } = useSendParcel();

  const [weightRange, setWeightRange] = useState<string | null>(parcel?.weightRange || null);
  const [size, setSize] = useState<'small' | 'medium' | 'large' | null>(parcel?.size || null);
  const [category, setCategory] = useState<string | undefined>(parcel?.category);
  const [showCategory, setShowCategory] = useState(false);

  const selectedWeightMeta = useMemo(() => WEIGHT_RANGES.find((w) => w.id === weightRange), [weightRange]);
  const canContinue = Boolean(weightRange && size);

  const animate = () => {
    LayoutAnimation.configureNext({
      duration: 350,
      update: { type: 'spring', springDamping: 0.8 },
      delete: { type: 'fade' }
    });
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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 180 }]} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Parcel in Norway</Text>
        <Text style={styles.lead}>Reliable shipping. Tracking and insurance included.</Text>

        <View style={styles.cardsContainer}>
          {WEIGHT_RANGES.map((w) => {
            const isSelected = weightRange === w.id;
            const isAnySelected = weightRange !== null;
            
            // Modern UX: If another card is selected, this card "collapses"
            const isCollapsed = isAnySelected && !isSelected;

            return (
              <Pressable
                key={w.id}
                onPress={() => handleWeightSelect(w.id)}
                style={[
                  styles.card, 
                  isSelected && styles.cardSelected,
                  isCollapsed && styles.cardCollapsed
                ]}
              >
                <View style={styles.cardInfo}>
                  <Text style={[
                    styles.cardTitle, 
                    isSelected && styles.selectedText,
                    isCollapsed && styles.collapsedTitle
                  ]}>
                    {w.title}
                  </Text>
                  
                  {!isCollapsed && (
                    <Text style={styles.cardSubtitle}>{w.within}</Text>
                  )}
                </View>

                {/* Hide price tag for collapsed cards to save horizontal and vertical space */}
                {!isCollapsed && (
                  <View style={[styles.priceTag, isSelected && styles.priceTagSelected]}>
                    <Text style={[styles.priceLabel, isSelected && styles.whiteText]}>From</Text>
                    <Text style={[styles.priceValue, isSelected && styles.whiteText]}>{formatPrice(w.priceFrom)}</Text>
                  </View>
                )}
                
                {isCollapsed && (
                    <Text style={styles.changeText}>Change</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {weightRange && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Package Size</Text>
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
                    <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>{s.label}</Text>
                    {isSelected && <Text style={styles.segmentDetail}>{s.dimensions.split(' ')[0]}</Text>}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {weightRange && (
          <View style={styles.section}>
            <Pressable 
              style={styles.expandRow} 
              onPress={() => { animate(); setShowCategory(!showCategory); }}
            >
              <Text style={styles.sectionLabel}>Contents Category</Text>
              <Text style={styles.optionalBtn}>{showCategory ? 'Close' : 'Optional'}</Text>
            </Pressable>
            {showCategory && (
              <View style={styles.chipGrid}>
                {CATEGORIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => { Haptics.selectionAsync(); setCategory(category === c ? undefined : c); }}
                    style={[styles.chip, category === c && styles.chipActive]}
                  >
                    <Text style={[styles.chipLabel, category === c && styles.chipLabelActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.footerContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {canContinue && (
          <View style={styles.summaryToast}>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryTitle}>Total Price</Text>
              <Text style={styles.summarySub}>{selectedWeightMeta?.title} • {size?.toUpperCase()}</Text>
            </View>
            <Text style={styles.summaryPrice}>
              {formatPrice(basePrice || selectedWeightMeta?.priceFrom || 0)}
            </Text>
          </View>
        )}

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
  content: { padding: 20 },

  title: { fontSize: 34, fontWeight: '800', color: TEXT, letterSpacing: -1 },
  lead: { fontSize: 16, color: MUTED, marginTop: 8, lineHeight: 22, fontWeight: '500' },

  cardsContainer: { marginTop: 20, gap: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: { borderColor: GREEN },
  cardCollapsed: {
    paddingVertical: 10, // Slimmer vertical profile
    paddingHorizontal: 16,
    backgroundColor: '#F1F3F5',
    opacity: 0.7,
    borderWidth: 0,
    shadowOpacity: 0, // Remove shadow for collapsed cards to emphasize depth of the selected one
    elevation: 0,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: TEXT, letterSpacing: -0.5 },
  collapsedTitle: { fontSize: 14, color: MUTED, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, color: MUTED, fontWeight: '600', marginTop: 2 },
  
  priceTag: { 
    backgroundColor: '#F2F4F5', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 14, 
    alignItems: 'center' 
  },
  priceTagSelected: { backgroundColor: GREEN },
  priceLabel: { fontSize: 9, fontWeight: '800', color: MUTED, textTransform: 'uppercase' },
  priceValue: { fontSize: 16, fontWeight: '900', color: TEXT },
  changeText: { fontSize: 12, fontWeight: '700', color: GREEN },

  section: { marginTop: 24 },
  sectionLabel: { fontSize: 17, fontWeight: '800', color: TEXT, letterSpacing: -0.4 },
  
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E2E4E7',
    padding: 4,
    borderRadius: 18,
    marginTop: 12,
  },
  segment: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 14 },
  segmentActive: { backgroundColor: '#FFF', elevation: 2 },
  segmentText: { fontSize: 14, fontWeight: '700', color: MUTED },
  segmentTextActive: { color: GREEN },
  segmentDetail: { fontSize: 10, color: MUTED, marginTop: 2 },

  expandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionalBtn: { fontSize: 14, fontWeight: '700', color: GREEN },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: BORDER, backgroundColor: '#FFF' },
  chipActive: { backgroundColor: LIGHT_GREEN, borderColor: GREEN },
  chipLabel: { fontSize: 14, fontWeight: '600', color: TEXT },
  chipLabelActive: { color: GREEN },

  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  summaryToast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: TEXT,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  summaryTextGroup: { flex: 1 },
  summaryTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  summarySub: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  summaryPrice: { color: '#FFF', fontSize: 20, fontWeight: '900' },

  continueBtn: { height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  btnEnabled: { backgroundColor: GREEN },
  btnDisabled: { backgroundColor: '#E0E5E8' },
  btnPressed: { transform: [{ scale: 0.98 }] },
  continueBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },

  selectedText: { color: GREEN },
  whiteText: { color: '#FFF' },
});