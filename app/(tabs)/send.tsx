import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const handleComplete = () => {
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Size onNext={handleNext} />;
      case 2:
        return <Step2Route onNext={handleNext} />;
      case 3:
        return <Step3HandoverMethod onNext={handleNext} />;
      case 4:
        return <Step4Parties onNext={handleNext} />;
      case 5:
        return <Step5Summary onComplete={handleNext} />;
      case 6:
        return <Step6SecureHandover onComplete={handleComplete} />;
      default:
        return <Step1Size onNext={handleNext} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
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
    backgroundColor: '#E9EDF2',
  },
  stepContainer: {
    flex: 1,
  },
});
