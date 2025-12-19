import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { PriceSummary } from '../components/PriceSummary';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel, RecipientInfo } from '../context/SendParcelContext';
import {
  validatePhoneNumber,
  validatePostalCode,
  validateName,
  validateAddress,
} from '../utils/validators';
import { formatPhoneNumber, formatPostalCode } from '../utils/formatters';

type Step4RecipientProps = {
  onNext: () => void;
};

export const Step4Recipient = ({ onNext }: Step4RecipientProps) => {
  const { recipient, updateRecipient } = useSendParcel();

  const [phone, setPhone] = useState(recipient?.phone || '');
  const [name, setName] = useState(recipient?.name || '');
  const [address, setAddress] = useState(recipient?.address || '');
  const [postalCode, setPostalCode] = useState(recipient?.postalCode || '');
  const [city, setCity] = useState(recipient?.city || '');

  const isValid =
    validatePhoneNumber(phone) &&
    validateName(name) &&
    validateAddress(address) &&
    validatePostalCode(postalCode) &&
    city.trim().length > 0;

  const handleContinue = () => {
    if (isValid) {
      const recipientInfo: RecipientInfo = {
        phone,
        name,
        address,
        postalCode,
        city,
      };
      updateRecipient(recipientInfo);
      onNext();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader title="Recipient Information" subtitle="Enter recipient details" />

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="+47"
              value={phone}
              onChangeText={(text) => setPhone(formatPhoneNumber(text))}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Recipient name"
              value={name}
              onChangeText={setName}
              autoComplete="name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address"
              value={address}
              onChangeText={setAddress}
              autoComplete="street-address"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Postal code</Text>
              <TextInput
                style={styles.input}
                placeholder="0000"
                value={postalCode}
                onChangeText={(text) => setPostalCode(formatPostalCode(text))}
                keyboardType="number-pad"
                maxLength={4}
                autoComplete="postal-code"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
                autoComplete="off"
              />
            </View>
          </View>
        </View>

        <PriceSummary />
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!isValid} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B1220',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1220',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
});
