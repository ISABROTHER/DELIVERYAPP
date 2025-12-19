import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSendParcel, Agent } from '../context/SendParcelContext';
import { fetchNearbyAgents } from '../services/agents';
import { MapPin, Shield, CheckCircle2, QrCode } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Step6SecureHandoverProps = {
  onComplete: () => void;
};

export const Step6SecureHandover = ({ onComplete }: Step6SecureHandoverProps) => {
  const { user } = useAuth();
  const {
    parcel,
    route,
    handover,
    sender,
    recipient,
    totalPrice,
    basePrice,
    pickupFee,
    updateSecurity,
    updateHandover,
    reset,
  } = useSendParcel();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(
    handover?.selectedAgent || null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shipmentCode, setShipmentCode] = useState('');
  const [senderPin, setSenderPin] = useState('');
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    loadAgents();
    generateCodes();
  }, []);

  const generateCodes = () => {
    const code = `SHP${Math.floor(100000 + Math.random() * 900000)}`;
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const tracking = `TRK${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    setShipmentCode(code);
    setSenderPin(pin);
    setTrackingId(tracking);
    updateSecurity({ shipmentCode: code, senderPin: pin, trackingId: tracking });
  };

  const loadAgents = async () => {
    if (!route) return;

    setLoading(true);
    const nearbyAgents = await fetchNearbyAgents({
      region: route.origin.region,
      cityTown: route.origin.cityTown,
      method: handover?.method || 'DROPOFF',
    });
    setAgents(nearbyAgents);

    if (handover?.method === 'PICKUP' && nearbyAgents.length > 0) {
      setSelectedAgent(nearbyAgents[0]);
    }

    setLoading(false);
  };

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    if (handover) {
      updateHandover({ ...handover, selectedAgent: agent });
    }
  };

  const handleSaveShipment = async () => {
    if (!selectedAgent || !user) return;

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('shipments')
        .insert({
          sender_id: user.id,
          sender_name: sender?.name || '',
          sender_phone: sender?.phone || '',
          recipient_phone: recipient?.phone || '',
          recipient_name: recipient?.name || '',
          parcel_size: parcel?.size || 'small',
          weight_range: parcel?.weightRange || '0-1kg',
          category: parcel?.category,
          origin_region: route?.origin.region || '',
          origin_city_town: route?.origin.cityTown || '',
          origin_landmark: route?.origin.landmark,
          destination_region: route?.destination.region || '',
          destination_city_town: route?.destination.cityTown || '',
          destination_landmark: route?.destination.landmark,
          handover_method: handover?.method || 'DROPOFF',
          pickup_details: handover?.pickupDetails
            ? JSON.stringify(handover.pickupDetails)
            : null,
          selected_at_handover_agent_id: selectedAgent.id,
          shipment_code: shipmentCode,
          sender_handover_pin: senderPin,
          tracking_id: trackingId,
          base_price: basePrice,
          pickup_fee: pickupFee,
          total_price: totalPrice,
          status: 'PAID_AWAITING_HANDOVER',
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      await supabase.from('shipment_events').insert({
        shipment_id: data.id,
        event_type: 'CREATED',
        description: 'Shipment created and paid',
        actor_type: 'sender',
      });

      reset();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving shipment:', error);
      alert('Failed to save shipment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34B67A" />
        <Text style={styles.loadingText}>Finding nearby agents...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <CheckCircle2 size={48} color="#34B67A" />
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>Now set up secure handover</Text>
        </View>

        <View style={styles.codesCard}>
          <View style={styles.codeRow}>
            <QrCode size={24} color="#34B67A" />
            <View style={styles.codeContent}>
              <Text style={styles.codeLabel}>Shipment Code</Text>
              <Text style={styles.codeValue}>{shipmentCode}</Text>
            </View>
          </View>

          <View style={styles.codeDivider} />

          <View style={styles.codeRow}>
            <Shield size={24} color="#FF5B24" />
            <View style={styles.codeContent}>
              <Text style={styles.codeLabel}>Sender Handover PIN</Text>
              <Text style={styles.pinValue}>{senderPin}</Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Do not share your PIN until the agent asks for it and is ready to register your
              parcel.
            </Text>
          </View>
        </View>

        {handover?.method === 'DROPOFF' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Drop-off Agent</Text>
            <Text style={styles.sectionSubtitle}>
              Choose where you'll drop off your parcel
            </Text>

            {agents.length === 0 ? (
              <View style={styles.noAgentsBox}>
                <Text style={styles.noAgentsText}>
                  No agents found nearby. Please contact support.
                </Text>
              </View>
            ) : (
              agents.map((agent) => (
                <Pressable
                  key={agent.id}
                  style={[
                    styles.agentCard,
                    selectedAgent?.id === agent.id && styles.agentCardSelected,
                  ]}
                  onPress={() => handleAgentSelect(agent)}
                >
                  <View style={styles.agentHeader}>
                    <MapPin
                      size={20}
                      color={selectedAgent?.id === agent.id ? '#34B67A' : '#6B7280'}
                    />
                    <Text
                      style={[
                        styles.agentName,
                        selectedAgent?.id === agent.id && styles.agentNameSelected,
                      ]}
                    >
                      {agent.name}
                    </Text>
                  </View>
                  <Text style={styles.agentAddress}>{agent.addressText}</Text>
                  <Text style={styles.agentHours}>{agent.hours}</Text>
                </Pressable>
              ))
            )}
          </View>
        )}

        {handover?.method === 'PICKUP' && selectedAgent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Pickup Agent</Text>
            <View style={styles.agentCard}>
              <View style={styles.agentHeader}>
                <MapPin size={20} color="#34B67A" />
                <Text style={styles.agentName}>{selectedAgent.name}</Text>
              </View>
              <Text style={styles.agentAddress}>{selectedAgent.addressText}</Text>
              <Text style={styles.agentHours}>{selectedAgent.hours}</Text>
            </View>
            <Text style={styles.pickupNote}>
              The agent will contact you to arrange pickup at:{' '}
              {handover.pickupDetails?.landmark}
            </Text>
          </View>
        )}

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Next Steps</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>
              {handover?.method === 'DROPOFF'
                ? 'Go to the selected agent point'
                : 'Wait for agent to call you'}
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              Show your Shipment Code: {shipmentCode}
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              Agent will ask for your PIN. Only share it when they're ready to accept the parcel.
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>
              Recipient will receive SMS with tracking link
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.confirmButton, (!selectedAgent || saving) && styles.buttonDisabled]}
          onPress={handleSaveShipment}
          disabled={!selectedAgent || saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm & Finish</Text>
          )}
        </Pressable>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0B1220',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 4,
  },
  codesCard: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#34B67A',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeContent: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B1220',
    letterSpacing: 2,
  },
  codeDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 16,
  },
  pinValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF5B24',
    letterSpacing: 3,
  },
  warningBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255,91,36,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,91,36,0.18)',
  },
  warningText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5B24',
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
  },
  noAgentsBox: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  noAgentsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  agentCard: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    marginBottom: 12,
  },
  agentCardSelected: {
    borderColor: '#34B67A',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B1220',
  },
  agentNameSelected: {
    color: '#34B67A',
  },
  agentAddress: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  agentHours: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  pickupNote: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
  instructionsCard: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(52,182,122,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(52,182,122,0.18)',
  },
  instructionsTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34B67A',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0B1220',
    lineHeight: 20,
  },
  footer: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  confirmButton: {
    backgroundColor: '#34B67A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
