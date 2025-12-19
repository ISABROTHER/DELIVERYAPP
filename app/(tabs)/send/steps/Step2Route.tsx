import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { PriceSummary } from '../components/PriceSummary';
import { useSendParcel, Route } from '../context/SendParcelContext';
import { MapPin, Navigation, ChevronDown } from 'lucide-react-native';

const GHANA_REGIONS = [
  'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern', 'Greater Accra', 
  'Northern', 'North East', 'Oti', 'Savannah', 'Upper East', 'Upper West', 
  'Volta', 'Western', 'Western North'
].sort();

export const Step2Route = ({ onNext }: { onNext: () => void }) => {
  const { route, updateRoute } = useSendParcel();
  const [origin, setOrigin] = useState(route?.origin || { region: '', cityTown: '' });
  const [dest, setDest] = useState(route?.destination || { region: '', cityTown: '' });
  const [showOriginPicker, setShowOriginPicker] = useState(false);
  const [showDestPicker, setShowDestPicker] = useState(false);

  const handleContinue = () => {
    if (origin.region && origin.cityTown && dest.region && dest.cityTown) {
      updateRoute({ origin, destination: dest });
      onNext();
    }
  };

  const isComplete = origin.region && origin.cityTown && dest.region && dest.cityTown;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader title="Route" subtitle="Where is the parcel coming from and going to?" />

        {/* Origin Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeader}><MapPin size={20} color="#34B67A" /><Text style={styles.cardTitle}>Origin (From)</Text></View>
          <Text style={styles.label}>Region *</Text>
          <Pressable style={styles.picker} onPress={() => setShowOriginPicker(!showOriginPicker)}>
            <Text style={[styles.pickerText, !origin.region && styles.placeholder]}>{origin.region || 'Select region'}</Text>
            <ChevronDown size={20} color="#8E8E93" />
          </Pressable>
          {showOriginPicker && (
            <View style={styles.dropdown}>
              {GHANA_REGIONS.map(r => (
                <Pressable key={r} style={styles.dropItem} onPress={() => { setOrigin({...origin, region: r}); setShowOriginPicker(false); }}>
                  <Text style={styles.dropText}>{r}</Text>
                </Pressable>
              ))}
            </View>
          )}
          <Text style={styles.label}>City/Town *</Text>
          <TextInput style={styles.input} value={origin.cityTown} onChangeText={t => setOrigin({...origin, cityTown: t})} placeholder="e.g., Accra" placeholderTextColor="#9CA3AF" />
        </View>

        {/* Destination Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeader}><Navigation size={20} color="#34B67A" /><Text style={styles.cardTitle}>Destination (To)</Text></View>
          <Text style={styles.label}>Region *</Text>
          <Pressable style={styles.picker} onPress={() => setShowDestPicker(!showDestPicker)}>
            <Text style={[styles.pickerText, !dest.region && styles.placeholder]}>{dest.region || 'Select region'}</Text>
            <ChevronDown size={20} color="#8E8E93" />
          </Pressable>
          {showDestPicker && (
            <View style={styles.dropdown}>
              {GHANA_REGIONS.map(r => (
                <Pressable key={r} style={styles.dropItem} onPress={() => { setDest({...dest, region: r}); setShowDestPicker(false); }}>
                  <Text style={styles.dropText}>{r}</Text>
                </Pressable>
              ))}
            </View>
          )}
          <Text style={styles.label}>City/Town *</Text>
          <TextInput style={styles.input} value={dest.cityTown} onChangeText={t => setDest({...dest, cityTown: t})} placeholder="e.g., Kumasi" placeholderTextColor="#9CA3AF" />
        </View>

        <PriceSummary />
      </ScrollView>
      <ContinueButton onPress={handleContinue} disabled={!isComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  card: { marginHorizontal: 18, marginBottom: 20, padding: 16, backgroundColor: 'rgba(255,255,255,0.62)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: '900', color: '#0B1220' },
  label: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: '700', color: '#0B1220' },
  picker: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between' },
  pickerText: { fontSize: 15, fontWeight: '700', color: '#0B1220' },
  placeholder: { color: '#9CA3AF' },
  dropdown: { marginTop: 8, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', maxHeight: 200, overflow: 'hidden' },
  dropItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropText: { fontSize: 15, fontWeight: '600' }
});