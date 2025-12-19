import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { PriceSummary } from '../components/PriceSummary';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { deliveryMethods, DeliveryMethod } from '../config/deliveryMethods';
import { Truck, Home } from 'lucide-react-native';

type Step2DeliveryMethodProps = {
  onNext: () => void;
};

export const Step2DeliveryMethod = ({ onNext }: Step2DeliveryMethodProps) => {
  const { selectedDeliveryMethod, updateDeliveryMethod } = useSendParcel();
  const [localSelection, setLocalSelection] = useState<DeliveryMethod | null>(
    selectedDeliveryMethod || deliveryMethods[0]
  );

  React.useEffect(() => {
    if (!selectedDeliveryMethod && deliveryMethods[0]) {
      updateDeliveryMethod(deliveryMethods[0]);
      setLocalSelection(deliveryMethods[0]);
    }
  }, []);

  const handleSelectMethod = (method: DeliveryMethod) => {
    setLocalSelection(method);
    updateDeliveryMethod(method);
  };

  const handleContinue = () => {
    if (localSelection) {
      onNext();
    }
  };

  const getIcon = (methodId: string) => {
    return methodId === 'self' ? Truck : Home;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader
          title="How the parcel is sent"
          subtitle="Choose how you want to send your parcel"
        />

        <View style={styles.optionsContainer}>
          {deliveryMethods.map((method) => {
            const Icon = getIcon(method.id);
            return (
              <Pressable
                key={method.id}
                style={({ pressed }) => [
                  styles.option,
                  localSelection?.id === method.id && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelectMethod(method)}
              >
                <View style={styles.optionIcon}>
                  <Icon
                    size={24}
                    color={localSelection?.id === method.id ? '#34B67A' : '#6B7280'}
                  />
                </View>

                <View style={styles.optionContent}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionLabel}>{method.label}</Text>
                    {method.additionalCost > 0 && (
                      <Text style={styles.additionalCost}>+{method.additionalCost} kr</Text>
                    )}
                  </View>
                  <Text style={styles.optionDescription}>{method.description}</Text>
                </View>

                <View
                  style={[
                    styles.radioOuter,
                    localSelection?.id === method.id && styles.radioOuterSelected,
                  ]}
                >
                  {localSelection?.id === method.id && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <PriceSummary />
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!localSelection} />
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
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    marginBottom: 12,
  },
  optionSelected: {
    borderColor: '#34B67A',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  optionPressed: {
    opacity: 0.9,
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
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B1220',
    flex: 1,
  },
  additionalCost: {
    fontSize: 13,
    fontWeight: '800',
    color: '#34B67A',
  },
  optionDescription: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    lineHeight: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioOuterSelected: {
    borderColor: '#34B67A',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34B67A',
  },
});
