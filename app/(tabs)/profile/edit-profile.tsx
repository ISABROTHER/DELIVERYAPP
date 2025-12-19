import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Loader } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const BG_CARD = '#FFFFFF';
const PRIMARY = '#3B82F6';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setCity(data.city || '');
        setCountry(data.country || '');
      }
    } catch (err) {
      console.error('Load profile error:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(
          {
            user_id: user.id,
            full_name: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim(),
            country: country.trim(),
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;

      router.back();
    } catch (err) {
      console.error('Save profile error:', err);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loaderContainer}>
          <Loader size={32} color={PRIMARY} />
          <Text style={styles.loaderText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={MUTED}
            value={fullName}
            onChangeText={setFullName}
            editable={!saving}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor={MUTED}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!saving}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your street address"
            placeholderTextColor={MUTED}
            value={address}
            onChangeText={setAddress}
            editable={!saving}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            placeholderTextColor={MUTED}
            value={city}
            onChangeText={setCity}
            editable={!saving}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your country"
            placeholderTextColor={MUTED}
            value={country}
            onChangeText={setCountry}
            editable={!saving}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <Loader size={20} color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
  },

  headerSpacer: {
    width: 40,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },

  loaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },

  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },

  formGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 8,
  },

  input: {
    backgroundColor: BG_CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
    color: TEXT,
  },

  saveButton: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  bottomSpace: {
    height: 40,
  },
});
