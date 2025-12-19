import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
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
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.95; // 5% top gap
const TOTAL_STEPS = 7;
 
const SendParcelFlow = () => {
  const { currentStep, setCurrentStep, reset } = useSendParcel();
  
  // Start the animation off-screen (at the bottom)
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Trigger animation every time the tab is clicked (focused)
  useFocusEffect(
    useCallback(() => {
      // Slide UP
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 45,
        friction: 9,
      }).start();

      return () => {
        // Reset position when leaving the tab so it can slide up again next time
        slideAnim.setValue(SCREEN_HEIGHT);
      };
    }, [slideAnim])
  );

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
    // Slide DOWN before resetting
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      reset();
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Size onNext={handleNext} />;
      case 2: return <Step2Route onNext={handleNext} />;
      case 3: return <Step3HandoverMethod onNext={handleNext} />;
      case 4: return <Step3Sender onNext={handleNext} />;
      case 5: return <Step4Recipient onNext={handleNext} />;
      case 6: return <Step5Summary onComplete={handleNext} />;
      case 7: return <Step6SecureHandover onComplete={reset} />;
      default: return <Step1Size onNext={handleNext} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Background overlay that stays still */}
      <View style={styles.background} />

      {/* The actual steps that roll up */}
      <Animated.View 
        style={[
          styles.sheetContainer, 
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Visual Handle for the Pop-up Vibe */}
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
  return (
    <SendParcelFlow />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // The background color seen in the 5% gap
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
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
    width: 36,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  stepContainer: {
    flex: 1,
  },
});