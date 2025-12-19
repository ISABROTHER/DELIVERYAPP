import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useSendParcel } from '../context/SendParcelContext';

type Step1SizeProps = {
  onNext: () => void;
};

// Match the attached UI: title + description + list cards with image box + “From …”
const OPTIONS = [
  {
    id: '1-5kg',
    title: 'Parcel up to 5 kg',
    within: 'Within 35 × 25 × 12 cm',
    bullets: ['Send from mailbox or parcel box', 'Compensation up to 2 500 kr'],
    fromLabel: 'From 73 kr',
    // simple illustration placeholder (you can replace with your own asset later)
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
  {
    id: '25-35kg',
    title: 'Parcel up to 35 kg',
    within: 'Within 120 × 60 × 60 cm',
    bullets: ['Possibility for larger packages', 'Compensation up to 10 000 kr'],
    fromLabel: 'From 310 kr',
    imageUri: 'https://placehold.co/220x220/E8F5E9/2E7D32/png?text=35kg',
    impliedSize: 'large' as const,
  },
] as const;

const BG = '#FFFFFF';
const TEXT = '#0B1220';
const MUTED = '#4B5563';
const DIVIDER = '#D1D5DB';

const GREEN = '#2E7D32';
const LIGHT_GREEN = '#E8F5E9';

export const Step1Size = ({ onNext }: Step1SizeProps) => {
  const { parcel, updateParcel } = useSendParcel();
  const [selectedId, setSelectedId] = useState<string | null>(parcel?.weightRange || null);

  const selected = useMemo(() => OPTIONS.find((o) => o.id === selectedId), [selectedId]);

  const selectOption = (id: string) => {
    setSelectedId(id);
    const opt = OPTIONS.find((o) => o.id === id);
    if (!opt) return;

    // Keep the flow stable: we still set weightRange + also set an implied "size"
    // so later steps that depend on size don't break.
    updateParcel({
      weightRange: opt.id,
      size: opt.impliedSize,
      // Remove anything not in the screenshot (no category here)
      category: undefined,
    });

    // Move to next step immediately after selection (no extra buttons in the screenshot)
    setTimeout(() => onNext(), 200);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header — match screenshot */}
        <Text style={styles.backLabel}>Send</Text>
        <Text style={styles.title}>Parcel in Norway</Text>
        <Text style={styles.lead}>
          Delivery time 2–3 working days. Including tracking and compensation. All parcels can be
          delivered at the post office or post in shop.
        </Text>

        {/* List — match screenshot */}
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
              </View>
            );
          })}
        </View>

        {/* No extra UI below — screenshot ends after list */}
        <View style={{ height: 10 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
  },

  // Small “Send” label (represents the nav/back context without implementing a header here)
  backLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: GREEN,
    marginBottom: 10,
  },

  title: {
    fontSize: 44,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  lead: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '400',
    color: TEXT,
    marginBottom: 22,
  },

  list: {
    // the screenshot is essentially full-width rows
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 22,
  },
  rowPressed: {
    opacity: 0.92,
  },
  rowSelected: {
    backgroundColor: 'transparent',
  },

  left: {
    flex: 1,
    paddingRight: 10,
  },

  rowTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.4,
  },
  rowWithin: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.2,
  },

  bullet: {
    marginTop: 10,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400',
    color: TEXT,
  },

  right: {
    width: 130,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },

  imageBox: {
    width: 118,
    height: 118,
    borderRadius: 6,
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '88%',
    height: '88%',
  },

  from: {
    fontSize: 22,
    fontWeight: '800',
    color: GREEN,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER,
  },
});
