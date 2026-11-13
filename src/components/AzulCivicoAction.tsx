import { Link, type Href } from 'expo-router';
import type { ComponentPropsWithRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '../styles/azulCivico';

type LinkVariant = 'primary' | 'secondary';
type ButtonVariant = 'primary' | 'danger';
type ActionVariant = LinkVariant | ButtonVariant;

export function AzulCivicoButton({
  label,
  onPress,
  busy = false,
  disabled = false,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  busy?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
}) {
  return (
    <ActionPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy, disabled: busy || disabled }}
      disabled={busy || disabled}
      onPress={onPress}
      variant={variant}
    >
      <ActionContent label={label} variant={variant} busy={busy} />
    </ActionPressable>
  );
}

export function AzulCivicoLink({
  href,
  label,
  accessibilityLabel = label,
  replace,
  variant = 'secondary',
  disabled = false,
}: {
  href: Href;
  label: string;
  accessibilityLabel?: string;
  replace?: boolean;
  variant?: LinkVariant;
  disabled?: boolean;
}) {
  return (
    <Link href={href} replace={replace} asChild>
      <ActionPressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="link"
        accessibilityState={{ disabled }}
        disabled={disabled}
        variant={variant}
      >
        <ActionContent label={label} variant={variant} />
      </ActionPressable>
    </Link>
  );
}

function ActionPressable({
  variant,
  ...props
}: Omit<ComponentPropsWithRef<typeof Pressable>, 'style'> & { variant: ActionVariant }) {
  // Link asChild merges styles as objects, so attach the callback after the merge.
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed]}
    />
  );
}

function ActionContent({
  label,
  variant,
  busy = false,
}: {
  label: string;
  variant: ActionVariant;
  busy?: boolean;
}) {
  const isPrimary = variant === 'primary';

  return (
    <>
      <Text style={[styles.label, variant === 'secondary' ? styles.secondaryLabel : styles.filledLabel]}>
        {label}
      </Text>
      {(isPrimary || busy) && (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={styles.arrow}
        >
          {busy ? (
            <ActivityIndicator color={colors.surface} size="small" />
          ) : (
            <Text allowFontScaling={false} style={styles.arrowLabel}>
              →
            </Text>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  primary: {
    minHeight: 56,
    paddingHorizontal: 52,
    backgroundColor: colors.primary,
  },
  secondary: {
    minHeight: 52,
    backgroundColor: colors.secondary,
  },
  danger: {
    minHeight: 56,
    paddingHorizontal: 52,
    backgroundColor: colors.error,
  },
  label: {
    ...typography.control,
    textAlign: 'center',
  },
  filledLabel: {
    color: colors.surface,
  },
  secondaryLabel: {
    color: colors.secondaryText,
  },
  arrow: {
    position: 'absolute',
    top: 0,
    right: 24,
    bottom: 0,
    justifyContent: 'center',
  },
  arrowLabel: {
    ...typography.control,
    color: colors.surface,
    fontSize: 21,
  },
  pressed: {
    opacity: 0.86,
  },
});
