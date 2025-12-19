import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StepHeaderProps = {
  title: string;
  subtitle?: string;
};

export const StepHeader = ({ title, subtitle }: StepHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0B1220',
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    lineHeight: 20,
  },
});
