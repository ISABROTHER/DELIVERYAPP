import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useSendParcel } from '../context/SendParcelContext';
import * as Haptics from 'expo-haptics';

const OPTIONS = [
  {
    id: 'up-to-4kg',
    title: 'Parcel up to 4 kg',
    bullets: ['Send from anywhere', 'Insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=4kg',
    impliedSize: 'small' as const,
  },
  {
    id: 'up-to-8kg',
    title: 'Parcel up to 8 kg',
    bullets: ['Send from anywhere', 'Insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=8kg',
    impliedSize: 'medium' as const,
  },
  {
    id: 'up-to-16kg',
    title: 'Parcel up to 16 kg',
    bullets: ['Send from anywhere', 'Insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=16kg',
    impliedSize: 'large' as const,
  },
  {
    id: 'over-25kg',
    title: 'Parcel over 25 kg',
    bullets: ['Send from anywhere', 'Insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=25%2Bkg',
    impliedSize: 'large' as const,
  },
  {
    id: 'unknown-size',
    title: "I don't know the weight",
    bullets: ['We will help you later', 'Standard insurance included'],
    imageUri: 'https://placehold.co/200x200/DCFCE7/15803D/png?text=%3F',
    impliedSize: 'medium' as const,
  },
] as const;

export const Step1Size = ({ onNext }: { onNext: () => void }) => {
  const { updateParcel } = useSendParcel();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectOption = (id: string) => {
    Haptics.selectionAsync();
    setSelectedId(id);
    const opt = OPTIONS.find((o) => o.id === id);
    if (!opt) return;

    updateParcel({
      weightRange: opt.id,
      size: opt.impliedSize,
    });

    // Selecting an option triggers the roll-up of Step 2
    setTimeout(() => {
      onNext();
      setSelectedId(null); // Reset selection so it's clean if we come back
    }, 250);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.backLabel}>Send</Text>
        <Text style={styles.title}>Parcel in Ghana</Text>
        <Text style={styles.lead}>
          Reliable shipping across the country. Select your package weight to begin.
        </Text>

        <View style={styles.list}>
          {OPTIONS.map((o, idx) => {
            const isSelected = selectedId === o.id;

            return (
              <View key={o.id}>
                <Pressable
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
                    <View style={styles.imageBox}>
                      <Image source={{ uri: o.imageUri }} style={styles.image} resizeMode="contain" />
                    </View>
                  </View>
                </Pressable>
                {idx !== OPTIONS.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  backLabel: { fontSize: 17, fontWeight: '600', color: '#14532D', marginBottom: 4 },
  title: { fontSize: 34, fontWeight: '800', color: '#111827', letterSpacing: -1, marginBottom: 6 },
  lead: { fontSize: 16, lineHeight: 22, fontWeight: '400', color: '#6B7280', marginBottom: 20 },
  list: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(60,60,67,0.18)', overflow: 'hidden' },
  row: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' },
  rowPressed: { backgroundColor: 'rgba(0,0,0,0.04)' },
  rowSelected: { backgroundColor: '#F0FDF4' },
  left: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  bullet: { fontSize: 14, color: '#6B7280', lineHeight: 18, marginBottom: 1 },
  right: { width: 74, alignItems: 'flex-end', justifyContent: 'center' },
  imageBox: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
  image: { width: '80%', height: '80%' },
  divider: { height: 1, backgroundColor: 'rgba(60,60,67,0.18)', marginLeft: 16 },
  greenText: { color: '#14532D' },
});