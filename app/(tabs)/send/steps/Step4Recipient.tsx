import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { PriceSummary } from '../components/PriceSummary';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel, RecipientInfo } from '../context/SendParcelContext';
import { validatePhoneNumber, validateName } from '../utils/validators';
import { formatPhoneNumber } from '../utils/formatters';

type Step4RecipientProps = {
  onNext: () => void;
};

export const Step4Recipient = ({ onNext }: { onNext: () => void }) => {
  const { recipient, updateRecipient } = useSendParcel();

  const [phone, setPhone] = useState(recipient?.phone || '');
  // Splitting name into First and Surname
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');

  const isValid =
    validatePhoneNumber(phone) &&
    validateName(firstName) &&
    validateName(surname);

  const handleContinue = () => {
    if (isValid) {
      const recipientInfo: RecipientInfo = {
        phone,
        name: `${firstName} ${surname}`.trim(),
      };
      updateRecipient(recipientInfo);
      onNext();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.inner}>
        <StepHeader title="Recipient" subtitle="Who is receiving this?" />

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+233"
              value={phone}
              onChangeText={(text) => setPhone(formatPhoneNumber(text))}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>

          {/* First Name and Surname on the same line */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First"
                value={firstName}
                onChangeText={setFirstName}
                autoComplete="name-given"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
                autoComplete="name-family"
              />
            </View>
          </View>
        </View>

        <PriceSummary />

        {/* Continue button sits right after the information */}
        <View style={styles.buttonWrapper}>
          <ContinueButton onPress={handleContinue} disabled={!isValid} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingBottom: 20,
  },
  form: {
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
  buttonWrapper: {
    marginTop: 10,
  },
});