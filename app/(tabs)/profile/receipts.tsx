import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Receipt } from 'lucide-react-native';
import { InfoBanner } from './components/InfoBanner';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const GREEN = '#34B67A';

export default function ReceiptsScreen() {
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
        <Text style={styles.headerTitle}>Receipts</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          All receipts for your shipments are stored here. You can view and download them at any
          time for your records.
        </Text>

        <InfoBanner
          message="Receipts for purchases made before January 1, 2025 can be found in your email inbox."
          style={styles.banner}
        />

        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Receipt size={48} color={MUTED} strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>No receipts yet</Text>
          <Text style={styles.emptyMessage}>
            When you create shipments, your receipts will appear here.
          </Text>
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
    marginBottom: 20,
  },

  banner: {
    marginBottom: 32,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },

  bottomSpace: {
    height: 40,
  },
});
 