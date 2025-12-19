import React, { useMemo, useState } from 'react';
import { 
  View, Text, Pressable, StyleSheet, ScrollView, 
  LayoutAnimation, Platform, UIManager 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// COLORS COPIED FROM PROFILE COMPONENTS
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
  { id: '0-1kg', title: 'Up to 1 kg', within: '25×20×10 cm', priceFrom: 59 },
  { id: '1-5kg', title: 'Up to 5 kg', within: '35×25×12 cm', priceFrom: 73 },
  { id: '5-10kg', title: 'Up to 10 kg', within: '120×60×60 cm', priceFrom: 135 },
  { id: '10-25kg', title: 'Up to 25 kg', within: '120×60×60 cm', priceFrom: 240 },
] as const;

const CATEGORIES = ['Document', 'Box', 'Food', 'Electronics', 'Fragile', 'Other'] as const;

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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 180 }]} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Parcel in Norway</Text>
        <Text style={styles.lead}>Reliable shipping across the country. Tracking and insurance included.</Text>

        <View style={styles.cardsContainer}>
          {WEIGHT_RANGES.map((w) => {
            const isSelected = weightRange === w.id;
            const isAnySelected = weightRange !== null;
            const isCollapsed = isAnySelected && !isSelected;

            return (
              <Pressable
                key={w.id}
                onPress={() => handleWeightSelect(w.id)}
                style={({ pressed }) => [
                  styles.card, 
                  isSelected && styles.cardSelected,
                  isCollapsed && styles.cardCollapsed,
                  pressed && styles.cardPressed
                ]}
              >
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, isSelected && styles.selectedText, isCollapsed && styles.collapsedTitle]}>
                    {w.title}
                  </Text>
                  {!isCollapsed && <Text style={styles.cardSubtitle}>{w.within}</Text>}
                </View>

                {!isCollapsed && (
                  <View style={[styles.priceBadge, isSelected && styles.priceBadgeActive]}>
                    <Text style={[styles.priceValue, isSelected && styles.whiteText]}>{formatPrice(w.priceFrom)}</Text>
                  </View>
                )}
                
                {isCollapsed && <ChevronRight size={18} color={MUTED} strokeWidth={2} />}
              </Pressable>
            );
          })}
        </View>

        {weightRange && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Package Size</Text>
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
                  </Pressable>
                );
              })}
            </View>
            {size && <Text style={styles.dimHint}>{SIZES.find(s => s.id === size)?.dimensions}</Text>}
          </View>
        )}

        {weightRange && (
          <View style={styles.section}>
            <Pressable style={styles.expandRow} onPress={() => { animate(); setShowCategory(!showCategory); }}>
              <Text style={styles.sectionTitle}>Category</Text>
              <Text style={styles.optionalBtn}>{showCategory ? 'Hide' : 'Optional'}</Text>
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

      <View style={[styles.footerContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {canContinue && (
          <View style={styles.summaryToast}>
             <Text style={styles.summarySub}>{selectedWeightMeta?.title} • {size?.toUpperCase()}</Text>
             <Text style={styles.summaryPrice}>{formatPrice(basePrice || selectedWeightMeta?.priceFrom || 0)}</Text>
          </View>
        )}
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            updateParcel({ weightRange, size, category });
            onNext();
          }}
          disabled={!canContinue}
          style={({ pressed }) => [styles.continueBtn, !canContinue ? styles.btnDisabled : styles.btnEnabled, pressed && canContinue && styles.btnPressed]}
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
  content: { paddingHorizontal: 16, paddingTop: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '400', color: '#6D6D72', marginBottom: 8, marginLeft: 16, textTransform: 'uppercase' },
  lead: { fontSize: 15, color: MUTED, marginLeft: 16, marginBottom: 16, fontWeight: '400' },
  cardsContainer: { gap: 8 },
  card: { flexDirection: 'row', backgroundColor: CARD_BG, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: CARD_BORDER, borderRadius: 14 },
  cardPressed: { backgroundColor: 'rgba(0,0,0,0.04)' },
  cardSelected: { borderColor: RED_TEXT, borderWidth: 1.5 },
  cardCollapsed: { paddingVertical: 12, backgroundColor: CARD_BG, opacity: 0.6 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '400', color: TEXT },
  collapsedTitle: { fontSize: 15, color: MUTED },
  cardSubtitle: { fontSize: 13, color: MUTED, marginTop: 2 },
  priceBadge: { backgroundColor: RED_BG, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  priceBadgeActive: { backgroundColor: RED_TEXT },
  priceValue: { fontSize: 13, fontWeight: '500', color: RED_TEXT },
  whiteText: { color: '#FFFFFF' },
  section: { marginTop: 24 },
  segmentedControl: { flexDirection: 'row', backgroundColor: '#E3E3E8', padding: 2, borderRadius: 9, marginHorizontal: 8 },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 7 },
  segmentActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  segmentText: { fontSize: 13, fontWeight: '500', color: TEXT },
  segmentTextActive: { fontWeight: '600' },
  dimHint: { fontSize: 12, color: MUTED, textAlign: 'center', marginTop: 8 },
  expandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 },
  optionalBtn: { fontSize: 14, fontWeight: '400', color: RED_TEXT },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingHorizontal: 16 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: CARD_BORDER, backgroundColor: '#FFF' },
  chipActive: { backgroundColor: RED_BG, borderColor: RED_TEXT },
  chipLabel: { fontSize: 14, color: TEXT },
  chipLabelActive: { color: RED_TEXT, fontWeight: '600' },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingTop: 12, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: CARD_BORDER },
  summaryToast: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: RED_BG, padding: 12, borderRadius: 12, marginBottom: 12 },
  summarySub: { color: RED_TEXT, fontSize: 13, fontWeight: '600' },
  summaryPrice: { color: RED_TEXT, fontSize: 17, fontWeight: '700' },
  continueBtn: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnEnabled: { backgroundColor: RED_TEXT },
  btnDisabled: { backgroundColor: '#C7C7CC' },
  btnPressed: { opacity: 0.8 },
  continueBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  selectedText: { color: RED_TEXT, fontWeight: '600' },
});