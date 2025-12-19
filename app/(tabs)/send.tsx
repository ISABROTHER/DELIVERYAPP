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
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.95; // Leaves 5% gap at the top
const TOTAL_STEPS = 7;
 
const SendParcelFlow = () => {
  const { currentStep, setCurrentStep, reset } = useSendParcel();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Animation logic: Roll up for Steps 2-7, Roll down for Step 1
  useEffect(() => {
    if (currentStep > 1) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 45,
        friction: 9,
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
    // Resetting currentStep to 1 will trigger the slide-down animation
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
      {/* STEP 1: Always in the background */}
      <View style={styles.baseLayer}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <Step1Size onNext={handleNext} />
        </SafeAreaView>
      </View>

      {/* DIMMING EFFECT: Fades in/out based on the sheet position (Steps 2-7) */}
      <Animated.View 
        style={[
          styles.dimmingOverlay,
          {
            opacity: slideAnim.interpolate({
              inputRange: [0, SCREEN_HEIGHT],
              outputRange: [1, 0], // Fully visible when sheet is up (0), invisible when down
            })
          }
        ]}
        pointerEvents="none"
      />

      {/* POP-UP SHEET: Steps 2-7 */}
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
    backgroundColor: '#F2F2F7',
  },
  baseLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  dimmingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Adjust this to make it darker or lighter
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