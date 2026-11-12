import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { AzulCivicoButton, AzulCivicoLink } from '../../components/AzulCivicoAction';
import { AzulCivicoField } from '../../components/AzulCivicoField';
import { colors, spacing, typography } from '../../styles/azulCivico';

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
    <View style={styles.form}>
      <View style={styles.fields}>
        {isRegistration && (
          <AzulCivicoField
            label="Nome"
            autoCapitalize="words"
            autoComplete="name"
            value={fields.name}
            onChangeText={(value) => updateField('name', value)}
            error={showErrors ? nameError : undefined}
          />
        )}
        <AzulCivicoField
          label="E-mail"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          value={fields.email}
          onChangeText={(value) => updateField('email', value)}
          error={showErrors ? emailError : undefined}
        />
        <AzulCivicoField
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
      </View>
      <AzulCivicoButton label={isRegistration ? 'Criar conta' : 'Entrar'} onPress={handleSubmit} />
      {submission === 'validated' && (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.feedback}>
          Campos validados. O envio será habilitado após a integração com a API.
        </Text>
      )}
      <AzulCivicoLink
        href={isRegistration ? '/login' : '/cadastro'}
        label={isRegistration ? 'Já tenho conta' : 'Criar conta de cuidador'}
        replace
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.controlGap,
  },
  fields: {
    gap: spacing.controlGap,
    marginBottom: spacing.sectionGap - spacing.controlGap,
  },
  feedback: {
    ...typography.message,
    color: colors.text,
  },
});
