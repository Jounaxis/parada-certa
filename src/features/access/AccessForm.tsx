import { useState } from 'react';
import { Keyboard, Text, View } from 'react-native';

import { AzulCivicoButton, AzulCivicoLink } from '../../components/AzulCivicoAction';
import { AzulCivicoField } from '../../components/AzulCivicoField';
import { getAuthErrorMessage } from './authActions';
import { useSession } from './SessionProvider';

type AccessMode = 'login' | 'registration';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function AccessForm({ mode }: { mode: AccessMode }) {
  const isRegistration = mode === 'registration';
  const { busy, login, register } = useSession();
  const [fields, setFields] = useState({ name: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const nameError = isRegistration && !fields.name.trim() ? 'Informe seu nome.' : undefined;
  const emailError = emailPattern.test(fields.email.trim()) ? undefined : 'Informe um e-mail válido.';
  const passwordError = !fields.password.trim()
    ? 'Informe sua senha.'
    : isRegistration && fields.password.length < 6
      ? 'Use pelo menos 6 caracteres.'
      : undefined;

  function updateField(field: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setRequestError(null);
  }

  async function handleSubmit() {
    if (busy) return;

    setSubmitted(true);
    setRequestError(null);
    if (nameError || emailError || passwordError) return;

    Keyboard.dismiss();
    const credentials = { email: fields.email.trim(), password: fields.password };

    try {
      if (isRegistration) {
        await register({ ...credentials, name: fields.name.trim() });
      } else {
        await login(credentials);
      }
    } catch (error) {
      setRequestError(getAuthErrorMessage(error));
    }
  }

  return (
    <View className="gap-control">
      <View className="mb-4 gap-control">
        {isRegistration && (
          <AzulCivicoField
            label="Nome"
            autoCapitalize="words"
            autoComplete="name"
            editable={!busy}
            value={fields.name}
            onChangeText={(value) => updateField('name', value)}
            error={submitted ? nameError : undefined}
          />
        )}
        <AzulCivicoField
          label="E-mail"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          editable={!busy}
          keyboardType="email-address"
          value={fields.email}
          onChangeText={(value) => updateField('email', value)}
          error={submitted ? emailError : undefined}
        />
        <AzulCivicoField
          label="Senha"
          autoCapitalize="none"
          autoComplete={isRegistration ? 'new-password' : 'current-password'}
          autoCorrect={false}
          editable={!busy}
          secureTextEntry
          returnKeyType="done"
          value={fields.password}
          onChangeText={(value) => updateField('password', value)}
          onSubmitEditing={handleSubmit}
          error={submitted ? passwordError : undefined}
        />
      </View>
      <AzulCivicoButton
        label={isRegistration ? 'Criar conta' : 'Entrar'}
        onPress={handleSubmit}
        busy={busy}
      />
      {requestError && (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="text-civic-message text-civic-error">
          {requestError}
        </Text>
      )}
      <AzulCivicoLink
        href={isRegistration ? '/login' : '/cadastro'}
        label={isRegistration ? 'Já tenho conta' : 'Criar conta de cuidador'}
        disabled={busy}
        replace
      />
    </View>
  );
}
