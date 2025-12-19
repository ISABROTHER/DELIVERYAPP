import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SendParcelProvider, useSendParcel } from './send/context/SendParcelContext';
import { ProgressBar } from './send/components/ProgressBar';
import { Step1Size } from './send/steps/Step1Size';
import { Step2Route } from './send/steps/Step2Route';
import { Step3HandoverMethod } from './send/steps/Step3HandoverMethod';
import { Step4Parties } from './send/steps/Step4Parties';
import { Step5Summary } from './send/steps/Step5Summary';
import { Step6SecureHandover } from './send/steps/Step6SecureHandover';

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

  const handleComplete = () => {
    setCurrentStep(1);
    reset();
  };

  const renderStep = () => {
    const props = { onNext: handleNext, onBack: handleBack };
    switch (currentStep) {
      case 1: return <Step1Size onNext={handleNext} />;
      case 2: return <Step2Route {...props} />;
      case 3: return <Step3HandoverMethod {...props} />;
      case 4: return <Step4Parties {...props} />;
      case 5: return <Step5Summary onComplete={handleNext} onBack={handleBack} />;
      case 6: return <Step6SecureHandover onComplete={handleComplete} />;
      default: return <Step1Size onNext={handleNext} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Header */}
      <View style={[styles.navHeader, { paddingTop: insets.top }]}>
        <View style={styles.navInner}>
          <View style={styles.leftSlot}>
            {currentStep > 1 && currentStep < 6 && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton} hitSlop={15}>
                <Ionicons name="chevron-back" size={24} color="#2E7D32" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.centerSlot}>
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </View>

          <View style={styles.rightSlot} />
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  navHeader: {
    backgroundColor: '#F8FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F3',
  },
  navInner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftSlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerSlot: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSlot: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: -4,
  },
  stepContainer: {
    flex: 1,
  },
});