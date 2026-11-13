import { useState } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

export function AzulCivicoField({
  label,
  error,
  accessibilityHint,
  onFocus,
  onBlur,
  style,
  className,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-2">
      <Text className="text-civic-body font-semibold text-civic-text">{label}</Text>
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
        className={`min-h-14 rounded-[14px] border bg-civic-field px-4 py-[15px] text-civic-body text-civic-text
          ${error ? 'border-civic-error' : focused ? 'border-civic-primary' : 'border-civic-border'}
          ${className ?? ''}`}
        style={style}
      />
      {error && (
        <Text accessibilityLiveRegion="polite" className="text-civic-message text-civic-error">
          {error}
        </Text>
      )}
    </View>
  );
}
