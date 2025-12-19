import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

type ContinueButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
};

export const ContinueButton = ({
  onPress,
  disabled = false,
  loading = false,
  label = 'Continue',
}: ContinueButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#34B67A',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#34B67A',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(107,114,128,0.3)',
    shadowOpacity: 0,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
