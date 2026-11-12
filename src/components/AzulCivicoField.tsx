import { useState } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { colors, typography } from '../styles/azulCivico';

export function AzulCivicoField({
  label,
  error,
  accessibilityHint,
  onFocus,
  onBlur,
  style,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        accessibilityHint={error ?? accessibilityHint}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        underlineColorAndroid="transparent"
        style={[styles.input, style, focused && styles.focusedInput, error && styles.invalidInput]}
      />
      {error && (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    ...typography.control,
    color: colors.text,
  },
  input: {
    ...typography.body,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.field,
    color: colors.text,
  },
  focusedInput: {
    borderColor: colors.primary,
  },
  invalidInput: {
    borderColor: colors.error,
  },
  error: {
    ...typography.message,
    color: colors.error,
  },
});
