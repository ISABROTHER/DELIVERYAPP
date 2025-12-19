import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Pressable } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { PriceSummary } from '../components/PriceSummary';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel, SenderInfo } from '../context/SendParcelContext';
import { ChevronDown, User, Mail, MapPin, Phone } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const GHANA_REGIONS = [
  'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern', 'Greater Accra', 
  'Northern', 'North East', 'Oti', 'Savannah', 'Upper East', 'Upper West', 
  'Volta', 'Western', 'Western North'
].sort();

export const Step3Sender = ({ onNext }: { onNext: () => void }) => {
  const { sender, updateSender } = useSendParcel();

  const [phone, setPhone] = useState(sender?.phone || '');
  const [name, setName] = useState(sender?.name || '');
  const [address, setAddress] = useState(sender?.address || '');
  const [region, setRegion] = useState(sender?.region || '');
  const [city, setCity] = useState(sender?.city || '');
  const [area, setArea] = useState(sender?.area || '');
  const [email, setEmail] = useState(sender?.email || '');
  
  const [showRegions, setShowRegions] = useState(false);

  const isValid =
    phone.length >= 10 &&
    name.trim().length > 2 &&
    address.trim().length > 2 &&
    region !== '' &&
    city.trim().length > 1 &&
    area.trim().length > 1 &&
    email.includes('@');

  const handleContinue = () => {
    if (isValid) {
      const senderInfo: SenderInfo = {
        phone,
        name,
        address,
        region,
        city,
        area,
        email,
      };
      updateSender(senderInfo);
      onNext();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
      >
        <StepHeader title="Sender Information" subtitle="Enter your details" />

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Phone size={14} color="#6B7280" />
              <Text style={styles.label}>Phone Number *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 024XXXXXXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <User size={14} color="#6B7280" />
              <Text style={styles.label}>First Name and Surname *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.label}>Address *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Street address / House number"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.label}>Region *</Text>
            </View>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowRegions(!showRegions)}
            >
              <Text style={[styles.dropdownText, !region && styles.placeholder]}>
                {region || 'Select region'}
              </Text>
              <ChevronDown size={20} color="#8E8E93" />
            </Pressable>
            {showRegions && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {GHANA_REGIONS.map((r) => (
                    <Pressable
                      key={r}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setRegion(r);
                        setShowRegions(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{r}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Accra"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Area *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. East Legon"
                value={area}
                onChangeText={setArea}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Mail size={14} color="#6B7280" />
              <Text style={styles.label}>Email Address *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <PriceSummary />

        {/* Continue is now at the end of information */}
        <View style={styles.buttonWrapper}>
          <ContinueButton onPress={handleContinue} disabled={!isValid} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
  form: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B1220',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1220',
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1220',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
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