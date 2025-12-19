import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SendParcelProvider, useSendParcel } from './send/context/SendParcelContext';
import { ProgressBar } from './send/components/ProgressBar';
import { Step1Size } from './send/steps/Step1Size';
import { Step2Route } from './send/steps/Step2Route';
// ... other imports

const TOTAL_STEPS = 6;

const SendParcelFlow = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const { reset } = useSendParcel();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    reset(); // Clear data
    setCurrentStep(1); // Go back to start
    router.replace('/(tabs)'); // Go back to Home tab
  };

  const renderStep = () => {
    const props = { onNext: handleNext, onBack: handleBack };
    switch (currentStep) {
      case 1: return <Step1Size onNext={handleNext} />;
      case 2: return <Step2Route {...props} />;
      // ... other cases
      default: return <Step1Size onNext={handleNext} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* MODERN FLOW HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <View style={styles.slot}>
            {currentStep > 1 && (
              <TouchableOpacity onPress={handleBack} style={styles.navBtn}>
                <Ionicons name="chevron-back" size={24} color="#14532D" />
                <Text style={styles.navText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.centerSlot}>
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </View>

          <View style={styles.slot}>
            <TouchableOpacity onPress={handleClose} style={[styles.navBtn, { alignSelf: 'flex-end' }]}>
              <Text style={styles.closeText}>Close</Text>
              <Ionicons name="close-circle" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.stepContainer}>{renderStep()}</View>
    </View>
  );
};

export default function SendScreen() {
  return (
    <SendParcelProvider>
      <SendParcelFlow />
    </SendParcelProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60,60,67,0.18)',
  },
  headerInner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  slot: { flex: 1 },
  centerSlot: { flex: 2, alignItems: 'center' },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navText: { fontSize: 16, fontWeight: '600', color: '#14532D' },
  closeText: { fontSize: 15, fontWeight: '500', color: '#6B7280' },
  stepContainer: { flex: 1 },
});