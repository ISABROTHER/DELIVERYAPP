import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';
import { CheckCircle2, Circle } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Step5SummaryProps = {
  onComplete: () => void;
};

export const Step5Summary = ({ onComplete }: Step5SummaryProps) => {
  const { parcel, route, handover, sender, recipient, totalPrice, basePrice, pickupFee } =
    useSendParcel();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!acceptedTerms) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    onComplete();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
      >
        <StepHeader title="Review & Pay" subtitle="Check everything before paying" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parcel</Text>
          <View style={styles.card}>
            <InfoRow label="Size" value={parcel?.size.toUpperCase() || ''} />
            <InfoRow label="Weight" value={parcel?.weightRange || ''} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route</Text>
          <View style={styles.card}>
            <InfoRow
              label="Origin"
              value={`${route?.origin.cityTown}, ${route?.origin.region}`}
            />
            <InfoRow
              label="Destination"
              value={`${route?.destination.cityTown}, ${route?.destination.region}`}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parties</Text>
          <View style={styles.card}>
            <InfoRow label="Sender" value={sender?.name || ''} />
            <InfoRow label="Recipient" value={recipient?.name || ''} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.card}>
            <InfoRow label="Base Price" value={formatPrice(basePrice)} />
            {pickupFee > 0 && <InfoRow label="Pickup Fee" value={formatPrice(pickupFee)} />}
            <View style={styles.divider} />
            <InfoRow label="Total" value={formatPrice(totalPrice)} highlight isLast />
          </View>
        </View>

        <Pressable
          style={styles.termsContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          {acceptedTerms ? (
            <CheckCircle2 size={24} color="#34B67A" />
          ) : (
            <Circle size={24} color="#D1D5DB" />
          )}
          <Text style={styles.termsText}>I accept the terms and conditions</Text>
        </Pressable>

        {/* Continue is now at the end of information */}
        <View style={styles.buttonWrapper}>
          <ContinueButton
            onPress={handlePay}
            disabled={!acceptedTerms}
            loading={loading}
            label="Pay Now"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({
  label,
  value,
  highlight = false,
  isLast = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isLast?: boolean;
}) => (
  <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  scrollPadding: {
    paddingBottom: SCREEN_HEIGHT * 0.12,
  },
  section: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11,18,32,0.06)',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B1220',
    textAlign: 'right',
    flex: 2,
  },
  infoValueHighlight: {
    fontSize: 16,
    color: '#34B67A',
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(11,18,32,0.08)',
    marginVertical: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0B1220',
  },
  buttonWrapper: {
    marginTop: 10,
  },
});