import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

import { SessionProvider, useSession } from '../src/features/access/SessionProvider';

export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { restoring, user } = useSession();
  const background = useResolveClassNames('bg-civic-header-top');

  if (restoring) {
    return (
      <View className="flex-1 items-center justify-center gap-control bg-civic-header-top">
        <ActivityIndicator colorClassName="accent-civic-surface" />
        <Text accessibilityLiveRegion="polite" className="text-civic-body text-civic-surface">
          Carregando sessão…
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: background,
      }}
    >
      <Stack.Protected guard={!user} redirectTo="/cuidador">
        <Stack.Screen name="index" options={{ title: 'Parada Certa' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Cadastro de cuidador' }} />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(user)} redirectTo="/">
        <Stack.Screen name="cuidador" options={{ title: 'Área do Cuidador' }} />
        <Stack.Screen name="passageiros/index" options={{ title: 'Passageiros' }} />
        <Stack.Screen name="passageiros/novo" options={{ title: 'Novo passageiro' }} />
        <Stack.Screen name="passageiros/[id]" options={{ title: 'Editar passageiro' }} />
      </Stack.Protected>
      <Stack.Screen name="sobre" options={{ title: 'Sobre o App' }} />
    </Stack>
  );
}
