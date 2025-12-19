import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onClose: () => void;
};

export const ProgressBar = ({ currentStep, totalSteps, onBack, onClose }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  const isFirstStep = currentStep === 1;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.leftAction}>
          {!isFirstStep && (
            <Pressable onPress={onBack} style={styles.iconButton}>
              <ChevronLeft size={20} color="#0B1220" />
            </Pressable>
          )}
        </View>

        {/* Tiny step indicator instead of bulky text */}
        <View style={styles.stepIndicator}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, { backgroundColor: '#34B67A', width: 12 }]} />
          <View style={styles.dot} />
        </View>

        <View style={styles.rightAction}>
          <Pressable onPress={onClose} style={styles.iconButton}>
            <X size={20} color="#0B1220" />
          </Pressable>
        </View>
      </View>

      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
  },
  leftAction: { width: 32 },
  rightAction: { width: 32, alignItems: 'flex-end' },
  iconButton: { padding: 4 },
  stepIndicator: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  barContainer: {
    height: 2,
    backgroundColor: 'rgba(52,182,122,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#34B67A',
  },
});