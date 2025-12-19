import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';

export const ProgressBar = ({ currentStep, totalSteps, onBack, onClose }: any) => {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable onPress={onBack} style={[styles.btn, currentStep === 1 && { opacity: 0 }]}>
          <ChevronLeft size={20} color="#0B1220" />
        </Pressable>
        <View style={styles.indicator}>
          {[...Array(totalSteps)].map((_, i) => (
            <View key={i} style={[styles.dot, i + 1 === currentStep && styles.activeDot]} />
          ))}
        </View>
        <Pressable onPress={onClose} style={styles.btn}>
          <X size={20} color="#0B1220" />
        </Pressable>
      </View>
      <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 32 },
  btn: { padding: 4 },
  indicator: { flexDirection: 'row', gap: 6 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB' },
  activeDot: { backgroundColor: '#34B67A', width: 12 },
  track: { height: 2, backgroundColor: 'rgba(52,182,122,0.1)', borderRadius: 1 },
  fill: { height: '100%', backgroundColor: '#34B67A' },
});