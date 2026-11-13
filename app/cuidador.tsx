import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { AzulCivicoButton, AzulCivicoLink } from '../src/components/AzulCivicoAction';
import { AzulCivicoField } from '../src/components/AzulCivicoField';
import { AzulCivicoScreen } from '../src/components/AzulCivicoScreen';
import { getAuthErrorMessage } from '../src/features/access/authActions';
import { useSession } from '../src/features/access/SessionProvider';
import { colors, spacing, typography } from '../src/styles/azulCivico';

export default function CaregiverScreen() {
  const { user, busy, saveName, logout } = useSession();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string>();
  const [requestError, setRequestError] = useState<{
    action: 'saveName' | 'logout';
    message: string;
  } | null>(null);

  if (!user) return null;

  async function handleSaveName() {
    if (!name.trim()) {
      setNameError('Informe seu nome.');
      return;
    }

    Keyboard.dismiss();
    setRequestError(null);

    try {
      await saveName(name.trim());
    } catch (error) {
      setRequestError({ action: 'saveName', message: getAuthErrorMessage(error) });
    }
  }

  async function handleLogout() {
    setRequestError(null);

    try {
      await logout();
    } catch (error) {
      setRequestError({ action: 'logout', message: getAuthErrorMessage(error) });
    }
  }

  return (
    <AzulCivicoScreen
      title="Área do Cuidador"
      footer={
        <View style={styles.footerActions}>
          <View style={styles.about}>
            <AzulCivicoLink href="/sobre" label="Sobre o App" disabled={busy} />
          </View>
          {requestError?.action === 'logout' && (
            <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.error}>
              {requestError.message}
            </Text>
          )}
          <AzulCivicoButton label="Sair" onPress={handleLogout} busy={busy} />
        </View>
      }
    >
      <View style={styles.content}>
        {user.name ? (
          <Text style={styles.greeting}>Olá, {user.name}.</Text>
        ) : (
          <View style={styles.nameForm}>
            <Text style={styles.text}>Informe seu nome para concluir o cadastro.</Text>
            <AzulCivicoField
              label="Nome"
              autoCapitalize="words"
              autoComplete="name"
              editable={!busy}
              returnKeyType="done"
              value={name}
              onChangeText={(value) => {
                setName(value);
                setNameError(undefined);
                setRequestError(null);
              }}
              onSubmitEditing={handleSaveName}
              error={nameError}
            />
            <AzulCivicoButton label="Salvar nome" onPress={handleSaveName} busy={busy} />
            {requestError?.action === 'saveName' && (
              <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.error}>
                {requestError.message}
              </Text>
            )}
          </View>
        )}
        {user.email && <Text style={styles.text}>{user.email}</Text>}
        <AzulCivicoLink href="/passageiros" label="Passageiros" variant="primary" disabled={busy} />
      </View>
    </AzulCivicoScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.controlGap,
  },
  footerActions: {
    width: '100%',
    gap: spacing.controlGap,
  },
  about: {
    alignSelf: 'center',
  },
  nameForm: {
    gap: spacing.controlGap,
  },
  greeting: {
    ...typography.control,
    color: colors.text,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  error: {
    ...typography.message,
    color: colors.error,
  },
});
