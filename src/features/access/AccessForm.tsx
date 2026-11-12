import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { actionStyles, colors } from '../../styles/access';

type AccessMode = 'login' | 'registration';
type Submission = 'idle' | 'invalid' | 'validated';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function AccessForm({ mode }: { mode: AccessMode }) {
  const isRegistration = mode === 'registration';
  const [fields, setFields] = useState({ name: '', email: '', password: '' });
  const [submission, setSubmission] = useState<Submission>('idle');

  const nameError = isRegistration && !fields.name.trim() ? 'Informe seu nome.' : undefined;
  const emailError = emailPattern.test(fields.email.trim()) ? undefined : 'Informe um e-mail válido.';
  const passwordError = fields.password.trim() ? undefined : 'Informe sua senha.';
  const showErrors = submission === 'invalid';

  function updateField(field: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setSubmission((current) => (current === 'validated' ? 'idle' : current));
  }

  function handleSubmit() {
    if (nameError || emailError || passwordError) {
      setSubmission('invalid');
      return;
    }

    Keyboard.dismiss();
    setSubmission('validated');
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          {isRegistration && (
            <AccessField
              label="Nome"
              autoCapitalize="words"
              autoComplete="name"
              value={fields.name}
              onChangeText={(value) => updateField('name', value)}
              error={showErrors ? nameError : undefined}
            />
          )}
          <AccessField
            label="E-mail"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            value={fields.email}
            onChangeText={(value) => updateField('email', value)}
            error={showErrors ? emailError : undefined}
          />
          <AccessField
            label="Senha"
            autoCapitalize="none"
            autoComplete={isRegistration ? 'new-password' : 'current-password'}
            autoCorrect={false}
            secureTextEntry
            returnKeyType="done"
            value={fields.password}
            onChangeText={(value) => updateField('password', value)}
            onSubmitEditing={handleSubmit}
            error={showErrors ? passwordError : undefined}
          />
          <Pressable
            accessibilityRole="button"
            onPress={handleSubmit}
            style={({ pressed }) => [actionStyles.primary, pressed && actionStyles.pressed]}
          >
            <Text style={actionStyles.primaryLabel}>{isRegistration ? 'Criar conta' : 'Entrar'}</Text>
          </Pressable>
          {submission === 'validated' && (
            <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.feedback}>
              Campos validados. O envio será habilitado após a integração com a API.
            </Text>
          )}
          <Link href={isRegistration ? '/login' : '/cadastro'} replace asChild>
            <Pressable
              accessibilityRole="link"
              style={({ pressed }) => [actionStyles.secondary, pressed && actionStyles.pressed]}
            >
              <Text style={actionStyles.secondaryLabel}>
                {isRegistration ? 'Já tenho conta' : 'Criar conta de cuidador'}
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AccessField({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        accessibilityHint={error}
        underlineColorAndroid="transparent"
        style={[styles.input, error && styles.invalidInput]}
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
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  form: {
    width: '100%',
    maxWidth: 420,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    color: colors.heading,
    fontSize: 17,
  },
  invalidInput: {
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    fontSize: 15,
    lineHeight: 21,
  },
  feedback: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
  },
});
