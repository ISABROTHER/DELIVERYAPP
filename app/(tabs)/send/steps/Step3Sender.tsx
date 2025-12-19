import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { PriceSummary } from '../components/PriceSummary';
import { useSendParcel } from '../context/SendParcelContext';
import { User } from 'lucide-react-native';

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
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader
          title="Sender Details"
          subtitle="Who is sending this parcel?"
        />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={20} color="#34B67A" />
            <Text style={styles.cardTitle}>Your Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g., 024 000 0000"
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <PriceSummary />
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  card: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: '900', color: '#0B1220' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 8 },
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
});