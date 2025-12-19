import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSendParcel, Agent } from '../context/SendParcelContext';
import { fetchNearbyAgents } from '../services/agents';
import { MapPin, Shield, CheckCircle2, QrCode, Copy } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const Step6SecureHandover = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const { parcel, route, handover, sender, recipient, totalPrice, basePrice, pickupFee, updateSecurity, updateHandover, reset } = useSendParcel();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(handover?.selectedAgent || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [codes, setCodes] = useState({ shipmentCode: '', senderPin: '', trackingId: '' });

  useEffect(() => {
    const code = `SHP${Math.floor(100000 + Math.random() * 900000)}`;
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const tracking = `TRK${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    setCodes({ shipmentCode: code, senderPin: pin, trackingId: tracking });
    updateSecurity({ shipmentCode: code, senderPin: pin, trackingId: tracking });
    loadAgents();
  }, []);

  const loadAgents = async () => {
    if (!route) return;
    const nearby = await fetchNearbyAgents({ region: route.origin.region, cityTown: route.origin.cityTown, method: handover?.method || 'DROPOFF' });
    setAgents(nearby);
    if (handover?.method === 'PICKUP' && nearby.length > 0) setSelectedAgent(nearby[0]);
    setLoading(false);
  };

  const handleFinish = async () => {
    if (!user || !selectedAgent) return;
    setSaving(true);
    try {
      await supabase.from('shipments').insert({
        sender_id: user.id, sender_name: sender?.name, sender_phone: sender?.phone,
        recipient_name: recipient?.name, recipient_phone: recipient?.phone,
        tracking_id: codes.trackingId, status: 'PAID_AWAITING_HANDOVER',
        total_price: totalPrice, origin_city_town: route?.origin.cityTown
      });
      reset();
      router.replace('/(tabs)');
    } catch (e) {
      alert("Error saving shipment.");
    } finally { setSaving(false); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#34B67A" /></View>;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.successIcon}><CheckCircle2 size={40} color="#FFF" /></View>
          <Text style={styles.title}>Shipment Created!</Text>
          <Text style={styles.subtitle}>Your parcel is ready for handover</Text>
        </View>

        <View style={styles.glassCard}>
          <View style={styles.codeBox}>
            <Text style={styles.label}>TRACKING ID</Text>
            <View style={styles.codeRow}>
              <Text style={styles.codeValue}>{codes.trackingId}</Text>
              <Copy size={16} color="#34B67A" />
            </View>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.codeBox}>
            <View style={styles.row}>
              <Shield size={18} color="#FF5B24" />
              <Text style={[styles.label, { color: '#FF5B24' }]}>SENDER SECURITY PIN</Text>
            </View>
            <Text style={styles.pinValue}>{codes.senderPin}</Text>
            <Text style={styles.pinNote}>Give this only to the agent when they arrive.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {handover?.method === 'PICKUP' ? 'Pickup Agent' : 'Drop-off Agent'}
          </Text>
          {selectedAgent && (
            <View style={styles.agentCard}>
              <MapPin size={20} color="#34B67A" />
              <View style={{ flex: 1 }}>
                <Text style={styles.agentName}>{selectedAgent.name}</Text>
                <Text style={styles.agentAddress}>{selectedAgent.addressText}</Text>
              </View>
            </View>
          )}
        </View>

        <Pressable style={styles.finishButton} onPress={handleFinish} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.finishText}>Back to Home</Text>}
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#34B67A', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#0B1220' },
  subtitle: { fontSize: 15, color: '#6B7280', fontWeight: '600', marginTop: 4 },
  glassCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
  codeBox: { gap: 8 },
  label: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeValue: { fontSize: 18, fontWeight: '900', color: '#0B1220' },
  pinValue: { fontSize: 32, fontWeight: '900', color: '#0B1220', letterSpacing: 4, marginVertical: 8 },
  pinNote: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0B1220', textTransform: 'uppercase', marginBottom: 12 },
  agentCard: { flexDirection: 'row', gap: 16, backgroundColor: '#F9FAFB', padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#34B67A' },
  agentName: { fontSize: 15, fontWeight: '800', color: '#0B1220' },
  agentAddress: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  finishButton: { backgroundColor: '#0B1220', padding: 18, borderRadius: 16, alignItems: 'center' },
  finishText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});