import { Link, type Href } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '../styles/azulCivico';

type ActionVariant = 'primary' | 'secondary';

export function AzulCivicoButton({
  label,
  onPress,
  busy = false,
}: {
  label: string;
  onPress: () => void;
  busy?: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy, disabled: busy }}
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles.primary, pressed && styles.pressed]}
    >
      <ActionContent label={label} variant="primary" busy={busy} />
    </Pressable>
  );
}

export function AzulCivicoLink({
  href,
  label,
  replace,
  variant = 'secondary',
  disabled = false,
}: {
  href: Href;
  label: string;
  replace?: boolean;
  variant?: ActionVariant;
  disabled?: boolean;
}) {
  return (
    <Link href={href} replace={replace} asChild>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="link"
        accessibilityState={{ disabled }}
        disabled={disabled}
        style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed]}
      >
        <ActionContent label={label} variant={variant} />
      </Pressable>
    </Link>
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
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
      {isPrimary && (
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
  label: {
    ...typography.control,
    textAlign: 'center',
  },
  primaryLabel: {
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
