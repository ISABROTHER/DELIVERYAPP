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
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.leftAction}>
          {currentStep > 1 && (
            <Pressable onPress={onBack} style={styles.iconButton}><ChevronLeft size={24} color="#0B1220" /></Pressable>
          )}
        </View>
        <Text style={styles.stepText}>Step {currentStep} of {totalSteps}</Text>
        <View style={styles.rightAction}>
          <Pressable onPress={onClose} style={styles.iconButton}><X size={24} color="#0B1220" /></Pressable>
        </View>
      </View>
      <View style={styles.barContainer}><View style={[styles.barFill, { width: `${progress}%` }]} /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#F9FAFB' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  leftAction: { width: 40 },
  rightAction: { width: 40, alignItems: 'flex-end' },
  iconButton: { padding: 4 },
  stepText: { fontSize: 14, fontWeight: '800', color: '#0B1220' },
  barContainer: { height: 6, backgroundColor: 'rgba(52,182,122,0.15)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#34B67A', borderRadius: 3 },
});