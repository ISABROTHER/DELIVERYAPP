import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSendParcel } from './send/context/SendParcelContext';
import { ProgressBar } from './send/components/ProgressBar';
import { Step1Size } from './send/steps/Step1Size';
import { Step2Route } from './send/steps/Step2Route';
import { Step3HandoverMethod } from './send/steps/Step3HandoverMethod';
import { Step3Sender } from './send/steps/Step3Sender';
import { Step4Recipient } from './send/steps/Step4Recipient';
import { Step5Summary } from './send/steps/Step5Summary';
import { Step6SecureHandover } from './send/steps/Step6SecureHandover';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.95; 
const TOTAL_STEPS = 7;
 
const SendParcelFlow = () => {
  const { currentStep, setCurrentStep, reset } = useSendParcel();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Watch the currentStep. If it goes past 1, slide up. If it's 1, slide down.
  useEffect(() => {
    if (currentStep > 1) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep]);

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

  const handleClose = () => {
    // This will trigger the useEffect to slide the sheet down
    reset();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 2: return <Step2Route onNext={handleNext} />;
      case 3: return <Step3HandoverMethod onNext={handleNext} />;
      case 4: return <Step3Sender onNext={handleNext} />;
      case 5: return <Step4Recipient onNext={handleNext} />;
      case 6: return <Step5Summary onComplete={handleNext} />;
      case 7: return <Step6SecureHandover onComplete={handleClose} />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* STEP 1: The Static Base Layer (Always there) */}
      <View style={styles.baseLayer}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <Step1Size onNext={handleNext} />
        </SafeAreaView>
      </View>

      {/* STEPS 2-7: The Animated Roll-up Sheet */}
      <Animated.View 
        style={[
          styles.sheetContainer, 
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={TOTAL_STEPS} 
            onBack={handleBack}
            onClose={handleClose}
          />
          <View style={styles.stepContainer}>{renderStep()}</View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default function SendScreen() {
  return <SendParcelFlow />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  baseLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F2F7',
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 30,
  },
  safeArea: {
    flex: 1,
  },
  handleContainer: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 38,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  stepContainer: {
    flex: 1,
  },
});