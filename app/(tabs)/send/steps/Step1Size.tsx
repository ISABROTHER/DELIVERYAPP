import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  ScrollView, 
  LayoutAnimation, 
  Platform, 
  UIManager,
  Image
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useSendParcel } from '../context/SendParcelContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- NEW THEME: LIGHT GREEN ---
const BG = '#F2F2F7'; 
const TEXT = '#111827';
const MUTED = '#6B7280';
const CARD_BG = '#FFFFFF';
const CARD_BORDER = 'rgba(60,60,67,0.18)';

// The "Picture Box" Green Theme
const GREEN_BG = '#DCFCE7'; // Light green background for boxes
const GREEN_BORDER = '#15803D'; // Darker green for selection/text
const GREEN_TEXT = '#14532D'; // Deep green for text

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

// Added placeholder images for the "Picture Box" effect
const CATEGORIES = [
  { id: 'Document', label: 'Document', image: 'https://placehold.co/100x100/15803D/FFFFFF/png?text=Doc' },
  { id: 'Box', label: 'Box', image: 'https://placehold.co/100x100/15803D/FFFFFF/png?text=Box' },
  { id: 'Food', label: 'Food', image: 'https://placehold.co/100x100/15803D/FFFFFF/png?text=Food' },
  { id: 'Electronics', label: 'Electronics', image: 'https://placehold.co/100x100/15803D/FFFFFF/png?text=Elec' },
  { id: 'Fragile', label: 'Fragile', image: 'https://placehold.co/100x100/15803D/FFFFFF/png?text=Fragile' },
  { id: 'Other', label: 'Other', image: 'https://placehold.co/100x100/15803D/FFFFFF/png?text=Other' },
] as const;

export const Step1Size = ({ onNext }: { onNext: () => void }) => {
  const insets = useSafeAreaInsets();
  const { parcel, updateParcel } = useSendParcel();

  const [weightRange, setWeightRange] = useState<string | null>(parcel?.weightRange || null);
  const [size, setSize] = useState<'small' | 'medium' | 'large' | null>(parcel?.size || null);
  const [category, setCategory] = useState<string | undefined>(parcel?.category);

  const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleWeightSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animate();
    setWeightRange(id);
    if (size) setSize(null);
    if (category) setCategory(undefined);
  };

  const handleSizeSelect = (id: 'small' | 'medium' | 'large') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animate();
    setSize(id);
    if (category) setCategory(undefined);
  };

  const handleCategorySelect = (c: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCategory(c);
    updateParcel({ weightRange, size, category: c });

    // AUTO-ADVANCE: Move to next step automatically
    setTimeout(() => {
      onNext();
    }, 250);
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
        <Text style={styles.lead}>Select your package details.</Text>

        {/* --- SECTION 1: WEIGHT (List Cards) --- */}
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
                <Text style={[styles.cardTitle, isSelected && styles.greenText]}>
                  {w.title}
                </Text>

                {isSelected && (
                  <View style={styles.checkIcon}>
                     <Check size={14} color="#FFF" strokeWidth={4} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* --- SECTION 2: SIZE (Segmented) --- */}
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
                    <Text style={[styles.segmentText, isSelected && styles.greenText]}>
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

        {/* --- SECTION 3: CATEGORY (Picture Boxes) --- */}
        {weightRange && size && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>What are you sending?</Text>
            <View style={styles.grid}>
              {CATEGORIES.map((c) => {
                const isSelected = category === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => handleCategorySelect(c.id)}
                    style={({ pressed }) => [
                      styles.gridItem,
                      pressed && styles.gridItemPressed,
                      isSelected && styles.gridItemSelected
                    ]}
                  >
                    {/* PICTURE BOX ON LIGHT GREEN */}
                    <View style={[styles.imageBox, isSelected && styles.imageBoxSelected]}>
                      <Image 
                        source={{ uri: c.image }} 
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={[styles.gridLabel, isSelected && styles.greenText]}>
                      {c.label}
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
    fontSize: 32, 
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
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
  },

  // Weight Cards
  cardsContainer: { gap: 10 },
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: CARD_BG, 
    paddingHorizontal: 20, 
    paddingVertical: 18, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: CARD_BORDER, 
    borderRadius: 16,
  },
  cardPressed: { backgroundColor: '#F9F9F9' },
  cardSelected: { borderColor: GREEN_BORDER, backgroundColor: '#F0FDF4' },
  cardDimmed: { opacity: 0.5, backgroundColor: '#FAFAFA' },
  cardTitle: { fontSize: 17, fontWeight: '500', color: TEXT },
  
  checkIcon: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: GREEN_BORDER,
    alignItems: 'center', justifyContent: 'center'
  },

  // Size Segment
  section: { marginTop: 28 },
  segmentedControl: { 
    flexDirection: 'row', 
    backgroundColor: '#E5E7EB', 
    padding: 3, 
    borderRadius: 12 
  },
  segment: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  segmentActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  segmentText: { fontSize: 15, fontWeight: '500', color: TEXT },
  dimHint: { fontSize: 13, color: MUTED, textAlign: 'center', marginTop: 8, fontWeight: '500' },

  // Grid / Picture Boxes
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12 
  },
  gridItem: { 
    width: '31%', // roughly 3 columns
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  gridItemPressed: { opacity: 0.7 },
  
  // THE PICTURE BOX
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: GREEN_BG, // LIGHT GREEN BACKGROUND
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  imageBoxSelected: {
    borderColor: GREEN_BORDER,
    borderWidth: 2,
  },
  image: {
    width: '60%',
    height: '60%',
    opacity: 0.8, // subtle blend
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT,
    textAlign: 'center',
  },
  gridItemSelected: {
    // optional additional styling for the whole item
  },

  // Helpers
  greenText: { color: GREEN_TEXT, fontWeight: '700' },
});