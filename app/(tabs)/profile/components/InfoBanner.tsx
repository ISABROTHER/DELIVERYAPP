import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Info } from 'lucide-react-native';

const TEXT = '#111827';
const MUTED = '#6B7280';

// Soft light-red info style (premium, not warning)
const RED_BG = 'rgba(255, 59, 48, 0.08)';
const RED_BORDER = 'rgba(255, 59, 48, 0.18)';
const RED_ICON_BG = 'rgba(255, 59, 48, 0.14)';
const RED_ICON = '#B42318';

interface InfoBannerProps {
  message: string;
  style?: ViewStyle;
}

export function InfoBanner({ message, style }: InfoBannerProps) {
  return (
    <View style={[styles.banner, style]}>
      <View style={styles.iconWrap}>
        <Info size={16} color={RED_ICON} strokeWidth={2} />
      </View>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: RED_BG,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: RED_BORDER,
  },

  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: RED_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },

  // Apple-style secondary text
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: TEXT,
    lineHeight: 20,
  },
});
