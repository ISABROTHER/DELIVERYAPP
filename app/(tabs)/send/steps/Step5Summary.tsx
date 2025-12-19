import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';
import { MapPin, User, Package, CheckCircle2, Circle, ArrowRight, CreditCard } from 'lucide-react-native';

type Step5SummaryProps = {
  onComplete: () => void;
};

export const Step5Summary = ({ onComplete }: Step5SummaryProps) => {
  const { parcel, route, handover, sender, recipient, totalPrice, basePrice, pickupFee } = useSendParcel();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!acceptedTerms) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    onComplete();
  };

  if (!parcel || !route || !sender || !recipient) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader 
          title="Review Order" 
          subtitle="One last look before we process your delivery" 
        />

        {/* 1. Parcel & Route Visual */}
        <View style={styles.glassCard}>
          <View style={styles.cardHeader}>
            <Package size={20} color="#34B67A" />
            <Text style={styles.cardTitle}>Shipment Details</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>{parcel.size.toUpperCase()}</Text></View>
          </View>
          
          <View style={styles.routeFlow}>
            <View style={styles.routeItem}>
              <View style={styles.routeDot} />
              <View>
                <Text style={styles.routeLabel}>FROM</Text>
                <Text style={styles.routeValue}>{route.origin.cityTown}, {route.origin.region}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, { backgroundColor: '#34B67A' }]} />
              <View>
                <Text style={styles.routeLabel}>TO</Text>
                <Text style={styles.routeValue}>{route.destination.cityTown}, {route.destination.region}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Parties Section (Sender & Recipient) */}
        <View style={styles.row}>
          <View style={[styles.glassCard, styles.halfCard]}>
            <User size={18} color="#6B7280" style={{ marginBottom: 8 }} />
            <Text style={styles.partyLabel}>Sender</Text>
            <Text style={styles.partyName} numberOfLines={1}>{sender.name}</Text>
            <Text style={styles.partyPhone}>{sender.phone}</Text>
          </View>
          <View style={[styles.glassCard, styles.halfCard]}>
            <User size={18} color="#34B67A" style={{ marginBottom: 8 }} />
            <Text style={styles.partyLabel}>Recipient</Text>
            <Text style={styles.partyName} numberOfLines={1}>{recipient.name}</Text>
            <Text style={styles.partyPhone}>{recipient.phone}</Text>
          </View>
        </View>

        {/* 3. Handover Method */}
        <View style={styles.glassCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Handover Method</Text>
            <Text style={styles.detailValue}>
              {handover?.method === 'PICKUP' ? '🚗 Doorstep Pickup' : '🏬 Agent Drop-off'}
            </Text>
          </View>
          {handover?.method === 'PICKUP' && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pickup Address</Text>
              <Text style={styles.detailValue} numberOfLines={1}>{handover.pickupDetails?.landmark}</Text>
            </View>
          )}
        </View>

        {/* 4. Payment Card */}
        <View style={[styles.glassCard, { backgroundColor: '#0B1220' }]}>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Base Fare</Text>
            <Text style={styles.payValue}>{formatPrice(basePrice)}</Text>
          </View>
          {pickupFee > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Pickup Fee</Text>
              <Text style={styles.payValue}>{formatPrice(pickupFee)}</Text>
            </View>
          )}
          <View style={styles.payDivider} />
          <View style={styles.payRow}>
            <Text style={[styles.payLabel, { color: '#FFF' }]}>Total to Pay</Text>
            <Text style={styles.totalAmount}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>

        {/* Terms Toggle */}
        <Pressable 
          style={styles.termsRow} 
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          {acceptedTerms ? (
            <CheckCircle2 size={24} color="#34B67A" />
          ) : (
            <Circle size={24} color="#D1D5DB" />
          )}
          <Text style={styles.termsText}>
            I confirm all details are correct and I agree to the <Text style={{ color: '#34B67A' }}>Terms of Service</Text>.
          </Text>
        </Pressable>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton 
          onPress={handlePay} 
          disabled={!acceptedTerms} 
          loading={loading}
          label="Secure Payment & Finish" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, paddingHorizontal: 18 },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFF',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0B1220', flex: 1 },
  badge: { backgroundColor: 'rgba(52, 182, 122, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#34B67A' },
  routeFlow: { gap: 4 },
  routeItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  routeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D1D5DB', marginTop: 5 },
  routeLine: { width: 2, height: 20, backgroundColor: '#E5E7EB', marginLeft: 4, marginVertical: 2 },
  routeLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5 },
  routeValue: { fontSize: 14, fontWeight: '800', color: '#0B1220' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfCard: { flex: 1, padding: 16 },
  partyLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 4 },
  partyName: { fontSize: 15, fontWeight: '800', color: '#0B1220' },
  partyPhone: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  detailLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  detailValue: { fontSize: 13, fontWeight: '800', color: '#0B1220' },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  payLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  payValue: { fontSize: 13, color: '#FFF', fontWeight: '800' },
  payDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 12 },
  totalAmount: { fontSize: 20, fontWeight: '900', color: '#34B67A' },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  termsText: { fontSize: 13, fontWeight: '600', color: '#4B5563', flex: 1, lineHeight: 18 },
  footer: { padding: 18, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' }
});