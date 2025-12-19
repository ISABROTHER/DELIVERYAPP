import React, { useMemo, useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image, Animated, Platform, UIManager } from 'react-native';
import { useSendParcel } from '../context/SendParcelContext';
import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OPTIONS = [
  {
    id: '0-4kg',
    title: 'Parcel up to 4 kg',
    bullets: ['Send from anywhere', 'Insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=4kg',
    impliedSize: 'small' as const,
  },
  {
    id: '4-8kg',
    title: 'Parcel up to 8 kg',
    bullets: ['Send from anywhere', 'Insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=8kg',
    impliedSize: 'medium' as const,
  },
  {
    id: '8-16kg',
    title: 'Parcel up to 16 kg',
    bullets: ['Send from anywhere', 'Insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=16kg',
    impliedSize: 'large' as const,
  },
  {
    id: '16-32kg',
    title: 'Parcel up to 32 kg',
    bullets: ['Send from anywhere', 'Insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=32kg',
    impliedSize: 'large' as const,
  },
] as const;

// THEME: EXACT MATCH TO PROFILE SIDE (F2F2F7 BG + 60,60,67,0.18 BORDER)
const BG = '#F2F2F7'; 
const TEXT = '#111827';
const MUTED = '#6B7280';
const GREEN_TEXT = '#14532D';
const LIGHT_GREEN = '#DCFCE7';
const CARD_BORDER = 'rgba(60,60,67,0.18)';

export const Step1Size = ({ onNext }: { onNext: () => void }) => {
  const { parcel, updateParcel } = useSendParcel();
  const [selectedId, setSelectedId] = useState<string | null>(parcel?.weightRange || null);
  
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

    // Auto-advance after selection to the next phase
    setTimeout(() => onNext(), 250);
  };

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.98, duration: 80, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
        
        <Text style={styles.backLabel}>Send</Text>
        <Text style={styles.title}>Parcel in Ghana</Text>
        <Text style={styles.lead}>
          Reliable shipping across the country. Select your package weight to begin.
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
                    <Text style={[styles.rowTitle, isSelected && styles.greenText]}>{o.title}</Text>
                    <Text style={styles.bullet}>• {o.bullets[0]}</Text>
                    <Text style={styles.bullet}>• {o.bullets[1]}</Text>
                  </View>

                  <View style={styles.right}>
                    {/* PICTURE BOX ON LIGHT GREEN */}
                    <View style={styles.imageBox}>
                      <Image source={{ uri: o.imageUri }} style={styles.image} resizeMode="contain" />
                    </View>
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
  container: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },

  backLabel: { fontSize: 17, fontWeight: '600', color: GREEN_TEXT, marginBottom: 4 },
  title: { fontSize: 34, fontWeight: '800', color: TEXT, letterSpacing: -1, marginBottom: 6 },
  lead: { fontSize: 16, lineHeight: 22, fontWeight: '400', color: MUTED, marginBottom: 20 },

  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
  },

  row: { 
    flexDirection: 'row', 
    paddingVertical: 14, // Reduced height
    paddingHorizontal: 16, 
    alignItems: 'center' 
  },
  rowPressed: { backgroundColor: 'rgba(0,0,0,0.04)' },
  rowSelected: { backgroundColor: '#F0FDF4' },

  left: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 18, fontWeight: '700', color: TEXT, marginBottom: 4 },
  bullet: { fontSize: 14, color: MUTED, lineHeight: 18, marginBottom: 1 },

  right: { width: 74, alignItems: 'flex-end', justifyContent: 'center' },
  imageBox: {
    width: 70, // Smaller picture box for height reduction
    height: 70,
    borderRadius: 12,
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '80%', height: '80%' },
  
  divider: { 
    height: 1, 
    backgroundColor: CARD_BORDER, 
    marginLeft: 16 
  },
  greenText: { color: GREEN_TEXT },
});