import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

const TEXT = '#111827';
const CHEVRON = '#8E8E93';
const SEPARATOR = 'rgba(60,60,67,0.18)';

const GREEN_BG = 'rgba(52, 182, 122, 0.15)';
const GREEN_TEXT = '#1F7A4E';

interface ProfileRowProps {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  destructive?: boolean;
}

export function ProfileRow({
  icon: Icon,
  label,
  onPress,
  showChevron = true,
  isLast = false,
  destructive = false,
}: ProfileRowProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
      >
        <View style={styles.left}>
          <View style={[styles.iconWrap, destructive ? styles.iconWrapDestructive : null]}>
            <Icon size={18} color={destructive ? '#FF3B30' : GREEN_TEXT} strokeWidth={2} />
          </View>

          <Text style={[styles.label, destructive ? styles.labelDestructive : null]} numberOfLines={1}>
            {label}
          </Text>
        </View>

        {showChevron ? <ChevronRight size={18} color={CHEVRON} strokeWidth={2} /> : null}
      </Pressable>

      {!isLast ? <View style={styles.separator} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  // iOS-like highlight
  rowPressed: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: GREEN_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconWrapDestructive: {
    backgroundColor: 'rgba(255,59,48,0.10)',
  },

  // iOS default list text
  label: {
    fontSize: 17,
    fontWeight: '400',
    color: TEXT,
    flex: 1,
  },

  labelDestructive: {
    color: '#FF3B30',
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: SEPARATOR,
    marginLeft: 58, // aligns after icon
  },
});
