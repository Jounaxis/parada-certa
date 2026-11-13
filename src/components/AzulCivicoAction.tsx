import { Link, type Href } from 'expo-router';
import type { ComponentPropsWithRef } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type LinkVariant = 'primary' | 'secondary';
type ButtonVariant = 'primary' | 'danger';
type ActionVariant = LinkVariant | ButtonVariant;

const buttonVariants = {
  primary: 'min-h-14 bg-civic-primary px-[52px]',
  secondary: 'min-h-[52px] bg-civic-secondary px-4',
  danger: 'min-h-14 bg-civic-error px-[52px]',
} satisfies Record<ActionVariant, string>;

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
}: Omit<ComponentPropsWithRef<typeof Pressable>, 'className'> & { variant: ActionVariant }) {
  return (
    <Pressable
      {...props}
      className={`items-center justify-center rounded-2xl py-3 active:opacity-[0.86] ${buttonVariants[variant]}`}
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
      <Text
        className={`text-center text-civic-body font-semibold
          ${variant === 'secondary' ? 'text-civic-secondary-text' : 'text-civic-surface'}`}
      >
        {label}
      </Text>
      {(isPrimary || busy) && (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          className="absolute inset-y-0 right-6 justify-center"
        >
          {busy ? (
            <ActivityIndicator colorClassName="accent-civic-surface" size="small" />
          ) : (
            <Text allowFontScaling={false} className="text-[21px]/[24px] font-semibold text-civic-surface">
              →
            </Text>
          )}
        </View>
      )}
    </>
  );
}
