import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { CheckCircle2, Shield } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Step6SecureHandover = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.header}>
          <View style={styles.successIcon}><CheckCircle2 size={40} color="#FFF" /></View>
          <Text style={styles.title}>Shipment Created!</Text>
        </View>

        <View style={styles.glassCard}>
          <View style={styles.row}>
            <Shield size={18} color="#FF5B24" />
            <Text style={styles.pinLabel}>SENDER SECURITY PIN</Text>
          </View>
          <Text style={styles.pinValue}>123 456</Text>
          <Text style={styles.pinNote}>Share this only with the agent during pickup.</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable style={styles.finishButton} onPress={onComplete}>
          <Text style={styles.finishText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, padding: 24 },
  scrollPadding: { paddingBottom: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#34B67A', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#0B1220' },
  glassCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pinLabel: { fontSize: 11, fontWeight: '800', color: '#FF5B24', letterSpacing: 1 },
  pinValue: { fontSize: 32, fontWeight: '900', color: '#0B1220', letterSpacing: 4, marginVertical: 8 },
  pinNote: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  footer: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: SCREEN_HEIGHT * 0.08, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  finishButton: { backgroundColor: '#0B1220', padding: 18, borderRadius: 16, alignItems: 'center' },
  finishText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});