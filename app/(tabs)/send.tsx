import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have icons installed
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
  const [currentStep, setCurrentStep] = useState(1);
  const { reset } = useSendParcel();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCurrentStep(1);
    reset(); // Reset context on completion
  };

  const renderStep = () => {
    // Pass handleBack as a prop to all steps that need it
    const stepProps = { onNext: handleNext, onBack: handleBack };
    
    switch (currentStep) {
      case 1:
        return <Step1Size onNext={handleNext} />; // Step 1 usually has no back
      case 2:
        return <Step2Route {...stepProps} />;
      case 3:
        return <Step3HandoverMethod {...stepProps} />;
      case 4:
        return <Step4Parties {...stepProps} />;
      case 5:
        return <Step5Summary onComplete={handleNext} onBack={handleBack} />;
      case 6:
        return <Step6SecureHandover onComplete={handleComplete} />;
      default:
        return <Step1Size onNext={handleNext} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerNav}>
        {currentStep > 1 && currentStep < 6 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#2E7D32" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </View>
      <View style={styles.stepContainer}>{renderStep()}</View>
    </SafeAreaView>
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
    backgroundColor: '#F8FAFB', // Updated to match your Step1Size BG
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    zIndex: 10,
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