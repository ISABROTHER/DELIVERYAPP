import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const GREEN = '#34B67A';
const RED = '#FF3B30';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert('Success', 'Password updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating password:', error);
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>Change password</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Create a strong password to keep your account secure. Your password must be at least 6
          characters long.
        </Text>

        <View style={styles.form}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Current password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrent}
                placeholder="Enter current password"
                placeholderTextColor={MUTED}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowCurrent(!showCurrent)}
                style={styles.eyeButton}
              >
                {showCurrent ? (
                  <EyeOff size={20} color={MUTED} strokeWidth={2.5} />
                ) : (
                  <Eye size={20} color={MUTED} strokeWidth={2.5} />
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>New password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                placeholder="Enter new password"
                placeholderTextColor={MUTED}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowNew(!showNew)} style={styles.eyeButton}>
                {showNew ? (
                  <EyeOff size={20} color={MUTED} strokeWidth={2.5} />
                ) : (
                  <Eye size={20} color={MUTED} strokeWidth={2.5} />
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Confirm new password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                placeholder="Confirm new password"
                placeholderTextColor={MUTED}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeButton}
              >
                {showConfirm ? (
                  <EyeOff size={20} color={MUTED} strokeWidth={2.5} />
                ) : (
                  <Eye size={20} color={MUTED} strokeWidth={2.5} />
                )}
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.updateButton,
              loading && styles.updateButtonDisabled,
              pressed && !loading && styles.updateButtonPressed,
            ]}
            onPress={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.updateButtonText}>Update password</Text>
            )}
          </Pressable>
        </View>

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

  description: {
    fontSize: 15,
    fontWeight: '600',
    color: MUTED,
    lineHeight: 22,
    marginBottom: 24,
  },

  form: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  fieldWrap: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 8,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(247,247,250,0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    padding: 4,
  },

  updateButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: GREEN,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonPressed: {
    opacity: 0.8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  bottomSpace: {
    height: 40,
  },
});
