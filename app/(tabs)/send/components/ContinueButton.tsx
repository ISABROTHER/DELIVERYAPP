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
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    // Removed large bottom margin to allow tight positioning
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});