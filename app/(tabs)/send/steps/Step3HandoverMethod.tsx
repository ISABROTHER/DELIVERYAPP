import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ScrollView } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { PriceSummary } from '../components/PriceSummary';
import { useSendParcel, Handover, PickupDetails } from '../context/SendParcelContext';
import { Store, Home } from 'lucide-react-native';
import { PICKUP_FEE, formatPrice } from '../config/pricing';

type Step3HandoverMethodProps = {
  onNext: () => void;
};

export const Step3HandoverMethod = ({ onNext }: Step3HandoverMethodProps) => {
  const { handover, updateHandover, route, basePrice, pickupFee } = useSendParcel();

  const [method, setMethod] = useState<'DROPOFF' | 'PICKUP'>(
    handover?.method || 'DROPOFF'
  );
  const [pickupLandmark, setPickupLandmark] = useState(
    handover?.pickupDetails?.landmark || ''
  );
  const [pickupPhone, setPickupPhone] = useState(
    handover?.pickupDetails?.phone || ''
  );
  const [pickupTiming, setPickupTiming] = useState<'ASAP' | 'TODAY' | 'SCHEDULE'>(
    handover?.pickupDetails?.timing || 'ASAP'
  );

  const handleContinue = () => {
    const handoverData: Handover = {
      method,
      pickupDetails:
        method === 'PICKUP'
          ? {
              landmark: pickupLandmark,
              phone: pickupPhone,
              timing: pickupTiming,
            }
          : undefined,
    };
    updateHandover(handoverData);
    onNext();
  };

  const canContinue =
    method === 'DROPOFF' ||
    (method === 'PICKUP' && pickupLandmark && pickupPhone);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader
          title="Handover Method"
          subtitle="How will you give us the parcel?"
        />

        <View style={styles.optionsContainer}>
          <Pressable
            style={[styles.option, method === 'DROPOFF' && styles.optionSelected]}
            onPress={() => setMethod('DROPOFF')}
          >
            <View style={styles.optionIcon}>
              <Store
                size={24}
                color={method === 'DROPOFF' ? '#34B67A' : '#6B7280'}
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, method === 'DROPOFF' && styles.titleSelected]}>
                Drop-off at Agent
              </Text>
              <Text style={styles.optionDescription}>
                You bring the parcel to a nearby agent point (default)
              </Text>
              <Text style={styles.optionPrice}>No extra fee</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.option, method === 'PICKUP' && styles.optionSelected]}
            onPress={() => setMethod('PICKUP')}
          >
            <View style={styles.optionIcon}>
              <Home
                size={24}
                color={method === 'PICKUP' ? '#34B67A' : '#6B7280'}
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, method === 'PICKUP' && styles.titleSelected]}>
                Agent Picks Up
              </Text>
              <Text style={styles.optionDescription}>
                Agent comes to your location to collect the parcel
              </Text>
              <Text style={[styles.optionPrice, styles.feePrice]}>
                + {formatPrice(PICKUP_FEE)}
              </Text>
            </View>
          </Pressable>
        </View>

        {method === 'PICKUP' && (
          <View style={styles.pickupDetailsCard}>
            <Text style={styles.detailsTitle}>Pickup Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Location/Landmark *</Text>
              <TextInput
                style={styles.input}
                value={pickupLandmark}
                onChangeText={setPickupLandmark}
                placeholder={`e.g., Near ${route?.origin.cityTown || 'your area'}`}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Phone *</Text>
              <TextInput
                style={styles.input}
                value={pickupPhone}
                onChangeText={setPickupPhone}
                placeholder="+233 XX XXX XXXX"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Timing</Text>
              <View style={styles.timingOptions}>
                {(['ASAP', 'TODAY', 'SCHEDULE'] as const).map((timing) => (
                  <Pressable
                    key={timing}
                    style={[
                      styles.timingOption,
                      pickupTiming === timing && styles.timingSelected,
                    ]}
                    onPress={() => setPickupTiming(timing)}
                  >
                    <Text
                      style={[
                        styles.timingText,
                        pickupTiming === timing && styles.timingTextSelected,
                      ]}
                    >
                      {timing === 'ASAP'
                        ? 'ASAP'
                        : timing === 'TODAY'
                        ? 'Today'
                        : 'Schedule Later'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        <PriceSummary basePrice={basePrice} additionalFee={pickupFee} />
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  optionsContainer: {
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  optionSelected: {
    borderColor: '#34B67A',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 4,
  },
  titleSelected: {
    color: '#34B67A',
  },
  optionDescription: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#6B7280',
  },
  feePrice: {
    color: '#34B67A',
  },
  pickupDetailsCard: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  detailsTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1220',
  },
  timingOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  timingOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
  },
  timingSelected: {
    borderColor: '#34B67A',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  timingText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#6B7280',
  },
  timingTextSelected: {
    color: '#34B67A',
  },
});
