import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Package } from 'lucide-react-native';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const GREEN = '#34B67A';

export default function MailboxPrefsScreen() {
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
        <Text style={styles.headerTitle}>Parcel in the mailbox</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.placeholderCard}>
          <View style={styles.placeholderIconWrap}>
            <Package size={48} color={MUTED} strokeWidth={2} />
          </View>
          <Text style={styles.placeholderTitle}>Mailbox delivery</Text>
          <Text style={styles.placeholderMessage}>
            Mailbox delivery preferences will be available soon. This feature will allow you to
            receive small parcels directly in your mailbox.
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

  bottomSpace: {
    height: 40,
  },
});
