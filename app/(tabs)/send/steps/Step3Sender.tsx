import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { PriceSummary } from '../components/PriceSummary';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Step3Sender = ({ onNext }: { onNext: () => void }) => {
  const { sender, updateSender } = useSendParcel();
  const [name, setName] = useState(sender?.name || '');
  const [phone, setPhone] = useState(sender?.phone || '');

  const handleContinue = () => {
    if (name && phone) {
      updateSender({ name, phone });
      onNext();
    }
  };

  const canContinue = name.length > 2 && phone.length >= 10;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <StepHeader title="Sender Details" subtitle="Who is sending this parcel?" />
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor="#9CA3AF" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="e.g., 024 000 0000" keyboardType="phone-pad" placeholderTextColor="#9CA3AF" />
          </View>
        </View>
        <PriceSummary />
      </ScrollView>
      <View style={styles.footer}>
        <ContinueButton onPress={handleContinue} disabled={!canContinue} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1 },
  scrollPadding: { paddingBottom: 24 },
  card: { marginHorizontal: 18, marginBottom: 20, padding: 16, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: '700', color: '#0B1220' },
  footer: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: SCREEN_HEIGHT * 0.08, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA' },
});