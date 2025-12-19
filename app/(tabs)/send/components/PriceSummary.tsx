import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';

export const PriceSummary = () => {
  const { selectedSize, selectedDeliveryMethod, totalPrice } = useSendParcel();

  if (!selectedSize) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Parcel</Text>
        <Text style={styles.value}>{selectedSize.label}</Text>
      </View>

      {selectedDeliveryMethod && selectedDeliveryMethod.additionalCost > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>{selectedDeliveryMethod.label}</Text>
          <Text style={styles.value}>{formatPrice(selectedDeliveryMethod.additionalCost)}</Text>
        </View>
      )}

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    marginHorizontal: 18,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  value: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B1220',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(11,18,32,0.08)',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B1220',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#34B67A',
  },
});
