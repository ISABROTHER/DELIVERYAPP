import React, { useMemo, useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image, Animated, Platform, UIManager } from 'react-native';
import { useSendParcel } from '../context/SendParcelContext';
import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OPTIONS = [
  {
    id: '1-5kg',
    title: 'Parcel up to 5 kg',
    within: 'Within 35 × 25 × 12 cm',
    bullets: ['Send from mailbox or parcel box', 'Compensation up to 2 500 kr'],
    fromLabel: 'From 73 kr',
    imageUri: 'https://placehold.co/220x220/E8F5E9/2E7D32/png?text=5kg',
    impliedSize: 'small' as const,
  },
  {
    id: '5-10kg',
    title: 'Parcel up to 10 kg',
    within: 'Within 120 × 60 × 60 cm',
    bullets: ['Possibility for larger packages', 'Compensation up to 10 000 kr'],
    fromLabel: 'From 135 kr',
    imageUri: 'https://placehold.co/220x220/E8F5E9/2E7D32/png?text=10kg',
    impliedSize: 'medium' as const,
  },
  {
    id: '10-25kg',
    title: 'Parcel up to 25 kg',
    within: 'Within 120 × 60 × 60 cm',
    bullets: ['Possibility for larger packages', 'Compensation up to 10 000 kr'],
    fromLabel: 'From 240 kr',
    imageUri: 'https://placehold.co/220x220/E8F5E9/2E7D32/png?text=25kg',
    impliedSize: 'large' as const,
  },
] as const;

// THEME: MATCHING PROFILE SIDE
const BG = '#F2F2F7'; 
const TEXT = '#111827';
const MUTED = '#6B7280';
const GREEN_TEXT = '#1F7A4E';
const GREEN_BG = 'rgba(52, 182, 122, 0.15)';
const CARD_BORDER = 'rgba(60,60,67,0.18)';

export const Step1Size = ({ onNext }: { onNext: () => void }) => {
  const { parcel, updateParcel } = useSendParcel();
  const [selectedId, setSelectedId] = useState<string | null>(parcel?.weightRange || null);
  
  // Animation scale
  const scale = useRef(new Animated.Value(1)).current;

  const selectOption = (id: string) => {
    Haptics.selectionAsync();
    setSelectedId(id);
    const opt = OPTIONS.find((o) => o.id === id);
    if (!opt) return;

    updateParcel({
      weightRange: opt.id,
      size: opt.impliedSize,
      category: undefined,
    });

    setTimeout(() => onNext(), 300);
  };

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.98, duration: 100, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* HEADER: Corrected Font Hierarchy */}
        <Text style={styles.backLabel}>Send</Text>
        <Text style={styles.title}>Parcel in Ghana</Text>
        <Text style={styles.lead}>
          Reliable shipping across the country. Tracking and insurance included by default.
        </Text>

        <View style={styles.list}>
          {OPTIONS.map((o, idx) => {
            const isSelected = selectedId === o.id;

            return (
              <Animated.View key={o.id} style={isSelected ? { transform: [{ scale }] } : null}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => selectOption(o.id)}
                  style={({ pressed }) => [
                    styles.row,
                    isSelected && styles.rowSelected,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <View style={styles.left}>
                    <Text style={styles.rowTitle}>{o.title}</Text>
                    <Text style={styles.rowWithin}>{o.within}</Text>

                    <Text style={styles.bullet}>• {o.bullets[0]}</Text>
                    <Text style={styles.bullet}>• {o.bullets[1]}</Text>
                  </View>

                  <View style={styles.right}>
                    <View style={styles.imageBox}>
                      <Image source={{ uri: o.imageUri }} style={styles.image} resizeMode="contain" />
                    </View>
                    <Text style={styles.from}>{o.fromLabel}</Text>
                  </View>
                </Pressable>
                {idx !== OPTIONS.length - 1 && <View style={styles.divider} />}
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG }, // iOS Grouped BG
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30 },

  backLabel: { fontSize: 17, fontWeight: '600', color: GREEN_TEXT, marginBottom: 8 },
  title: { fontSize: 34, fontWeight: '800', color: TEXT, letterSpacing: -1, marginBottom: 10 },
  lead: { fontSize: 16, lineHeight: 22, fontWeight: '400', color: MUTED, marginBottom: 24 },

  row: { flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 4, borderRadius: 12 },
  rowPressed: { backgroundColor: 'rgba(0,0,0,0.04)' }, // Matching ProfileRow
  rowSelected: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: CARD_BORDER }, // Matches Section Cards

  left: { flex: 1, paddingRight: 8 },
  rowTitle: { fontSize: 18, fontWeight: '700', color: TEXT, marginBottom: 4 },
  rowWithin: { fontSize: 14, fontWeight: '600', color: TEXT, marginBottom: 8 },
  bullet: { fontSize: 14, color: MUTED, lineHeight: 20, marginBottom: 2 },

  right: { width: 110, alignItems: 'flex-end', justifyContent: 'center' },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 14, // Matches Card Radius
    backgroundColor: GREEN_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  image: { width: '80%', height: '80%' },
  from: { fontSize: 16, fontWeight: '800', color: GREEN_TEXT },
  divider: { height: 1, backgroundColor: CARD_BORDER, marginVertical: 8, marginHorizontal: 4 },
});