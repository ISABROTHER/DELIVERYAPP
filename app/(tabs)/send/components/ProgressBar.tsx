import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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

        <Text style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>

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
    paddingHorizontal: 18,
    paddingVertical: 8, // Slimmer vertical padding
    backgroundColor: 'transparent', // Blends better with the sheet
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftAction: {
    width: 32,
    alignItems: 'flex-start',
  },
  rightAction: {
    width: 32,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 2,
  },
  stepText: {
    fontSize: 12, // More compact text
    fontWeight: '800',
    color: '#0B1220',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  barContainer: {
    height: 4, // Slimmer bar
    backgroundColor: 'rgba(52,182,122,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#34B67A',
    borderRadius: 2,
  },
});