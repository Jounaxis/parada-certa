import { useState } from 'react';
import { Keyboard, Text, View } from 'react-native';

import { AzulCivicoButton, AzulCivicoLink } from '../src/components/AzulCivicoAction';
import { AzulCivicoField } from '../src/components/AzulCivicoField';
import { AzulCivicoScreen } from '../src/components/AzulCivicoScreen';
import { getAuthErrorMessage } from '../src/features/access/authActions';
import { useSession } from '../src/features/access/SessionProvider';

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
        <View className="w-full gap-control">
          <View className="self-center">
            <AzulCivicoLink href="/sobre" label="Sobre o App" disabled={busy} />
          </View>
          {requestError?.action === 'logout' && (
            <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="text-civic-message text-civic-error">
              {requestError.message}
            </Text>
          )}
          <AzulCivicoButton label="Sair" onPress={handleLogout} busy={busy} />
        </View>
      }
    >
      <View className="gap-control">
        {user.name ? (
          <Text className="text-civic-body font-semibold text-civic-text">Olá, {user.name}.</Text>
        ) : (
          <View className="gap-control">
            <Text className="text-civic-body text-civic-text">Informe seu nome para concluir o cadastro.</Text>
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
              <Text accessibilityLiveRegion="polite" accessibilityRole="alert" className="text-civic-message text-civic-error">
                {requestError.message}
              </Text>
            )}
          </View>
        )}
        {user.email && <Text className="text-civic-body text-civic-text">{user.email}</Text>}
        <AzulCivicoLink href="/passageiros" label="Passageiros" variant="primary" disabled={busy} />
      </View>
    </AzulCivicoScreen>
  );
}
