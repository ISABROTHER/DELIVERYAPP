import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const GREEN = '#34B67A';

export default function DataPrivacyScreen() {
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
        <Text style={styles.headerTitle}>Data and privacy</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.placeholderCard}>
          <View style={styles.placeholderIconWrap}>
            <ShieldCheck size={48} color={GREEN} strokeWidth={2} />
          </View>
          <Text style={styles.placeholderTitle}>Your privacy matters</Text>
          <Text style={styles.placeholderMessage}>
            Detailed data and privacy settings will be available soon. We are committed to
            protecting your personal information and giving you control over your data.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What we protect</Text>
          <Text style={styles.infoText}>
            • Your personal information{'\n'}• Shipment details and history{'\n'}• Payment
            information{'\n'}• Communication preferences
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
    paddingTop: 40,
  },

  placeholderCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 24,
  },
  placeholderIconWrap: {
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 12,
  },
  placeholderMessage: {
    fontSize: 15,
    fontWeight: '600',
    color: MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },

  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
    lineHeight: 24,
  },

  bottomSpace: {
    height: 40,
  },
});
