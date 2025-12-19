import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel, SenderInfo, RecipientInfo } from '../context/SendParcelContext';
import { User, UserCheck, ChevronDown, ChevronUp } from 'lucide-react-native';

type Step4PartiesProps = {
  onNext: () => void;
};

export const Step4Parties = ({ onNext }: Step4PartiesProps) => {
  const { sender, recipient, route, updateSender, updateRecipient } = useSendParcel();

  const [senderExpanded, setSenderExpanded] = useState(true);
  const [recipientExpanded, setRecipientExpanded] = useState(false);

  const [senderName, setSenderName] = useState(sender?.name || '');
  const [senderPhone, setSenderPhone] = useState(sender?.phone || '');

  const [recipientName, setRecipientName] = useState(recipient?.name || '');
  const [recipientPhone, setRecipientPhone] = useState(recipient?.phone || '');
  const [recipientLandmark, setRecipientLandmark] = useState(recipient?.landmark || '');

  const handleContinue = () => {
    if (senderName && senderPhone && recipientName && recipientPhone) {
      updateSender({ name: senderName, phone: senderPhone });
      updateRecipient({
        name: recipientName,
        phone: recipientPhone,
        landmark: recipientLandmark || undefined,
      });
      onNext();
    }
  };

  const canContinue = senderName && senderPhone && recipientName && recipientPhone;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader
          title="Sender & Recipient"
          subtitle="Who is sending and receiving this parcel?"
        />

        <View style={styles.accordion}>
          <Pressable
            style={styles.accordionHeader}
            onPress={() => setSenderExpanded(!senderExpanded)}
          >
            <View style={styles.accordionTitleRow}>
              <User size={20} color="#34B67A" />
              <Text style={styles.accordionTitle}>Sender</Text>
            </View>
            {senderExpanded ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </Pressable>

          {senderExpanded && (
            <View style={styles.accordionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={senderName}
                  onChangeText={setSenderName}
                  placeholder="Your full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={senderPhone}
                  onChangeText={setSenderPhone}
                  placeholder="+233 XX XXX XXXX"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.readonlyBox}>
                <Text style={styles.readonlyLabel}>Origin</Text>
                <Text style={styles.readonlyValue}>
                  {route?.origin.cityTown}, {route?.origin.region}
                  {route?.origin.landmark && ` (${route.origin.landmark})`}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.accordion}>
          <Pressable
            style={styles.accordionHeader}
            onPress={() => setRecipientExpanded(!recipientExpanded)}
          >
            <View style={styles.accordionTitleRow}>
              <UserCheck size={20} color="#34B67A" />
              <Text style={styles.accordionTitle}>Recipient</Text>
            </View>
            {recipientExpanded ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </Pressable>

          {recipientExpanded && (
            <View style={styles.accordionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  placeholder="Recipient's full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={recipientPhone}
                  onChangeText={setRecipientPhone}
                  placeholder="+233 XX XXX XXXX"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
                <Text style={styles.hint}>
                  Recipient will receive SMS updates (no app required)
                </Text>
              </View>

              <View style={styles.readonlyBox}>
                <Text style={styles.readonlyLabel}>Destination</Text>
                <Text style={styles.readonlyValue}>
                  {route?.destination.cityTown}, {route?.destination.region}
                  {route?.destination.landmark && ` (${route.destination.landmark})`}
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Additional Landmark (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={recipientLandmark}
                  onChangeText={setRecipientLandmark}
                  placeholder="e.g., White gate, second floor"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Recipient does not need our app to receive the parcel. They'll get SMS notifications and a tracking link.
          </Text>
        </View>
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
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
  accordion: {
    marginHorizontal: 18,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accordionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0B1220',
  },
  accordionContent: {
    padding: 16,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
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
  hint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 6,
  },
  readonlyBox: {
    backgroundColor: 'rgba(52,182,122,0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  readonlyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  readonlyValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B1220',
  },
  infoBox: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(52,182,122,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(52,182,122,0.18)',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    lineHeight: 20,
  },
});
