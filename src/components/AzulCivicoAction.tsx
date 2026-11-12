import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '../styles/azulCivico';

type ActionVariant = 'primary' | 'secondary';

export function AzulCivicoButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles.primary, pressed && styles.pressed]}
    >
      <ActionContent label={label} variant="primary" />
    </Pressable>
  );
}

export function AzulCivicoLink({
  href,
  label,
  replace,
  variant = 'secondary',
}: {
  href: Href;
  label: string;
  replace?: boolean;
  variant?: ActionVariant;
}) {
  return (
    <Link href={href} replace={replace} asChild>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="link"
        style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed]}
      >
        <ActionContent label={label} variant={variant} />
      </Pressable>
    </Link>
  );
}

function ActionContent({ label, variant }: { label: string; variant: ActionVariant }) {
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
          <Text allowFontScaling={false} style={styles.arrowLabel}>
            →
          </Text>
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
