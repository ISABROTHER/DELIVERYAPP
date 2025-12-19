import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ProfileSectionCard } from './components/ProfileSectionCard';
import { InfoBanner } from './components/InfoBanner';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const GREEN = '#34B67A';

interface NotificationPrefs {
  sms_enabled: boolean;
  email_enabled: boolean;
  notify_customs: boolean;
  notify_business: boolean;
  notify_parcel_on_way: boolean;
  notify_ready_for_pickup: boolean;
  notify_delivered: boolean;
  notify_delays: boolean;
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    sms_enabled: true,
    email_enabled: true,
    notify_customs: true,
    notify_business: false,
    notify_parcel_on_way: true,
    notify_ready_for_pickup: true,
    notify_delivered: true,
    notify_delays: true,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setPrefs({
          sms_enabled: data.sms_enabled,
          email_enabled: data.email_enabled,
          notify_customs: data.notify_customs,
          notify_business: data.notify_business,
          notify_parcel_on_way: data.notify_parcel_on_way,
          notify_ready_for_pickup: data.notify_ready_for_pickup,
          notify_delivered: data.notify_delivered,
          notify_delays: data.notify_delays,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!user) return;

    setPrefs((prev) => ({ ...prev, [key]: value }));

    try {
      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingPrefs) {
        await supabase
          .from('user_preferences')
          .update({ [key]: value })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_preferences')
          .insert({ user_id: user.id, [key]: value });
      }
    } catch (error) {
      console.error('Error updating preference:', error);
      setPrefs((prev) => ({ ...prev, [key]: !value }));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <ChevronLeft size={24} color={GREEN} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Profile</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSectionCard>
          <ToggleRow
            label="Customs documentation and payment"
            value={prefs.notify_customs}
            onValueChange={(val) => updatePreference('notify_customs', val)}
          />
          <ToggleRow
            label="Parcels for business"
            value={prefs.notify_business}
            onValueChange={(val) => updatePreference('notify_business', val)}
            isLast
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="SMS">
          <ToggleRow
            label="Notifications on SMS"
            value={prefs.sms_enabled}
            onValueChange={(val) => updatePreference('sms_enabled', val)}
            isLast
          />
        </ProfileSectionCard>

        <InfoBanner
          message="You may still get SMSes with important information about your shipments even if SMS notifications are turned off."
          style={styles.banner}
        />

        <ProfileSectionCard>
          <ToggleRow
            label="Parcel on its way"
            value={prefs.notify_parcel_on_way}
            onValueChange={(val) => updatePreference('notify_parcel_on_way', val)}
          />
          <ToggleRow
            label="Parcel ready for pickup"
            value={prefs.notify_ready_for_pickup}
            onValueChange={(val) => updatePreference('notify_ready_for_pickup', val)}
          />
          <ToggleRow
            label="Delivered"
            value={prefs.notify_delivered}
            onValueChange={(val) => updatePreference('notify_delivered', val)}
          />
          <ToggleRow
            label="Delays and deviations"
            value={prefs.notify_delays}
            onValueChange={(val) => updatePreference('notify_delays', val)}
            isLast
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Email">
          <ToggleRow
            label="Notifications on email"
            value={prefs.email_enabled}
            onValueChange={(val) => updatePreference('email_enabled', val)}
            isLast
          />
        </ProfileSectionCard>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
}

function ToggleRow({ label, value, onValueChange, isLast = false }: ToggleRowProps) {
  return (
    <>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#D1D5DB', true: 'rgba(52,182,122,0.4)' }}
          thumbColor={value ? GREEN : '#F3F4F6'}
          ios_backgroundColor="#D1D5DB"
        />
      </View>
      {!isLast && <View style={styles.separator} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: BG,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  backLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: GREEN,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: TEXT,
    letterSpacing: -0.5,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  banner: {
    marginBottom: 24,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  toggleLabel: {
    fontSize: 15.5,
    fontWeight: '700',
    color: TEXT,
    flex: 1,
    marginRight: 16,
  },

  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 16,
  },

  bottomSpace: {
    height: 40,
  },
});
