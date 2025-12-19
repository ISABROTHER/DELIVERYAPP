import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

const SECTION_LABEL = '#6D6D72'; // iOS grouped section header grey
const CARD_BG = '#FFFFFF';
const CARD_BORDER = 'rgba(60,60,67,0.18)';

interface ProfileSectionCardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ProfileSectionCard({ title, children, style }: ProfileSectionCardProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },

  title: {
    fontSize: 13,
    fontWeight: '400',
    color: SECTION_LABEL,
    marginBottom: 8,
    marginLeft: 16,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
  },
});
