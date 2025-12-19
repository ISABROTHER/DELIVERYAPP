import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import {
  MapPin,
  Package,
  Receipt,
  CreditCard,
  Bell,
  Globe,
  ShieldCheck,
  KeyRound,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ProfileSectionCard } from './components/ProfileSectionCard';
import { ProfileRow } from './components/ProfileRow';
import { UserDetailsCard } from './components/UserDetailsCard';

const BG = '#F2F2F7'; // iOS grouped background
const TEXT = '#111827';
const MUTED = '#6B7280';

export default function ProfileHomeScreen() {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  const intro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [intro]);

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [user?.id])
  );

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setUserProfile(data);
    } catch (err) {
      console.error('Load profile error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  const displayName = useMemo(() => userProfile?.full_name || 'Your account', [userProfile?.full_name]);
  const displayEmail = useMemo(() => user?.email || '', [user?.email]);

  const heroAnimStyle = {
    opacity: intro,
    transform: [
      {
        translateY: intro.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={heroAnimStyle}>
          <UserDetailsCard
            fullName={displayName}
            email={displayEmail}
            phone={userProfile?.phone}
            address={userProfile?.address}
          />
        </Animated.View>

        <Animated.View style={heroAnimStyle}>
          <ProfileSectionCard title="Pickup preferences">
            <ProfileRow
              icon={MapPin}
              label="Favorite pickup point"
              onPress={() => router.push('/(tabs)/profile/favorite-pickup')}
            />
            <ProfileRow
              icon={Package}
              label="Parcel in the mailbox"
              onPress={() => router.push('/(tabs)/profile/mailbox-prefs')}
              isLast
            />
          </ProfileSectionCard>

          <ProfileSectionCard title="Payments & receipts">
            <ProfileRow
              icon={Receipt}
              label="Receipts"
              onPress={() => router.push('/(tabs)/profile/receipts')}
            />
            <ProfileRow
              icon={CreditCard}
              label="Payment"
              onPress={() => router.push('/(tabs)/profile/payment')}
              isLast
            />
          </ProfileSectionCard>

          <ProfileSectionCard title="Settings">
            <ProfileRow
              icon={Bell}
              label="Notifications"
              onPress={() => router.push('/(tabs)/profile/notifications')}
            />
            <ProfileRow
              icon={Globe}
              label="Language and country"
              onPress={() => router.push('/(tabs)/profile/language-country')}
            />
            <ProfileRow
              icon={ShieldCheck}
              label="Data and privacy"
              onPress={() => router.push('/(tabs)/profile/data-privacy')}
              isLast
            />
          </ProfileSectionCard>

          <ProfileSectionCard title="Account">
            <ProfileRow
              icon={KeyRound}
              label="Change password"
              onPress={() => router.push('/(tabs)/profile/change-password')}
            />
            <ProfileRow
              icon={Trash2}
              label="Delete profile"
              onPress={() => router.push('/(tabs)/profile/delete-profile')}
              destructive
            />
            <ProfileRow
              icon={LogOut}
              label="Log out"
              onPress={handleSignOut}
              showChevron={false}
              destructive
              isLast
            />
          </ProfileSectionCard>

          <View style={styles.supportSection}>
            <Text style={styles.supportTitle}>Contact and support</Text>
            <Text style={styles.supportText}>
              Need help? Visit our support center or contact us at support@parcelgh.com
            </Text>
          </View>

          <View style={styles.bottomSpace} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  supportSection: {
    marginTop: 2,
    paddingHorizontal: 4,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: MUTED,
    marginBottom: 8,
    marginLeft: 12,
  },
  supportText: {
    fontSize: 15,
    fontWeight: '400',
    color: MUTED,
    lineHeight: 20,
    marginLeft: 12,
    marginRight: 12,
  },

  bottomSpace: {
    height: 40,
  },
});
