import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, AlertTriangle, CheckSquare, Square } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const GREEN = '#34B67A';
const RED = '#FF3B30';

export default function DeleteProfileScreen() {
  const { signOut } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteProfile = async () => {
    if (!confirmed) {
      Alert.alert('Confirmation required', 'Please confirm that you want to delete your profile');
      return;
    }

    Alert.alert(
      'Delete Profile',
      'Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
              router.replace('/(auth)/login');
              Alert.alert(
                'Account Deleted',
                'Your account has been deleted successfully.'
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

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
        <Text style={styles.headerTitle}>Delete profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningCard}>
          <View style={styles.warningIconWrap}>
            <AlertTriangle size={48} color={RED} strokeWidth={2} />
          </View>
          <Text style={styles.warningTitle}>Permanent deletion</Text>
          <Text style={styles.warningMessage}>
            Deleting your profile is a permanent action that cannot be undone. All your data,
            including shipment history, preferences, and account information will be permanently
            deleted.
          </Text>
        </View>

        <View style={styles.consequencesCard}>
          <Text style={styles.consequencesTitle}>What will be deleted:</Text>
          <View style={styles.consequencesList}>
            <Text style={styles.consequenceItem}>• Your account and login credentials</Text>
            <Text style={styles.consequenceItem}>• All shipment history and tracking data</Text>
            <Text style={styles.consequenceItem}>• Saved payment methods</Text>
            <Text style={styles.consequenceItem}>• Notification preferences</Text>
            <Text style={styles.consequenceItem}>• Favorite pickup points</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.confirmRow,
            pressed && styles.confirmRowPressed,
          ]}
          onPress={() => setConfirmed(!confirmed)}
        >
          <View style={styles.checkboxWrap}>
            {confirmed ? (
              <CheckSquare size={24} color={RED} strokeWidth={2.5} />
            ) : (
              <Square size={24} color={MUTED} strokeWidth={2.5} />
            )}
          </View>
          <Text style={styles.confirmText}>
            I understand that this action is permanent and cannot be undone
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            !confirmed && styles.deleteButtonDisabled,
            loading && styles.deleteButtonDisabled,
            pressed && confirmed && !loading && styles.deleteButtonPressed,
          ]}
          onPress={handleDeleteProfile}
          disabled={!confirmed || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete my profile permanently</Text>
          )}
        </Pressable>

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

  warningCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.06)',
    borderRadius: 20,
    padding: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,59,48,0.16)',
    marginBottom: 24,
  },
  warningIconWrap: {
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: RED,
    marginBottom: 12,
  },
  warningMessage: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
    textAlign: 'center',
    lineHeight: 22,
  },

  consequencesCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 24,
  },
  consequencesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 14,
  },
  consequencesList: {
    gap: 10,
  },
  consequenceItem: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
    lineHeight: 20,
  },

  confirmRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 20,
  },
  confirmRowPressed: {
    opacity: 0.6,
  },
  checkboxWrap: {
    marginTop: 2,
  },
  confirmText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
    lineHeight: 20,
  },

  deleteButton: {
    backgroundColor: RED,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: RED,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  deleteButtonDisabled: {
    opacity: 0.4,
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  bottomSpace: {
    height: 40,
  },
});
