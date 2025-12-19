import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Plus, CreditCard, Smartphone } from 'lucide-react-native';
import { ProfileSectionCard } from './components/ProfileSectionCard';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const GREEN = '#34B67A';

export default function PaymentScreen() {
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
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSectionCard title="Your stored cards">
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <CreditCard size={40} color={MUTED} strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>No saved cards</Text>
            <Text style={styles.emptyMessage}>
              You have no saved payment cards. Add a card to make future payments faster.
            </Text>
          </View>
        </ProfileSectionCard>

        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={() => {}}
        >
          <View style={styles.addIconWrap}>
            <Plus size={20} color={GREEN} strokeWidth={3} />
          </View>
          <Text style={styles.addLabel}>Add card</Text>
        </Pressable>

        <ProfileSectionCard title="Other forms of payment" style={styles.otherSection}>
          <Pressable
            style={({ pressed }) => [styles.paymentRow, pressed && styles.rowPressed]}
            onPress={() => {}}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentIconWrap}>
                <Smartphone size={20} color={TEXT} strokeWidth={2.5} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Mobile Money</Text>
                <Text style={styles.paymentDesc}>Pay with MTN or Vodafone Cash</Text>
              </View>
            </View>
          </Pressable>
        </ProfileSectionCard>

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

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(52,182,122,0.3)',
    marginBottom: 32,
  },
  addButtonPressed: {
    opacity: 0.6,
  },
  addIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(52,182,122,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: GREEN,
  },

  otherSection: {
    marginTop: 0,
  },

  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowPressed: {
    opacity: 0.6,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  paymentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(52,182,122,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
  },

  bottomSpace: {
    height: 40,
  },
});
