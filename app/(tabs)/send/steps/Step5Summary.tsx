import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { CheckCircle2, Circle } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Step5Summary = ({ onComplete }: { onComplete: () => void }) => {
  const { parcel, route, sender, recipient } = useSendParcel();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <StepHeader title="Review Order" subtitle="One last look before finishing" />
        
        <View style={styles.glassCard}>
          <Text style={styles.sectionTitle}>Shipment Details</Text>
          <Text style={styles.detailText}>Size: {parcel?.size.toUpperCase()}</Text>
          <Text style={styles.detailText}>Route: {route?.origin.cityTown} → {route?.destination.cityTown}</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.glassCard, styles.halfCard]}>
            <Text style={styles.partyLabel}>Sender</Text>
            <Text style={styles.partyName}>{sender?.name}</Text>
          </View>
          <View style={[styles.glassCard, styles.halfCard]}>
            <Text style={styles.partyLabel}>Recipient</Text>
            <Text style={styles.partyName}>{recipient?.name}</Text>
          </View>
        </View>

        <Pressable style={styles.termsRow} onPress={() => setAcceptedTerms(!acceptedTerms)}>
          {acceptedTerms ? <CheckCircle2 size={24} color="#34B67A" /> : <Circle size={24} color="#D1D5DB" />}
          <Text style={styles.termsText}>I confirm all details are correct</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.footer}>
        <ContinueButton onPress={onComplete} disabled={!acceptedTerms} label="Confirm & Pay" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1 },
  scrollPadding: { paddingBottom: 24 },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#FFF', marginBottom: 12, marginHorizontal: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0B1220', marginBottom: 8 },
  detailText: { fontSize: 14, color: '#4B5563', marginBottom: 4, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12, marginHorizontal: 18, marginBottom: 12 },
  halfCard: { flex: 1, marginHorizontal: 0 },
  partyLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 4 },
  partyName: { fontSize: 15, fontWeight: '800', color: '#0B1220' },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, marginTop: 12 },
  termsText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  footer: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: SCREEN_HEIGHT * 0.08, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA' },
});