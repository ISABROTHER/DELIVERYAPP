import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { 
  User, 
  Settings, 
  MapPin, 
  Bell, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  HelpCircle,
  CreditCard,
  History,
  Languages,
  Trash2,
  Mail
} from 'lucide-react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { UserDetailsCard } from './components/UserDetailsCard';
import { ProfileSectionCard } from './components/ProfileSectionCard';
import { ProfileRow } from './components/ProfileRow';
import { InfoBanner } from './components/InfoBanner';

export default function ProfileScreen() {
  const { signOut, user } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => signOut() 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserDetailsCard 
          name={user?.email?.split('@')[0] || 'User'} 
          email={user?.email || ''} 
        />

        <InfoBanner 
          title="Verify your account"
          message="Complete your profile to unlock all features."
          type="warning"
        />

        <ProfileSectionCard title="Account Settings">
          <ProfileRow 
            icon={User} 
            label="Edit Profile" 
            href="/(tabs)/profile/edit-profile" 
          />
          <ProfileRow 
            icon={MapPin} 
            label="Favorite Pickup Points" 
            href="/(tabs)/profile/favorite-pickup" 
          />
          <ProfileRow 
            icon={CreditCard} 
            label="Payment Methods" 
            href="/(tabs)/profile/payment" 
          />
          <ProfileRow 
            icon={Mail} 
            label="Mailbox Preferences" 
            href="/(tabs)/profile/mailbox-prefs" 
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Activity & Security">
          <ProfileRow 
            icon={History} 
            label="Receipts & History" 
            href="/(tabs)/profile/receipts" 
          />
          <ProfileRow 
            icon={Bell} 
            label="Notifications" 
            href="/(tabs)/profile/notifications" 
          />
          <ProfileRow 
            icon={Lock} 
            label="Change Password" 
            href="/(tabs)/profile/change-password" 
          />
          <ProfileRow 
            icon={ShieldCheck} 
            label="Data & Privacy" 
            href="/(tabs)/profile/data-privacy" 
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Preferences">
          <ProfileRow 
            icon={Languages} 
            label="Language & Country" 
            href="/(tabs)/profile/language-country" 
          />
          <ProfileRow 
            icon={HelpCircle} 
            label="Help & Support" 
            href="/(tabs)/profile/support" 
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Danger Zone">
          <ProfileRow 
            icon={Trash2} 
            label="Delete Account" 
            href="/(tabs)/profile/delete-profile"
            color="#FF3B30"
          />
          <ProfileRow 
            icon={LogOut} 
            label="Sign Out" 
            onPress={handleSignOut}
            color="#FF3B30"
            showArrow={false}
          />
        </ProfileSectionCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 40,
  },
});